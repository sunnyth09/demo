
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const ReviewReport = sequelize.define('ReviewReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Người báo cáo'
  },
  review_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Đánh giá bị báo cáo'
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Lý do báo cáo'
  },
  status: {
    type: DataTypes.ENUM('pending', 'resolved', 'ignored'),
    defaultValue: 'pending'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'review_reports',
  timestamps: false
});

export default ReviewReport;
