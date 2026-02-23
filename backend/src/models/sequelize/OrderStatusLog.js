import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.js';

const OrderStatusLog = sequelize.define('OrderStatusLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'ID đơn hàng'
  },
  from_status: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Trạng thái trước (null nếu là tạo mới)'
  },
  to_status: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Trạng thái sau'
  },
  changed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID user/admin thực hiện thay đổi (null nếu hệ thống tự động)'
  },
  changed_by_name: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Tên người thực hiện (snapshot tại thời điểm thay đổi)'
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú (vd: lý do hủy đơn)'
  }
}, {
  tableName: 'order_status_logs',
  timestamps: true,
  updatedAt: false // Chỉ cần createdAt, không cần updatedAt vì log là immutable
});

export default OrderStatusLog;
