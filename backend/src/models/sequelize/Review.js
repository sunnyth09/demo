
import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID đánh giá'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    },
    comment: 'Số sao (1-5)'
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Nội dung đánh giá'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID người dùng'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID sản phẩm'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo'
  },
  is_hidden: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Trạng thái ẩn/hiện'
  }
}, {
  tableName: 'reviews',
  timestamps: false
});

export default Review;
