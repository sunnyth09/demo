import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
    unique: true
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
  shipping_fee: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    allowNull: true
  },
  discount_amount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0,
    allowNull: true
  },
  coupon_code: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING, // pending, confirmed, packing, picked_up, in_transit, arrived_hub, out_for_delivery, delivered, cancelled
    defaultValue: 'pending'
  },
  // Timestamp fields for tracking
  confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  packing_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  picked_up_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  in_transit_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  arrived_hub_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  out_for_delivery_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  cancelled_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

export default Order;
