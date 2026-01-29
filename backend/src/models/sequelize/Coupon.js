import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Coupon = sequelize.define('Coupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('fixed', 'percentage', 'free_shipping'),
    defaultValue: 'fixed',
    comment: 'fixed: Giảm tiền cố định, percentage: Giảm theo %, free_shipping: Miễn phí vận chuyển'
  },
  value: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Số tiền hoặc % giảm'
  },
  min_order_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    comment: 'Giá trị đơn hàng tối thiểu để áp dụng'
  },
  max_discount_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    comment: 'Số tiền giảm tối đa (dùng cho loại percentage)'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    comment: 'Số lượng mã phát hành'
  },
  used_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Số lần đã sử dụng'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'coupons',
  timestamps: true
});

export default Coupon;
