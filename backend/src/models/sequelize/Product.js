import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model Product (Sản phẩm)
 * 
 * Các trường:
 * - id: Khóa chính, tự tăng
 * - name: Tên sản phẩm (bắt buộc)
 * - slug: Đường dẫn thân thiện SEO
 * - price: Giá sản phẩm (bắt buộc)
 * - quantity: Số lượng tồn kho
 * - description: Mô tả sản phẩm
 * - category_id: ID danh mục
 * - thumbnail: Ảnh đại diện
 * - image: Ảnh gallery (JSON array)
 * - status: Trạng thái (active/inactive)
 * - created_at: Ngày tạo
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID sản phẩm'
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên sản phẩm'
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    comment: 'Slug URL thân thiện SEO (vd: sach-dac-nhan-tam)'
  },
  sku: {
    type: DataTypes.STRING(100),
    allowNull: true,
    unique: true,
    comment: 'Mã sản phẩm (SKU)'
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    comment: 'Giá sản phẩm (Giá bán thực tế)'
  },
  original_price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: null,
    comment: 'Giá gốc trước khi giảm (nếu có)'
  },
  discount_start: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày bắt đầu giảm giá'
  },
  discount_end: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Ngày kết thúc giảm giá'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: 'Số lượng tồn kho'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả sản phẩm'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID danh mục'
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: 'URL ảnh đại diện'
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Tác giả'
  },
  publisher: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Nhà xuất bản / Công ty phát hành'
  },
  publication_year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Năm xuất bản'
  },
  attributes: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Thông tin bổ sung JSON: { page_count, dimensions, cover_type, ... }'
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'JSON array chứa URLs ảnh gallery'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
    comment: 'Trạng thái: active = đang bán, inactive = ngừng bán'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo sản phẩm'
  }
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true, // Enable soft delete
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at'
});

export default Product;
