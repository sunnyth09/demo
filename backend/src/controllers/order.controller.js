import * as OrderService from "../services/order.service.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";
import { OrderStatusLog, User } from "../models/sequelize/index.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { 
      customer_name, 
      customer_phone, 
      customer_email, 
      shipping_address, 
      note, 
      payment_method, 
      items, 
      total_amount,
      shipping_fee 
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: false, message: "Giỏ hàng trống" });
    }

    const orderData = {
      user_id: userId,
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      note,
      payment_method,
      total_amount,
      shipping_fee: shipping_fee || 0,
      discount_amount: req.body.discount_amount || 0,
      coupon_code: req.body.coupon_code // Pass coupon code to service
    };

    const order = await OrderService.createOrder(orderData, items);

    // Log initial status
    await OrderStatusLog.create({
      order_id: order.id,
      from_status: null,
      to_status: 'pending',
      changed_by: userId,
      changed_by_name: customer_name || 'Khách vãng lai',
      note: 'Đơn hàng mới được tạo'
    });

    // Send confirmation email (Async - don't wait)
    if (order && order.customer_email) {
      sendOrderConfirmationEmail(order.customer_email, order).catch(err => {
        console.error('Failed to send confirmation email:', err);
      });
    }

    res.status(201).json({
      status: true,
      message: "Đặt hàng thành công",
      data: order
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: false,
      message: error.message || "Lỗi khi tạo đơn hàng"
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await OrderService.getMyOrders(userId);
    res.status(200).json({
      status: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    
    const result = await OrderService.getAllOrders(page, limit, search, status);
    
    res.status(200).json({
      status: true,
      data: result.orders,
      pagination: result.pagination
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await OrderService.getOrderById(req.params.id);
    res.status(200).json({
      status: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Check current status first
    const currentOrder = await OrderService.getOrderById(req.params.id);
    if (!currentOrder) {
      return res.status(404).json({ status: false, message: "Đơn hàng không tồn tại" });
    }

    // === STRICT STATUS VALIDATION ===
    const statusFlow = [
      'pending', 'confirmed', 'packing', 'picked_up', 
      'in_transit', 'arrived_hub', 'out_for_delivery', 'delivered'
    ];

    const validStatuses = [...statusFlow, 'request_cancel', 'cancelled'];

    // Validate new status is a known status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: `Trạng thái "${status}" không hợp lệ.`
      });
    }

    // Block any changes to delivered orders
    if (currentOrder.status === 'delivered') {
      return res.status(400).json({
        status: false,
        message: "Đơn hàng đã giao thành công, không thể thay đổi trạng thái."
      });
    }

    // Handle cancel flow separately
    if (status === 'cancelled') {
      // Admin can only cancel from: pending, confirmed, packing, request_cancel
      const cancellableStatuses = ['pending', 'confirmed', 'packing', 'request_cancel'];
      if (!cancellableStatuses.includes(currentOrder.status)) {
        return res.status(400).json({
          status: false,
          message: "Chỉ có thể hủy đơn hàng ở trạng thái: Chờ xác nhận, Đã xác nhận, Đang đóng gói, hoặc Yêu cầu hủy."
        });
      }
    } else if (status === 'request_cancel') {
      // request_cancel should only come from user route, not admin
      return res.status(400).json({
        status: false,
        message: "Admin không sử dụng trạng thái 'request_cancel'. Hãy dùng 'cancelled' để hủy trực tiếp."
      });
    } else {
      // Normal forward-only flow check
      const currentStatusIndex = statusFlow.indexOf(currentOrder.status);
      const newStatusIndex = statusFlow.indexOf(status);

      if (currentStatusIndex === -1) {
        // Current status is request_cancel, only allow cancelled (handled above)
        return res.status(400).json({
          status: false,
          message: "Đơn hàng đang yêu cầu hủy, chỉ có thể chuyển sang 'cancelled'."
        });
      }

      if (newStatusIndex < currentStatusIndex) {
        return res.status(400).json({ 
          status: false, 
          message: "Không thể cập nhật ngược trạng thái đơn hàng (Quy trình một chiều)." 
        });
      }
    }

    const previousStatus = currentOrder.status;
    const order = await OrderService.updateStatus(req.params.id, status);
    
    // Log status change with admin info
    await OrderStatusLog.create({
      order_id: order.id,
      from_status: previousStatus,
      to_status: status,
      changed_by: req.user.id,
      changed_by_name: req.user.name || req.user.email,
      note: req.body.note || null
    });

    // Send "Cancellation Confirmed" email if status changed to cancelled
    if (status === 'cancelled' && order.customer_email) {
      const { sendOrderCancelledEmail } = await import("../services/email.service.js");
      // Check if refund needed (paid orders)
      const needsRefund = order.payment_status === 'paid';
      sendOrderCancelledEmail(order.customer_email, order, order.cancel_reason, needsRefund).catch(err => {
         console.error('Failed to send cancellation confirmed email:', err);
      });
    }

    res.status(200).json({
      status: true,
      message: "Cập nhật trạng thái thành công",
      data: order
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const stats = await OrderService.getOrderStats(days);
    res.status(200).json({
      status: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

// User: Get my order by ID
export const getMyOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const order = await OrderService.getOrderById(req.params.id);
    
    // Check if order belongs to user
    if (!order || order.user_id !== userId) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    res.status(200).json({
      status: true,
      data: order
    });
  } catch (error) {
    res.status(404).json({
      status: false,
      message: error.message
    });
  }
};

// User: Cancel my order (only if pending or confirmed)
export const cancelMyOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cancel_reason } = req.body;
    const order = await OrderService.getOrderById(req.params.id);
    
    // Check if order belongs to user
    if (!order || order.user_id !== userId) {
      return res.status(404).json({
        status: false,
        message: "Không tìm thấy đơn hàng"
      });
    }

    // Only allow cancel if pending (confirmed and beyond cannot be cancelled by user)
    if (order.status !== 'pending') {
      return res.status(400).json({
        status: false,
        message: "Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xác nhận. Đơn hàng đã xác nhận vui lòng liên hệ admin."
      });
    }

    const previousStatus = order.status;
    const updatedOrder = await OrderService.updateStatus(req.params.id, 'request_cancel', {
      cancel_reason: cancel_reason || null
    });

    // Log user cancel request
    await OrderStatusLog.create({
      order_id: order.id,
      from_status: previousStatus,
      to_status: 'request_cancel',
      changed_by: userId,
      changed_by_name: req.user.name || req.user.email,
      note: cancel_reason || 'Người dùng yêu cầu hủy đơn'
    });

    // Send cancellation request email (async - don't wait)
    if (order.customer_email) {
      const { sendOrderCancelRequestEmail } = await import("../services/email.service.js");
      sendOrderCancelRequestEmail(order.customer_email, order, cancel_reason).catch(err => {
         console.error('Failed to send cancellation request email:', err);
      });
    }

    res.status(200).json({
      status: true,
      message: "Đã gửi yêu cầu hủy đơn hàng. Vui lòng chờ admin duyệt.",
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};

// Admin: Xem lịch sử thay đổi trạng thái đơn hàng
export const getOrderStatusLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const logs = await OrderStatusLog.findAll({
      where: { order_id: id },
      include: [{
        model: User,
        as: 'changedByUser',
        attributes: ['id', 'name', 'email', 'role']
      }],
      order: [['createdAt', 'ASC']]
    });

    res.status(200).json({
      status: true,
      data: logs
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};
