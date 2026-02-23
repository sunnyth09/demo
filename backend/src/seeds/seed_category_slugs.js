/**
 * Seed slugs cho tất cả categories hiện có
 * Chạy: node src/seeds/seed_category_slugs.js
 */
import { sequelize } from '../config/sequelize.js';
import Category from '../models/sequelize/Category.js';

const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const seedCategorySlugs = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Thêm column slug nếu chưa có
    const queryInterface = sequelize.getQueryInterface();
    const tableDesc = await queryInterface.describeTable('categories');
    if (!tableDesc.slug) {
      await queryInterface.addColumn('categories', 'slug', {
        type: sequelize.Sequelize.DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      });
      console.log('✅ Đã thêm column slug vào bảng categories');
    }

    // Lấy tất cả categories
    const categories = await Category.findAll({ raw: true });
    console.log(`📦 Tìm thấy ${categories.length} danh mục`);

    // Tạo slug cho từng category
    const slugCounts = {};
    for (const cat of categories) {
      let slug = generateSlug(cat.name);
      
      // Đảm bảo unique
      if (slugCounts[slug]) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug]}`;
      } else {
        slugCounts[slug] = 1;
      }

      await Category.update({ slug }, { where: { id: cat.id } });
      console.log(`  ✏️  [${cat.id}] ${cat.name} → ${slug}`);
    }

    console.log('\n🎉 Seed category slugs hoàn tất!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Lỗi:', err.message);
    process.exit(1);
  }
};

seedCategorySlugs();
