import { Order, OrderItem, Product, sequelize } from "../models/sequelize/index.js";

/**
 * Create a new order
 */
export const createOrder = async (orderData, items) => {
  const transaction = await sequelize.transaction();

  try {
    // 1. Create Order
    const order = await Order.create({
      user_id: orderData.user_id || null,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_email: orderData.customer_email || null,
      shipping_address: orderData.shipping_address,
      note: orderData.note || null,
      payment_method: orderData.payment_method || 'cod',
      payment_status: 'pending',
      status: 'pending',
      total_amount: orderData.total_amount
    }, { transaction });

    // 2. Create Order Items and Update Product Quantity
    for (const item of items) {
      // Find product to check quantity (and get current price)
      const product = await Product.findByPk(item.id, { transaction });
      
      if (!product) {
        throw new Error(`Sản phẩm #${item.id} không tồn tại`);
      }

      if (product.quantity < item.quantity) {
        throw new Error(`Sản phẩm "${product.name}" không đủ số lượng tồn kho`);
      }

      // Create Order Item
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price,
        total_price: product.price * item.quantity
      }, { transaction });

      // Decrease Product Quantity
      await product.update({
        quantity: product.quantity - item.quantity
      }, { transaction });
    }

    // Commit
    await transaction.commit();
    return order;

  } catch (error) {
    // Rollback
    await transaction.rollback();
    throw error;
  }
};

/**
 * Get orders by user (sorted by latest)
 */
export const getMyOrders = async (userId) => {
  return await Order.findAll({
    where: { user_id: userId },
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['thumbnail', 'id', 'slug']
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Get all orders (Admin)
 */
export const getAllOrders = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await Order.findAndCountAll({
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['thumbnail']
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']],
    limit,
    offset
  });
  
  return {
    orders: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/**
 * Get order by ID
 */
export const getOrderById = async (orderId) => {
  const order = await Order.findByPk(orderId, {
    include: [
      {
        model: OrderItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['thumbnail', 'id', 'slug']
          }
        ]
      }
    ]
  });
  
  if (!order) {
    throw new Error(`Đơn hàng #${orderId} không tồn tại`);
  }
  
  return order;
};

/**
 * Update order status
 */
export const updateStatus = async (orderId, status) => {
  const order = await Order.findByPk(orderId);
  if (!order) {
    throw new Error(`Đơn hàng #${orderId} không tồn tại`);
  }
  
  await order.update({ status });
  return order;
};

/**
 * Get order statistics (Admin)
 */
export const getOrderStats = async () => {
  const pending = await Order.count({ where: { status: 'pending' } });
  const shipping = await Order.count({ where: { status: 'shipped' } });
  const completed = await Order.count({ where: { status: 'completed' } });
  const revenue = await Order.sum('total_amount', { where: { status: 'completed' } }) || 0;

  return {
    pending,
    shipping,
    completed,
    revenue
  };
};
