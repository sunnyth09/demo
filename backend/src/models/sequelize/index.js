import { sequelize } from '../../config/sequelize.js';
import Category from './Category.js';
import Product from './Product.js';
import User from './User.js';
import Address from './Address.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import ShippingZone from './ShippingZone.js';
import Coupon from './Coupon.js';
import Article from './Article.js';
import Favorite from './Favorite.js';
import Review from './Review.js';
import ReviewReport from './ReviewReport.js';
import UserCoupon from './UserCoupon.js';
import CouponUsage from './CouponUsage.js';

// ========== ĐỊNH NGHĨA QUAN HỆ GIỮA CÁC MODELS ==========

// ... existing associations ...

// Review associations
User.hasMany(Review, {
  foreignKey: 'user_id',
  as: 'reviews'
});

Review.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Product.hasMany(Review, {
  foreignKey: 'product_id',
  as: 'reviews'
});

Review.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// Review Report associations
Review.hasMany(ReviewReport, {
  foreignKey: 'review_id',
  as: 'reports'
});

ReviewReport.belongsTo(Review, {
  foreignKey: 'review_id',
  as: 'review'
});

User.hasMany(ReviewReport, {
  foreignKey: 'user_id',
  as: 'reported_reviews'
});

ReviewReport.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'reporter'
});

// ========== HÀM ĐỒNG BỘ DATABASE ==========


// Product thuộc về Category
Product.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

// Category có nhiều Product
Category.hasMany(Product, { 
  foreignKey: 'category_id', 
  as: 'products' 
});

// User có nhiều Address
User.hasMany(Address, {
  foreignKey: 'user_id',
  as: 'addresses'
});

// Address thuộc về User
Address.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// User có nhiều Order
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders'
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

// Order có nhiều OrderItem
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// OrderItem liên kết với Product (để tham chiếu ngược nếu cần)
OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// User favorites
User.hasMany(Favorite, {
  foreignKey: 'user_id',
  as: 'favorites'
});

Favorite.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Product.hasMany(Favorite, {
  foreignKey: 'product_id',
  as: 'favoritedBy'
});

Favorite.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product'
});

// ========== COUPON ASSOCIATIONS ==========

// Coupon thuộc về Category (optional)
Coupon.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});

Category.hasMany(Coupon, {
  foreignKey: 'category_id',
  as: 'coupons'
});

// UserCoupon - Mã đã gán cho user
User.hasMany(UserCoupon, {
  foreignKey: 'user_id',
  as: 'userCoupons'
});

UserCoupon.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Coupon.hasMany(UserCoupon, {
  foreignKey: 'coupon_id',
  as: 'claimedBy'
});

UserCoupon.belongsTo(Coupon, {
  foreignKey: 'coupon_id',
  as: 'coupon'
});

// CouponUsage - Lịch sử sử dụng
User.hasMany(CouponUsage, {
  foreignKey: 'user_id',
  as: 'couponUsages'
});

CouponUsage.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Coupon.hasMany(CouponUsage, {
  foreignKey: 'coupon_id',
  as: 'usages'
});

CouponUsage.belongsTo(Coupon, {
  foreignKey: 'coupon_id',
  as: 'coupon'
});

Order.hasOne(CouponUsage, {
  foreignKey: 'order_id',
  as: 'couponUsage'
});

CouponUsage.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order'
});

// ========== HÀM ĐỒNG BỘ DATABASE ==========

/**
 * Đồng bộ tất cả models với database
 * 
 * Options:
 * - force: true = Xóa bảng cũ và tạo lại (MẤT DỮ LIỆU!)
 * - alter: true = Cập nhật schema mà KHÔNG mất dữ liệu (khuyến nghị cho development)
 * 
 * Lưu ý: Trong production, nên dùng migrations thay vì sync
 */
export const syncDatabase = async (options = {}) => {
  try {
    // Mặc định dùng alter: true để cập nhật schema mà không mất dữ liệu
    const syncOptions = {
      alter: true, // Tự động cập nhật schema khi có thay đổi
      ...options
    };
    
    await sequelize.sync(syncOptions);
    console.log('✅ Database synced thành công!');
  } catch (error) {
    console.error('❌ Lỗi sync database:', error);
    throw error;
  }
};

// Export tất cả models
export { sequelize, Category, Product, User, Address, Order, OrderItem, ShippingZone, Coupon, Article, Favorite, Review, ReviewReport, UserCoupon, CouponUsage };

