import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID giỏ hàng'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID sản phẩm'
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: 1
    }
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['cart_id', 'product_id'] // Ensure one product only appears once per cart
    }
  ]
});

export default CartItem;
