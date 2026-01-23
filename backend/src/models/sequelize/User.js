import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model User (Người dùng)
 * 
 * Các trường:
 * - id: Khóa chính, tự tăng
 * - name: Tên người dùng
 * - email: Email (unique, bắt buộc)
 * - password: Mật khẩu đã hash
 * - role: Vai trò (user/admin)
 * - created_at: Ngày tạo
 */
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID người dùng'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên người dùng'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    comment: 'Email đăng nhập (unique)'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Mật khẩu đã hash'
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    comment: 'Vai trò: user hoặc admin'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo tài khoản'
  }
}, {
  tableName: 'users',
  timestamps: false
});

export default User;
