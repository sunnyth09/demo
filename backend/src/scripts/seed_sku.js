
import { sequelize } from '../config/sequelize.js';
import Product from '../models/sequelize/Product.js';

const seedSku = async () => {
  try {
    console.log('--- Bắt đầu tạo mã sản phẩm (SKU) ---');
    
    await sequelize.authenticate();
    console.log('Kết nối database thành công.');

    const products = await Product.findAll({
      order: [['id', 'ASC']]
    });

    console.log(`Tìm thấy ${products.length} sản phẩm.`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const newSku = `BK-${String(i + 1).padStart(4, '0')}`;

      if (product.sku !== newSku) {
        process.stdout.write(`  #${product.id} ${product.name} -> ${newSku} ... `);
        try {
          await product.update({ sku: newSku });
          console.log('✅');
          updatedCount++;
        } catch (err) {
          console.log('❌', err.message);
        }
      } else {
        skippedCount++;
      }
    }

    console.log('\n--- Hoàn tất ---');
    console.log(`✅ Đã cập nhật: ${updatedCount}`);
    console.log(`⏭️  Bỏ qua (đã đúng): ${skippedCount}`);

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedSku();

