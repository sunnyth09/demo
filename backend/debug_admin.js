
import { User, Coupon, UserCoupon } from './src/models/sequelize/index.js';
import * as CouponService from './src/services/coupon.service.js';
import { sequelize } from './src/models/sequelize/index.js';

async function debug() {
  try {
    console.log('Connecting to DB...');
    await sequelize.authenticate();
    console.log('Connected.');

    // 1. Find Admin
    const admin = await User.findOne({ where: { role: 'admin' } });
    if (!admin) {
      console.log('No admin found!');
      return;
    }
    console.log(`Found Admin: ${admin.email} (ID: ${admin.id})`);

    // 2. Find a Public Coupon
    const coupon = await Coupon.findOne({ where: { is_public: true, is_active: true } });
    if (!coupon) {
      console.log('No public coupon found!');
      return;
    }
    console.log(`Found Coupon: ${coupon.code} (ID: ${coupon.id})`);

    // 3. Check existing
    const existing = await UserCoupon.findOne({ where: { user_id: admin.id, coupon_id: coupon.id } });
    if (existing) {
        console.log('Admin ALREADY has this coupon. Deleting for test...');
        await existing.destroy();
    }

    // 4. Try to claim
    console.log('Attempting to claim...');
    const result = await CouponService.claimCoupon(admin.id, coupon.id);
    console.log('Claim Result:', result);

  } catch (error) {
    console.error('ERROR claiming coupon:', error);
  } finally {
    await sequelize.close();
  }
}

debug();
