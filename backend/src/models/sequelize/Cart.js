import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // One user has only one cart
    comment: 'ID người dùng sở hữu giỏ hàng'
  }
}, {
  tableName: 'carts',
  timestamps: true
});

export default Cart;
