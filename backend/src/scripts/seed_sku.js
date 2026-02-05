
import { sequelize } from '../config/sequelize.js';
import { Product, Category } from '../models/sequelize/index.js';

/**
 * Lấy chữ cái đầu của mỗi từ trong chuỗi
 * Ví dụ: "Nhà Giả Kim" -> "NGK"
 */
const getInitials = (str) => {
  if (!str) return 'GEN'; // General
  return str
    .normalize('NFD') // Chuẩn hóa unicode
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-zA-Z0-9\s]/g, '') // Bỏ ký tự đặc biệt
    .split(/\s+/) // Tách từ
    .map(word => word.charAt(0).toUpperCase()) // Lấy chữ cái đầu
    .join('')
    .substring(0, 6); // Lấy tối đa 6 ký tự
};

/**
 * Lấy mã danh mục từ tên danh mục
 */
const getCategoryCode = (categoryName) => {
  if (!categoryName) return 'GEN';
  return getInitials(categoryName).substring(0, 4);
};

const seedSku = async () => {
  try {
    console.log('--- Bắt đầu tạo SKU cho sản phẩm ---');
    
    // Test connection
    await sequelize.authenticate();
    console.log('Kết nối database thành công.');

    const products = await Product.findAll({
      include: [{
        model: Category,
        as: 'category',
        attributes: ['name']
      }],
      order: [['id', 'ASC']]
    });

    console.log(`Tìm thấy ${products.length} sản phẩm.`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      // Logic gen SKU: CAT-NAME-ID
      // Ví dụ: VH-NGK-0042
      
      const categoryName = product.category?.name || 'General';
      const catCode = getCategoryCode(categoryName);
      
      const nameInitials = getInitials(product.name);
      
      const idCode = product.id.toString().padStart(4, '0');
      
      const newSku = `${catCode}-${nameInitials}-${idCode}`;

      // Chỉ update nếu chưa có SKU hoặc muốn force update
      // Ở đây mình force update luôn cho đồng bộ pattern mới
      if (product.sku !== newSku) {
        process.stdout.write(`Updating Product ID ${product.id}: ${product.name} -> SKU: ${newSku}... `);
        
        try {
            await product.update({ sku: newSku });
            console.log('OK');
            updatedCount++;
        } catch (err) {
            console.log('FAILED');
            console.error(err.message);
        }
      } else {
        skippedCount++;
      }
    }

    console.log('--- Hoàn tất ---');
    console.log(`Đã cập nhật: ${updatedCount}`);
    console.log(`Bỏ qua (đã đúng): ${skippedCount}`);

  } catch (error) {
    console.error('Lỗi khi chạy script:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
};

seedSku();
