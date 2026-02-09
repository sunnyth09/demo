import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model Contact (Liên hệ)
 * 
 * Các trường:
 * - id: Khóa chính
 * - name: Tên người gửi
 * - email: Email người gửi
 * - subject: Tiêu đề
 * - message: Nội dung
 * - status: Trạng thái (pending/replied)
 * - created_at: Ngày gửi
 */
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID liên hệ'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên người liên hệ'
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    },
    comment: 'Email người liên hệ'
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tiêu đề liên hệ'
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: 'Nội dung liên hệ'
  },
  status: {
    type: DataTypes.ENUM('pending', 'replied'),
    defaultValue: 'pending',
    comment: 'Trạng thái: pending (chưa xử lý) hoặc replied (đã phản hồi)'
  },
  reply_message: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Nội dung phản hồi từ admin'
  },
  replied_at: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian phản hồi'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Thời gian gửi'
  }
}, {
  tableName: 'contacts',
  timestamps: false
});

export default Contact;
