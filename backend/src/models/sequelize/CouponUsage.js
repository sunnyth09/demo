import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model CouponUsage - Tracking lịch sử sử dụng mã
 * 
 * Mỗi khi mã được apply vào đơn hàng, tạo 1 record ở đây
 */
const CouponUsage = sequelize.define('CouponUsage', {
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
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID đơn hàng (nếu có)'
  },
  discount_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Số tiền đã giảm'
  },
  used_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Thời điểm sử dụng'
  }
}, {
  tableName: 'coupon_usages',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['coupon_id'] },
    { fields: ['order_id'] }
  ]
});

export default CouponUsage;
