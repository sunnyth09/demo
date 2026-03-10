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
    const { status, cancel_reason, note } = req.body;
    
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
        // Current status is request_cancel, allow cancelled (handled above) or pending (reject cancel)
        if (status !== 'pending') {
          return res.status(400).json({
            status: false,
            message: "Đơn hàng đang yêu cầu hủy, chỉ có thể chuyển sang 'cancelled' (Duyệt) hoặc 'pending' (Từ chối)."
          });
        }
      } else if (newStatusIndex < currentStatusIndex) {
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
      const actualCancelReason = cancel_reason || order.cancel_reason;
      sendOrderCancelledEmail(order.customer_email, order, actualCancelReason, needsRefund).catch(err => {
         console.error('Failed to send cancellation confirmed email:', err);
      });
    }

    // Send "Cancellation Rejected" email if status changed back to pending from request_cancel
    if (previousStatus === 'request_cancel' && status === 'pending' && order.customer_email) {
      const { sendOrderCancelRejectedEmail } = await import("../services/email.service.js");
      sendOrderCancelRejectedEmail(order.customer_email, order).catch(err => {
         console.error('Failed to send cancellation rejected email:', err);
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

export const bulkUpdateStatus = async (req, res) => {
  try {
    const { orderIds, status, cancel_reason } = req.body;
    
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ status: false, message: "Danh sách đơn hàng trống" });
    }

    const statusFlow = [
      'pending', 'confirmed', 'packing', 'picked_up', 
      'in_transit', 'arrived_hub', 'out_for_delivery', 'delivered'
    ];
    const validStatuses = [...statusFlow, 'request_cancel', 'cancelled'];

    if (!validStatuses.includes(status)) {
       return res.status(400).json({ status: false, message: `Trạng thái "${status}" không hợp lệ.` });
    }
    
    if (status === 'request_cancel') {
        return res.status(400).json({ status: false, message: "Admin không dùng 'request_cancel'." });
    }

    const { sendOrderCancelledEmail, sendOrderCancelRejectedEmail } = await import("../services/email.service.js");

    let successCount = 0;
    let failedCount = 0;
    const errors = [];

    // Process sequentially to ensure hooks/transactions apply safely per order
    for (const orderId of orderIds) {
      try {
        const currentOrder = await OrderService.getOrderById(orderId);
        if (!currentOrder) throw new Error("Không tồn tại");
        if (currentOrder.status === 'delivered') throw new Error("Đã giao thành công");

        if (status === 'cancelled') {
          const cancellableStatuses = ['pending', 'confirmed', 'packing', 'request_cancel'];
          if (!cancellableStatuses.includes(currentOrder.status)) {
             throw new Error("Trạng thái hiện tại không cho phép hủy");
          }
        } else {
          const currentStatusIndex = statusFlow.indexOf(currentOrder.status);
          const newStatusIndex = statusFlow.indexOf(status);

          if (currentStatusIndex === -1) {
             if (status !== 'pending') throw new Error("Đang yêu cầu hủy, chỉ có thể Hủy (cancelled) hoặc Từ chối (pending)");
          } else if (newStatusIndex < currentStatusIndex) {
             throw new Error("Không thể lùi trạng thái");
          } else if (newStatusIndex === currentStatusIndex) {
             throw new Error("Trạng thái không đổi");
          }
        }

        const previousStatus = currentOrder.status;
        const extraData = status === 'cancelled' ? { cancel_reason: cancel_reason || currentOrder.cancel_reason } : {};
        const order = await OrderService.updateStatus(orderId, status, extraData);

        await OrderStatusLog.create({
          order_id: order.id,
          from_status: previousStatus,
          to_status: status,
          changed_by: req.user.id,
          changed_by_name: req.user.name || req.user.email,
          note: req.body.note || (status === 'cancelled' && extraData.cancel_reason ? `Admin hủy đơn: ${extraData.cancel_reason}` : 'Cập nhật trạng thái hàng loạt')
        });

        if (status === 'cancelled' && order.customer_email) {
          const needsRefund = order.payment_status === 'paid';
          const actualCancelReason = cancel_reason || order.cancel_reason;
          sendOrderCancelledEmail(order.customer_email, order, actualCancelReason, needsRefund).catch(e => console.error(e));
        }

        if (previousStatus === 'request_cancel' && status === 'pending' && order.customer_email) {
          sendOrderCancelRejectedEmail(order.customer_email, order).catch(e => console.error(e));
        }

        successCount++;
      } catch (err) {
        failedCount++;
        errors.push(`Đơn #${orderId ? orderId.toString().slice(0,8).toUpperCase() : 'N/A'}: ${err.message}`);
      }
    }

    res.status(200).json({
      status: true,
      message: `Đã xử lý ${successCount + failedCount} đơn (Thành công: ${successCount}, Thất bại: ${failedCount}).`,
      data: { successCount, failedCount, errors }
    });

  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message
    });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const sort = req.query.sort || 'sold';
    const stats = await OrderService.getOrderStats(days, sort);
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
