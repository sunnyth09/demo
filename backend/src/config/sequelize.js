import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Tạo kết nối Sequelize
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3309,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: false, // Không tự động thêm createdAt, updatedAt
      freezeTableName: true // Không tự động đổi tên bảng sang số nhiều
    }
  }
);

// Kiểm tra kết nối với retry mechanism
export const testConnection = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('✅ Sequelize: Kết nối database thành công!');
      return;
    } catch (error) {
      console.error(`❌ Sequelize: Không thể kết nối database (Lần thử ${i + 1}/${retries}):`, error.message);
      if (i === retries - 1) throw error;
      await new Promise(res => setTimeout(res, delay));
    }
  }
};
