import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

/**
 * Model ShippingZone (Khu vực vận chuyển)
 * 
 * Dùng để cấu hình phí ship theo khu vực địa lý
 * Cửa hàng: Buôn Ma Thuột, Đắk Lắk
 */
const ShippingZone = sequelize.define('ShippingZone', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Tên khu vực (VD: Nội thành Buôn Ma Thuột)'
  },
  provinces: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Danh sách tỉnh/thành thuộc khu vực này'
  },
  districts: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Danh sách quận/huyện cụ thể (nếu có)'
  },
  shipping_fee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30000,
    comment: 'Phí vận chuyển (VNĐ)'
  },
  free_shipping_threshold: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 300000,
    comment: 'Miễn phí ship khi đơn hàng >= giá trị này'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: 'Độ ưu tiên (số cao = ưu tiên cao hơn khi match)'
  },
  estimated_days: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '2-3 ngày',
    comment: 'Thời gian giao hàng dự kiến'
  }
}, {
  tableName: 'shipping_zones',
  timestamps: true,
  underscored: true
});

export default ShippingZone;
