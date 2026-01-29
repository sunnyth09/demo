import { Coupon } from "../models/sequelize/index.js";
import { Op } from "sequelize";

/**
 * Create a new coupon
 */
export const createCoupon = async (data) => {
  // Check if code exists
  const existing = await Coupon.findOne({ where: { code: data.code } });
  if (existing) {
    throw new Error(`Mã giảm giá "${data.code}" đã tồn tại`);
  }
  return await Coupon.create(data);
};

/**
 * Get all coupons (Admin)
 */
export const getAllCoupons = async (isActiveOnly = false) => {
  const where = {};
  if (isActiveOnly) {
    where.is_active = true;
    where.start_date = { [Op.lte]: new Date() }; // Start date <= Now
    where.end_date = { [Op.gte]: new Date() };   // End date >= Now
    where.quantity = { [Op.gt]: 0 };             // Quantity > 0
  }
  
  return await Coupon.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Validate and apply coupon
 */
export const validateCoupon = async (code, orderAmount) => {
  const coupon = await Coupon.findOne({ where: { code } });
  
  if (!coupon) {
    throw new Error("Mã giảm giá không tồn tại");
  }

  if (!coupon.is_active) {
    throw new Error("Mã giảm giá đang bị khóa");
  }

  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    throw new Error("Mã giảm giá chưa đến thời gian hiệu lực");
  }

  if (coupon.end_date && new Date(coupon.end_date) < now) {
    throw new Error("Mã giảm giá đã hết hạn");
  }

  if (coupon.quantity <= 0) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng");
  }

  if (coupon.min_order_amount > orderAmount) {
    throw new Error(`Đơn hàng phải từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.min_order_amount)} mới được áp dụng`);
  }

  let discountAmount = 0;

  if (coupon.type === 'fixed') {
    discountAmount = parseFloat(coupon.value);
  } else if (coupon.type === 'percentage') {
    discountAmount = (parseFloat(orderAmount) * parseFloat(coupon.value)) / 100;
    
    // Check max discount
    if (coupon.max_discount_amount && parseFloat(coupon.max_discount_amount) > 0) {
       discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount_amount));
    }
  } else if (coupon.type === 'free_shipping') {
    // Return flag to let controller/checkout handle logic (shipping fee removal)
    return {
      isValid: true,
      coupon,
      type: 'free_shipping',
      discountAmount: 0 // Will be set to shipping fee later
    };
  }

  // Ensure discount doesn't exceed order amount
  discountAmount = Math.min(discountAmount, parseFloat(orderAmount));

  return {
    isValid: true,
    coupon,
    type: coupon.type,
    discountAmount
  };
};

/**
 * Delete coupon
 */
export const deleteCoupon = async (id) => {
  return await Coupon.destroy({ where: { id } });
};

/**
 * Update coupon
 */
export const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) {
    throw new Error("Mã giảm giá không tồn tại");
  }
  return await coupon.update(data);
};
