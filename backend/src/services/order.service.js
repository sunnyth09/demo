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
        attributes: ['product_name', 'quantity', 'price', 'total_price']
      }
    ],
    order: [['createdAt', 'DESC']]
  });
};
