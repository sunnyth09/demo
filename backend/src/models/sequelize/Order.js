import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Allow guest checkout (optional, but good for flexibility)
    comment: 'ID người dùng (nếu có)'
  },
  // Shipping Info (Snapshot)
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  customer_email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shipping_address: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  // Payment Info
  payment_method: {
    type: DataTypes.STRING, // cod, banking, momo
    defaultValue: 'cod'
  },
  payment_status: {
    type: DataTypes.STRING, // pending, paid, failed
    defaultValue: 'pending'
  },
  // Order Info
  total_amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING, // pending, processing, shipping, completed, cancelled
    defaultValue: 'pending'
  }
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;
