import { sequelize } from '../../config/sequelize.js';
import Category from './Category.js';
import Product from './Product.js';
import User from './User.js';

// ========== ĐỊNH NGHĨA QUAN HỆ GIỮA CÁC MODELS ==========

// Product thuộc về Category
Product.belongsTo(Category, { 
  foreignKey: 'category_id', 
  as: 'category' 
});

// Category có nhiều Product
Category.hasMany(Product, { 
  foreignKey: 'category_id', 
  as: 'products' 
});

// ========== HÀM ĐỒNG BỘ DATABASE ==========

/**
 * Đồng bộ tất cả models với database
 * 
 * Options:
 * - force: true = Xóa bảng cũ và tạo lại (MẤT DỮ LIỆU!)
 * - alter: true = Cập nhật schema mà KHÔNG mất dữ liệu (khuyến nghị cho development)
 * 
 * Lưu ý: Trong production, nên dùng migrations thay vì sync
 */
export const syncDatabase = async (options = {}) => {
  try {
    // Mặc định dùng alter: true để cập nhật schema mà không mất dữ liệu
    const syncOptions = {
      alter: true, // Tự động cập nhật schema khi có thay đổi
      ...options
    };
    
    await sequelize.sync(syncOptions);
    console.log('✅ Database synced thành công!');
  } catch (error) {
    console.error('❌ Lỗi sync database:', error);
    throw error;
  }
};

// Export tất cả models
export { sequelize, Category, Product, User };
