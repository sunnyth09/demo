import * as OrderService from "../services/order.service.js";
import { sendOrderConfirmationEmail } from "../services/email.service.js";

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

    // Check removed to allow flow validation logic to handle it (or strict flow will block it anyway)
    // if (currentOrder.status === 'delivered') { ... }

    const statusFlow = [
      'pending', 'confirmed', 'packing', 'picked_up', 
      'in_transit', 'arrived_hub', 'out_for_delivery', 'delivered'
    ];

    const currentStatusIndex = statusFlow.indexOf(currentOrder.status);
    const newStatusIndex = statusFlow.indexOf(status);

    // STRICT FLOW CHECK:
    if (currentStatusIndex !== -1 && newStatusIndex !== -1) {
       if (newStatusIndex < currentStatusIndex) {
          return res.status(400).json({ 
            status: false, 
            message: "Không thể cập nhật ngược trạng thái đơn hàng (Quy trình một chiều)." 
          });
       }
    }

    const order = await OrderService.updateStatus(req.params.id, status);
    
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

    // Only allow cancel if pending or confirmed
    const cancellableStatuses = ['pending', 'confirmed'];
    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        status: false,
        message: "Đơn hàng đã được xử lý, không thể hủy"
      });
    }

    const updatedOrder = await OrderService.updateStatus(req.params.id, 'request_cancel', {
      cancel_reason: cancel_reason || null
    });

    // Check if order was already paid -> add refund warning logic if needed later
    // For request, we just notify user request is sent
    
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

