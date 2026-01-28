import { Order, OrderItem, Product, User, sequelize } from "../models/sequelize/index.js";
import { Op } from "sequelize";

// ... (previous code)

/**
 * Get order statistics (Admin) - Dashboard V2
 */
export const getOrderStats = async (days = 7) => {
  // 1. Basic Counts
  const pending = await Order.count({ where: { status: 'pending' } });
  const processing = await Order.count({ where: { status: 'processing' } });
  const shipping = await Order.count({ where: { status: 'shipped' } });
  const completed = await Order.count({ where: { status: 'completed' } });
  const cancelled = await Order.count({ where: { status: 'cancelled' } });
  
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('total_amount', { where: { status: 'completed' } }) || 0;
  
  const totalProducts = await Product.count();
  const totalUsers = await User.count({ where: { role: 'user' } });

  // 2. Recent Orders
  const recentOrders = await Order.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
    include: [{
      model: OrderItem,
      as: 'items',
      include: [{ model: Product, as: 'product' }] // Include product to get thumbnail for modal
    }]
  });

  // 3. Top Selling Products
  const topProducts = await OrderItem.findAll({
    attributes: [
      'product_id',
      'product_name',
      [sequelize.fn('SUM', sequelize.col('OrderItem.quantity')), 'sold'],
      [sequelize.fn('SUM', sequelize.col('total_price')), 'revenue']
    ],
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['thumbnail']
      }
    ],
    group: ['product_id', 'product_name', 'product.id', 'product.thumbnail'],
    order: [[sequelize.literal('sold'), 'DESC']],
    limit: 5
  });

  // 4. Revenue Chart
  const revenueChart = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    // Start of day
    const startOfDay = new Date(dateString);
    startOfDay.setHours(0, 0, 0, 0);
    
    // End of day
    const endOfDay = new Date(dateString);
    endOfDay.setHours(23, 59, 59, 999);

    const dailyRevenue = await Order.sum('total_amount', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.between]: [startOfDay, endOfDay]
        }
      }
    }) || 0;

    revenueChart.push({
      date: dateString,
      day: `${date.getDate()}/${date.getMonth() + 1}`,
      revenue: dailyRevenue
    });
  }

  return {
    counts: {
      pending,
      processing,
      shipping,
      completed,
      cancelled,
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers
    },
    recentOrders,
    topProducts,
    revenueChart
  };
};
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
export const getAllOrders = async (page = 1, limit = 10, search = '', status = '') => {
  const offset = (page - 1) * limit;
  
  // Build where clause
  const where = {};
  
  if (status && status !== 'all') {
    where.status = status;
  }

  if (search) {
    const searchCondition = [
      { customer_name: { [Op.like]: `%${search}%` } },
      { customer_phone: { [Op.like]: `%${search}%` } }
    ];
    
    // If search looks like an ID (number), treat it as an ID search too or potential Order Code match if we had one
    if (!isNaN(search)) {
      searchCondition.push({ id: search });
    }

    where[Op.or] = searchCondition;
  }

  const { count, rows } = await Order.findAndCountAll({
    where,
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


