import { Order, OrderItem, Product, User, Coupon, CouponUsage, UserCoupon, Category, sequelize } from "../models/sequelize/index.js";
import { Op } from "sequelize";
import { validateCoupon } from "./coupon.service.js";

// ... (previous code)

/**
 * Get order statistics (Admin) - Dashboard V2
 */
export const getOrderStats = async (days = 7) => {
  // 1. Basic Counts - All 9 statuses
  const pending = await Order.count({ where: { status: 'pending' } });
  const confirmed = await Order.count({ where: { status: 'confirmed' } });
  const packing = await Order.count({ where: { status: 'packing' } });
  const picked_up = await Order.count({ where: { status: 'picked_up' } });
  const in_transit = await Order.count({ where: { status: 'in_transit' } });
  const arrived_hub = await Order.count({ where: { status: 'arrived_hub' } });
  const out_for_delivery = await Order.count({ where: { status: 'out_for_delivery' } });
  const delivered = await Order.count({ where: { status: 'delivered' } });
  const cancelled = await Order.count({ where: { status: 'cancelled' } });
  
  // Legacy counts for backward compatibility
  const processing = confirmed + packing;
  const shipping = picked_up + in_transit + arrived_hub + out_for_delivery;
  const completed = delivered;
  
  const totalOrders = await Order.count();
  const totalRevenue = await Order.sum('total_amount', { where: { status: 'delivered' } }) || 0;
  
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
        status: 'delivered',
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
      confirmed,
      packing,
      picked_up,
      in_transit,
      arrived_hub,
      out_for_delivery,
      delivered,
      cancelled,
      // Legacy
      processing,
      shipping,
      completed,
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
    // 0. Pre-fetch all products to verify Price and Category
    const productIds = items.map(item => item.id);
    const products = await Product.findAll({
      where: { id: productIds },
      include: [{ model: Category, as: 'category' }], // Ensure Category is included for coupon check
      transaction,
      lock: transaction.LOCK.UPDATE // Lock products to prevent overselling during check
    });

    if (products.length !== items.length) {
       throw new Error("Một số sản phẩm không tồn tại hoặc đã bị xóa");
    }

    // Map passed items to real products to calculate total and build enriched list
    let verifiedTotalAmount = 0; // Subtotal of items
    const enrichedItems = items.map(item => {
       const product = products.find(p => p.id === item.id);
       if (!product) throw new Error(`Sản phẩm ID ${item.id} không tìm thấy`);
       
       if (product.quantity < item.quantity) {
          throw new Error(`Sản phẩm "${product.name}" không đủ số lượng tồn kho (Còn: ${product.quantity})`);
       }

       const lineTotal = parseFloat(product.price) * parseInt(item.quantity);
       verifiedTotalAmount += lineTotal;

       return {
          ...item, // quantity
          product, // Full product data
          price: product.price, // Trust DB price
          category_id: product.category_id // For coupon check
       };
    });

    // 0.1 Handle Coupon Logic (Server-side calculation)
    let appliedCoupon = null;
    let finalDiscountAmount = 0;

    if (orderData.coupon_code) {
      // Pass enriched items (with DB prices/categories) to validateCoupon
      // Note: validateCoupon expects { price, quantity, category_id }
      // It also checks min_order_amount against eligible subtotal.
      
      try {
        const couponResult = await validateCoupon(
           orderData.coupon_code, 
           verifiedTotalAmount, 
           orderData.user_id, 
           enrichedItems
        );
        
        appliedCoupon = couponResult.coupon;
        finalDiscountAmount = couponResult.discountAmount;

        // Handle free shipping coupon
        if (couponResult.type === 'free_shipping') {
            finalDiscountAmount = orderData.shipping_fee || 0;
        }
      } catch (err) {
         throw new Error(`Lỗi áp dụng mã giảm giá: ${err.message}`);
      }
    }
    
    
    // 0.2 Decrement Coupon Quantity (Action)
    if (appliedCoupon) {
      await appliedCoupon.decrement('quantity', { transaction });
    }

    // 1. Create Order
    // Calculate Final Total to Pay
    const shippingFee = orderData.shipping_fee || 0;
    const finalTotal = Math.max(0, verifiedTotalAmount + shippingFee - finalDiscountAmount);

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
      total_amount: finalTotal, // Use calculated total
      shipping_fee: shippingFee,
      discount_amount: finalDiscountAmount
    }, { transaction });

    // 1.1 Record Coupon Usage
    if (appliedCoupon && orderData.user_id) {
      await CouponUsage.create({
        user_id: orderData.user_id,
        coupon_id: appliedCoupon.id,
        order_id: order.id,
        discount_amount: finalDiscountAmount
      }, { transaction });

      // 1.2 Update UserCoupon status (Mark as used)
      // Check total usage
      const currentUsageCount = await CouponUsage.count({
        where: { user_id: orderData.user_id, coupon_id: appliedCoupon.id },
        transaction
      });

      if (currentUsageCount >= appliedCoupon.max_uses_per_user) {
        await UserCoupon.update(
          { is_used: true, used_at: new Date() },
          { 
            where: { user_id: orderData.user_id, coupon_id: appliedCoupon.id },
            transaction
          }
        );
      }
    }

    // 2. Create Order Items and Update Product Quantity
    // We already have enrichedItems with product instances
    for (const item of enrichedItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total_price: item.product.price * item.quantity
      }, { transaction });

      // Update Stock
      await item.product.update({
        quantity: item.product.quantity - item.quantity
      }, { transaction });
    }

    // Commit
    await transaction.commit();
    
    // Return full order with items for email/frontend
    // NOTE: Query này PHẢI nằm ngoài try-catch vì transaction đã commit
    // Nếu fail ở đây mà vẫn gọi rollback() → crash
    return await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

  } catch (error) {
    // Chỉ rollback nếu transaction chưa commit/rollback
    if (!transaction.finished) {
      await transaction.rollback();
    }
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

    // Handle order code search (strip # if present and lowercase)
    const cleanSearch = search.replace('#', '').toLowerCase();
    searchCondition.push({ order_code: { [Op.like]: `%${cleanSearch}%` } });
    
    // If search looks like an ID (number), treat it as an ID search too
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
export const updateStatus = async (orderId, newStatus, extraData = {}) => {
  const transaction = await sequelize.transaction();

  try {
    const order = await Order.findByPk(orderId, {
       include: [{ model: OrderItem, as: 'items' }]
    });

    if (!order) {
      throw new Error(`Đơn hàng #${orderId} không tồn tại`);
    }

    // Only proceed if status is actually changing and logic is needed
    if (order.status === newStatus) {
        await transaction.rollback();
        return order;
    }

    // Handle Restoration if Cancelled
    if (newStatus === 'cancelled' && order.status !== 'cancelled') {
       // 1. Restore Stock
       for (const item of order.items) {
          await Product.increment('quantity', { 
             by: item.quantity, 
             where: { id: item.product_id },
             transaction 
          });
       }

       // 2. Restore Coupon
       const couponUsage = await CouponUsage.findOne({ 
          where: { order_id: order.id },
          transaction
       });

       if (couponUsage) {
          // Increment Coupon Quantity
          await Coupon.increment('quantity', { 
             by: 1, 
             where: { id: couponUsage.coupon_id },
             transaction 
          });

          // Delete Usage Record (so user can use again if allowed)
          await couponUsage.destroy({ transaction });
          
          // Legacy check for UserCoupon unlock
       }
    }
    // request_cancel: Just update status, no restoration yet

    // Map status -> timestamp field
    const timestampField = {
      'confirmed': 'confirmed_at',
      'packing': 'packing_at',
      'picked_up': 'picked_up_at',
      'in_transit': 'in_transit_at',
      'arrived_hub': 'arrived_hub_at',
      'out_for_delivery': 'out_for_delivery_at',
      'delivered': 'delivered_at',
      'cancelled': 'cancelled_at'
    };

    const updateData = { status: newStatus };
    
    // Record timestamp for the new status
    if (timestampField[newStatus]) {
      updateData[timestampField[newStatus]] = new Date();
    }

    // Auto-update payment status for COD when delivered
    if (newStatus === 'delivered' && order.payment_method === 'cod' && order.payment_status === 'pending') {
      updateData.payment_status = 'paid';
    }

    // Save cancel reason if provided (for both request and final cancel)
    if ((newStatus === 'cancelled' || newStatus === 'request_cancel') && extraData.cancel_reason) {
      updateData.cancel_reason = extraData.cancel_reason;
    }

    await order.update(updateData, { transaction });
    
    await transaction.commit();
    return order;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
