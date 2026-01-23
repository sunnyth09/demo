import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model Category (Danh mục sản phẩm)
 * 
 * Các trường:
 * - id: Khóa chính, tự tăng
 * - name: Tên danh mục (bắt buộc)
 * - description: Mô tả
 * - icon: Icon của danh mục
 * - status: Trạng thái hoạt động (true/false)
 * - parent_id: ID danh mục cha (cho danh mục đa cấp)
 */
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID danh mục'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên danh mục'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả danh mục'
  },
  icon: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Icon của danh mục'
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: 'Trạng thái: true = hoạt động, false = ẩn'
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID danh mục cha (null = danh mục gốc)'
  }
}, {
  tableName: 'categories',
  timestamps: false
});

// Quan hệ tự tham chiếu: Category có thể có parent
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });

export default Category;
