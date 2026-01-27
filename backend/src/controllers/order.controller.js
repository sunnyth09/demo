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
      total_amount 
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
      total_amount
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
    
    const result = await OrderService.getAllOrders(page, limit);
    
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
    const stats = await OrderService.getOrderStats();
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
