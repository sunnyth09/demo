import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model Address (Địa chỉ giao hàng)
 */
const Address = sequelize.define('Address', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tên người nhận'
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Số điện thoại người nhận'
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  district: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ward: {
    type: DataTypes.STRING,
    allowNull: false
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Địa chỉ cụ thể (số nhà, đường)'
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'addresses',
  timestamps: true // created_at, updated_at
});

export default Address;
