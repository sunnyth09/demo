/**
 * Seed dữ liệu Mã Giảm Giá (Coupons)
 */

import { Coupon } from '../models/sequelize/index.js';

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);
const nextYear = new Date();
nextYear.setFullYear(today.getFullYear() + 1);

const couponsData = [
  // --- Giảm giá theo % (Percentage) ---
  {
    code: 'SALE30',
    description: 'Giảm 30% cho đơn hàng bất kỳ',
    type: 'percentage',
    value: 30,
    min_order_amount: 0,
    max_discount_amount: 50000,
    quantity: 100,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'HELLOSUMMER',
    description: 'Chào hè rực rỡ giảm 15%',
    type: 'percentage',
    value: 15,
    min_order_amount: 150000,
    max_discount_amount: 30000,
    quantity: 200,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'FLASH50',
    description: 'Flash Sale giảm 50% tối đa 20k',
    type: 'percentage',
    value: 50,
    min_order_amount: 0,
    max_discount_amount: 20000,
    quantity: 50,
    start_date: today,
    end_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
    is_active: true
  },
  {
    code: 'VIPUSER',
    description: 'Giảm 25% cho khách hàng thân thiết',
    type: 'percentage',
    value: 25,
    min_order_amount: 500000,
    max_discount_amount: 200000,
    quantity: 500,
    start_date: today,
    end_date: nextYear,
    is_active: true
  },
  {
    code: 'BOOKLOVER',
    description: 'Giảm 10% trọn đời cho người yêu sách',
    type: 'percentage',
    value: 10,
    min_order_amount: 100000,
    max_discount_amount: null, // Unlimited
    quantity: 1000,
    start_date: today,
    end_date: nextYear,
    is_active: true
  },

  // --- Giảm tiền trực tiếp (Fixed) ---
  {
    code: 'WELCOME20K',
    description: 'Giảm 20k cho đơn hàng đầu tiên',
    type: 'fixed',
    value: 20000,
    min_order_amount: 100000,
    quantity: 1000,
    start_date: today,
    end_date: nextYear,
    is_active: true
  },
  {
    code: 'TET2026',
    description: 'Lì xì 50k nhân dịp Tết',
    type: 'fixed',
    value: 50000,
    min_order_amount: 300000,
    quantity: 200,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'GIAM100K',
    description: 'Giảm ngay 100k cho đơn từ 1 triệu',
    type: 'fixed',
    value: 100000,
    min_order_amount: 1000000,
    quantity: 50,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'COFFEEBOOK',
    description: 'Tặng 15k tiền cà phê khi mua sách',
    type: 'fixed',
    value: 15000,
    min_order_amount: 50000,
    quantity: 300,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'THANKYOU',
    description: 'Mã tri ân giảm 10k',
    type: 'fixed',
    value: 10000,
    min_order_amount: 0,
    quantity: 500,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },

  // --- Miễn phí vận chuyển (Free Shipping) ---
  {
    code: 'FREESHIP',
    description: 'Miễn phí vận chuyển toàn quốc',
    type: 'free_shipping',
    value: 0,
    min_order_amount: 250000,
    quantity: 100,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'FREESHIP50K',
    description: 'Freeship cho đơn từ 50k',
    type: 'free_shipping',
    value: 0,
    min_order_amount: 50000,
    quantity: 50,
    start_date: today,
    end_date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days
    is_active: true
  },
  {
    code: 'SHIP0D',
    description: 'Ship 0 đồng ngày đôi',
    type: 'free_shipping',
    value: 0,
    min_order_amount: 0,
    quantity: 20,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'HANOISHIP',
    description: 'Freeship khu vực Hà Nội',
    type: 'free_shipping',
    value: 0,
    min_order_amount: 150000,
    quantity: 100,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'SAIGONSHIP',
    description: 'Freeship khu vực Hồ Chí Minh',
    type: 'free_shipping',
    value: 0,
    min_order_amount: 150000,
    quantity: 100,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },

  // --- Hỗn hợp / Khác ---
  {
    code: 'BLACKFRIDAY',
    description: 'Siêu giảm giá Black Friday 70%',
    type: 'percentage',
    value: 70,
    min_order_amount: 0,
    max_discount_amount: 500000,
    quantity: 10,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'WEEKEND',
    description: 'Cuối tuần vui vẻ giảm 5k',
    type: 'fixed',
    value: 5000,
    min_order_amount: 50000,
    quantity: 100,
    start_date: today,
    end_date: nextMonth,
    is_active: true
  },
  {
    code: 'STUDENT',
    description: 'Ưu đãi sinh viên 5%',
    type: 'percentage',
    value: 5,
    min_order_amount: 0,
    max_discount_amount: 50000,
    quantity: 1000,
    start_date: today,
    end_date: nextYear,
    is_active: true
  },
  {
    code: 'OLD2025',
    description: 'Mã cũ đã hết hạn (Test)',
    type: 'fixed',
    value: 50000,
    min_order_amount: 0,
    quantity: 10,
    start_date: new Date('2025-01-01'),
    end_date: new Date('2025-01-31'),
    is_active: false // Đã hết hạn
  },
  {
    code: 'TESTERR',
    description: 'Mã bị khóa tạm thời',
    type: 'percentage',
    value: 99,
    min_order_amount: 0,
    quantity: 1,
    start_date: today,
    end_date: nextMonth,
    is_active: false // Bị khóa
  }
];

export const seedCoupons = async () => {
  try {
    // Check if seeded
    const count = await Coupon.count();
    if (count > 0) {
      console.log('⏭️  Coupons đã có dữ liệu (' + count + '), chèn thêm...');
      // Bạn có thể chọn return ở đây nếu không muốn chèn thêm
    }

    // Seed data. Sử dụng bulkCreate với updateOnDuplicate nếu muốn
    // Hoặc kiểm tra từng mã để tránh lỗi Duplicate entry
    
    let successCount = 0;
    for (const coupon of couponsData) {
      const exists = await Coupon.findOne({ where: { code: coupon.code } });
      if (!exists) {
        await Coupon.create(coupon);
        successCount++;
      }
    }

    console.log('✅ Đã seed thêm', successCount, 'mã giảm giá');
  } catch (error) {
    console.error('❌ Lỗi seed coupons:', error);
  }
};

// Run directly
if (process.argv[1].includes('seed_coupons')) {
  import('../config/sequelize.js').then(async ({ sequelize }) => {
    try {
        await sequelize.authenticate();
        await seedCoupons();
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
  });
}

export default seedCoupons;
