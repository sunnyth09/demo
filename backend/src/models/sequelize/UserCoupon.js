import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model UserCoupon - Lưu mã đã gán cho user
 * 
 * source:
 * - claim: User tự claim từ Săn Voucher
 * - welcome: Tặng khi đăng ký
 * - first_order: Tặng sau đơn đầu tiên
 * - manual: Admin gán tay
 */
const UserCoupon = sequelize.define('UserCoupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người dùng'
  },
  coupon_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID mã giảm giá'
  },
  source: {
    type: DataTypes.ENUM('claim', 'welcome', 'first_order', 'manual'),
    defaultValue: 'claim',
    comment: 'Nguồn gốc mã: claim/welcome/first_order/manual'
  },
  claimed_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Thời điểm claim/nhận mã'
  },
  is_used: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Đã sử dụng chưa'
  },
  used_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời điểm sử dụng'
  },
  seen_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời điểm user xem (cho badge thông báo)'
  }
}, {
  tableName: 'user_coupons',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['coupon_id'] },
    { unique: true, fields: ['user_id', 'coupon_id'] } // Mỗi user chỉ có 1 record cho mỗi mã
  ]
});

export default UserCoupon;
