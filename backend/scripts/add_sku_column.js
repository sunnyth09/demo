import { sequelize } from '../src/config/sequelize.js';

const migrate = async () => {
    try {
        console.log('🔄 Bắt đầu thêm cột sku vào bảng products...');

        // Kiểm tra xem cột đã tồn tại chưa
        const [columns] = await sequelize.query(`SHOW COLUMNS FROM products LIKE 'sku'`);

        if (columns.length > 0) {
            console.log('⚠️ Cột sku đã tồn tại, bỏ qua.');
        } else {
            // Bỏ UNIQUE constraint vì lỗi Too many keys
            await sequelize.query(`
        ALTER TABLE products 
        ADD COLUMN sku VARCHAR(100) NULL COMMENT 'Mã sản phẩm (SKU)';
      `);
            console.log('✅ Đã thêm cột sku thành công (không có UNIQUE constraint)!');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Lỗi khi migration:', error);
        process.exit(1);
    }
};

migrate();
