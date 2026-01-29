/**
 * Seed dữ liệu khu vực vận chuyển
 * Cửa hàng: Ocean Books - Buôn Ma Thuột, Đắk Lắk
 */

import { ShippingZone } from '../models/sequelize/index.js';

const shippingZonesData = [
  {
    name: 'Nội thành Buôn Ma Thuột',
    districts: [
      'Thành phố Buôn Ma Thuột',
      'TP Buôn Ma Thuột',
      'Buôn Ma Thuột'
    ],
    provinces: ['Đắk Lắk', 'Dak Lak'],
    shipping_fee: 10000,
    free_shipping_threshold: 150000,
    priority: 100,
    estimated_days: '1-2 ngày',
    is_active: true
  },
  {
    name: 'Các huyện Đắk Lắk',
    districts: [],
    provinces: ['Đắk Lắk', 'Dak Lak', 'Đăk Lăk'],
    shipping_fee: 20000,
    free_shipping_threshold: 250000,
    priority: 90,
    estimated_days: '2-3 ngày',
    is_active: true
  },
  {
    name: 'Tây Nguyên',
    districts: [],
    provinces: [
      'Đắk Nông', 'Dak Nong',
      'Gia Lai',
      'Kon Tum',
      'Lâm Đồng', 'Lam Dong'
    ],
    shipping_fee: 25000,
    free_shipping_threshold: 300000,
    priority: 80,
    estimated_days: '2-4 ngày',
    is_active: true
  },
  {
    name: 'Miền Trung',
    districts: [],
    provinces: [
      'Bình Định', 'Binh Dinh',
      'Phú Yên', 'Phu Yen',
      'Khánh Hòa', 'Khanh Hoa',
      'Ninh Thuận', 'Ninh Thuan',
      'Bình Thuận', 'Binh Thuan',
      'Quảng Nam', 'Quang Nam',
      'Quảng Ngãi', 'Quang Ngai',
      'Đà Nẵng', 'Da Nang',
      'Thừa Thiên Huế', 'Thua Thien Hue'
    ],
    shipping_fee: 30000,
    free_shipping_threshold: 350000,
    priority: 70,
    estimated_days: '3-4 ngày',
    is_active: true
  },
  {
    name: 'TP. Hồ Chí Minh',
    districts: [],
    provinces: ['Hồ Chí Minh', 'Ho Chi Minh', 'TP.HCM', 'TPHCM', 'Sài Gòn', 'Saigon'],
    shipping_fee: 30000,
    free_shipping_threshold: 350000,
    priority: 75,
    estimated_days: '2-3 ngày',
    is_active: true
  },
  {
    name: 'Đông Nam Bộ',
    districts: [],
    provinces: [
      'Bình Dương', 'Binh Duong',
      'Đồng Nai', 'Dong Nai',
      'Bà Rịa - Vũng Tàu', 'Ba Ria Vung Tau',
      'Tây Ninh', 'Tay Ninh',
      'Bình Phước', 'Binh Phuoc'
    ],
    shipping_fee: 30000,
    free_shipping_threshold: 350000,
    priority: 65,
    estimated_days: '3-4 ngày',
    is_active: true
  },
  {
    name: 'Hà Nội',
    districts: [],
    provinces: ['Hà Nội', 'Ha Noi', 'Hanoi'],
    shipping_fee: 35000,
    free_shipping_threshold: 400000,
    priority: 60,
    estimated_days: '3-5 ngày',
    is_active: true
  },
  {
    name: 'Miền Bắc',
    districts: [],
    provinces: [
      'Hải Phòng', 'Hai Phong',
      'Quảng Ninh', 'Quang Ninh',
      'Bắc Ninh', 'Bac Ninh',
      'Hải Dương', 'Hai Duong',
      'Hưng Yên', 'Hung Yen',
      'Thái Bình', 'Thai Binh',
      'Nam Định', 'Nam Dinh',
      'Ninh Bình', 'Ninh Binh',
      'Vĩnh Phúc', 'Vinh Phuc',
      'Bắc Giang', 'Bac Giang',
      'Phú Thọ', 'Phu Tho',
      'Thái Nguyên', 'Thai Nguyen',
      'Thanh Hóa', 'Thanh Hoa',
      'Nghệ An', 'Nghe An',
      'Hà Tĩnh', 'Ha Tinh',
      'Quảng Bình', 'Quang Binh',
      'Quảng Trị', 'Quang Tri'
    ],
    shipping_fee: 35000,
    free_shipping_threshold: 400000,
    priority: 50,
    estimated_days: '4-6 ngày',
    is_active: true
  },
  {
    name: 'Miền Tây Nam Bộ',
    districts: [],
    provinces: [
      'Long An',
      'Tiền Giang', 'Tien Giang',
      'Bến Tre', 'Ben Tre',
      'Trà Vinh', 'Tra Vinh',
      'Vĩnh Long', 'Vinh Long',
      'Đồng Tháp', 'Dong Thap',
      'An Giang',
      'Kiên Giang', 'Kien Giang',
      'Cần Thơ', 'Can Tho',
      'Hậu Giang', 'Hau Giang',
      'Sóc Trăng', 'Soc Trang',
      'Bạc Liêu', 'Bac Lieu',
      'Cà Mau', 'Ca Mau'
    ],
    shipping_fee: 35000,
    free_shipping_threshold: 400000,
    priority: 45,
    estimated_days: '4-6 ngày',
    is_active: true
  },
  {
    name: 'Vùng núi phía Bắc',
    districts: [],
    provinces: [
      'Hà Giang', 'Ha Giang',
      'Cao Bằng', 'Cao Bang',
      'Bắc Kạn', 'Bac Kan',
      'Lạng Sơn', 'Lang Son',
      'Tuyên Quang', 'Tuyen Quang',
      'Yên Bái', 'Yen Bai',
      'Lào Cai', 'Lao Cai',
      'Điện Biên', 'Dien Bien',
      'Lai Châu', 'Lai Chau',
      'Sơn La', 'Son La',
      'Hòa Bình', 'Hoa Binh'
    ],
    shipping_fee: 45000,
    free_shipping_threshold: 500000,
    priority: 30,
    estimated_days: '5-7 ngày',
    is_active: true
  },
  {
    name: 'Hải đảo & Vùng xa',
    districts: [
      'Côn Đảo', 'Con Dao',
      'Phú Quốc', 'Phu Quoc',
      'Lý Sơn', 'Ly Son',
      'Trường Sa', 'Truong Sa',
      'Hoàng Sa', 'Hoang Sa'
    ],
    provinces: [],
    shipping_fee: 55000,
    free_shipping_threshold: 600000,
    priority: 10,
    estimated_days: '7-10 ngày',
    is_active: true
  },
  {
    name: 'Các tỉnh khác',
    districts: [],
    provinces: [],
    shipping_fee: 35000,
    free_shipping_threshold: 400000,
    priority: 0,
    estimated_days: '4-6 ngày',
    is_active: true
  }
];

export const seedShippingZones = async () => {
  try {
    // Check if already seeded
    const count = await ShippingZone.count();
    if (count > 0) {
      console.log('⏭️  Shipping zones đã có dữ liệu, bỏ qua seed');
      return;
    }

    // Seed data
    await ShippingZone.bulkCreate(shippingZonesData);
    console.log('✅ Đã seed', shippingZonesData.length, 'khu vực vận chuyển');
  } catch (error) {
    console.error('❌ Lỗi seed shipping zones:', error);
  }
};

// Run directly
if (process.argv[1].includes('seed_shipping_zones')) {
  import('../config/sequelize.js').then(async ({ sequelize }) => {
    await sequelize.sync({ alter: true });
    await seedShippingZones();
    process.exit(0);
  });
}

export default seedShippingZones;
