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
 * - google_id: ID Google (nếu có)
 * - facebook_id: ID Facebook (nếu có)
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
  google_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Google ID'
  },
  facebook_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Facebook ID'
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Mật khẩu đã hash (có thể null nếu login bằng Google/FB)'
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    comment: 'Vai trò: user hoặc admin'
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Số điện thoại'
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL ảnh đại diện'
  },
  otp_code: {
    type: DataTypes.STRING(6),
    allowNull: true,
    comment: 'Mã OTP quên mật khẩu'
  },
  otp_expires_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian hết hạn OTP'
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
