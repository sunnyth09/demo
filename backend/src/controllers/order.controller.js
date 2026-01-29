import * as OrderService from "../services/order.service.js";

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
      discount_amount: req.body.discount_amount || 0
    };

    const order = await OrderService.createOrder(orderData, items);

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

    if (currentOrder.status === 'delivered') {
      return res.status(400).json({ status: false, message: "Đơn hàng đã hoàn thành, không thể thay đổi trạng thái" });
    }

    const order = await OrderService.updateStatus(req.params.id, status);
    
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

    const updatedOrder = await OrderService.updateStatus(req.params.id, 'cancelled');
    
    res.status(200).json({
      status: true,
      message: "Đã hủy đơn hàng",
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message
    });
  }
};
