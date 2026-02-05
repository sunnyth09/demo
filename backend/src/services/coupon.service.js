import { Coupon, UserCoupon, CouponUsage, User, Category, Order, sequelize } from "../models/sequelize/index.js";
import { Op, fn, col } from "sequelize";
import { sendCouponEmail } from "./email.service.js";

/**
 * Create a new coupon
 */
export const createCoupon = async (data) => {
  // Check if code exists
  const existing = await Coupon.findOne({ where: { code: data.code } });
  if (existing) {
    throw new Error(`Mã giảm giá "${data.code}" đã tồn tại`);
  }
  const coupon = await Coupon.create(data);

  // Gửi email thông báo cho tất cả user nếu được yêu cầu
  if (data.notifyUsers && coupon.is_public && coupon.is_active) {
    // Chạy background job gửi email
    getAllUsersForNotification().then(users => {
      console.log(`Sending coupon email to ${users.length} users...`);
      users.forEach(user => {
        if (user.email) {
          sendCouponEmail(user.email, coupon, `🔥 Săn ngay mã giảm giá mới: ${coupon.code}`).catch(err => 
            console.error(`Failed to send email to ${user.email}:`, err.message)
          );
        }
      });
    }).catch(err => console.error('Failed to fetch users for notification:', err));
  }

  return coupon;
};

/**
 * Get all coupons (Admin)
 */
export const getAllCoupons = async (isActiveOnly = false) => {
  const where = {};
  if (isActiveOnly) {
    where.is_active = true;
    where.start_date = { [Op.lte]: new Date() };
    where.end_date = { [Op.gte]: new Date() };
    where.quantity = { [Op.gt]: 0 };
  }
  
  return await Coupon.findAll({
    where,
    attributes: {
      include: [
        [
          sequelize.literal(`(
            SELECT COUNT(*)
            FROM user_coupons AS uc
            WHERE uc.coupon_id = Coupon.id
          )`),
          'claimedCount'
        ]
      ]
    },
    order: [['createdAt', 'DESC']]
  });
};

/**
 * Get public coupons for Săn Voucher page
 */
export const getPublicCoupons = async (userId = null) => {
  const where = {
    is_active: true,
    is_public: true,
    // start_date: { [Op.lte]: new Date() }, // Allow upcoming coupons
    end_date: { [Op.gte]: new Date() },
    quantity: { [Op.gt]: 0 }
  };

  const coupons = await Coupon.findAll({
    where,
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'], required: false }],
    order: [['end_date', 'ASC']] // Sắp xếp theo ngày hết hạn gần nhất
  });

  // Nếu có userId, check xem user đã claim chưa
  if (userId) {
    const claimedCoupons = await UserCoupon.findAll({
      where: { user_id: userId },
      attributes: ['coupon_id', 'is_used']
    });

    const claimedMap = {};
    claimedCoupons.forEach(c => {
      claimedMap[c.coupon_id] = { claimed: true, is_used: c.is_used };
    });

    return coupons.map(coupon => ({
      ...coupon.toJSON(),
      isClaimed: !!claimedMap[coupon.id],
      isUsed: claimedMap[coupon.id]?.is_used || false
    }));
  }

  return coupons;
};

/**
 * Claim coupon (lưu mã từ Săn Voucher)
 */
export const claimCoupon = async (userId, couponId) => {
  // ... existing code ...
  // Check coupon exists and is public
  const coupon = await Coupon.findByPk(couponId);
  if (!coupon) {
    throw new Error("Mã giảm giá không tồn tại");
  }
  // ... rest of validation ...
  
  // Check existing claim
  const existing = await UserCoupon.findOne({
    where: { user_id: userId, coupon_id: couponId }
  });

  if (existing) {
    throw new Error("Bạn đã lưu mã này rồi");
  }

  // Transaction to ensure atomicity
  await sequelize.transaction(async (t) => {
    // Re-fetch with lock
    const couponToUpdate = await Coupon.findByPk(couponId, { transaction: t, lock: t.LOCK.UPDATE });
    
    if (couponToUpdate.quantity <= 0) {
      throw new Error("Mã giảm giá đã hết lượt sử dụng");
    }

    await UserCoupon.create({
      user_id: userId,
      coupon_id: couponId,
      source: 'claim',
      claimed_at: new Date()
    }, { transaction: t });

    await couponToUpdate.decrement('quantity', { transaction: t });
  });

  return { message: "Lưu mã giảm giá thành công" };
};

// ... existing implementations ...

/**
 * Assign welcome coupon to new user
 */
export const assignWelcomeCoupon = async (userId) => {
  const welcomeCoupon = await Coupon.findOne({
    where: {
      code: { [Op.like]: '%WELCOME%' },
      is_active: true
    }
  });

  if (welcomeCoupon) {
    await UserCoupon.create({
      user_id: userId,
      coupon_id: welcomeCoupon.id,
      source: 'welcome',
      claimed_at: new Date()
    });

    // Gửi email thông báo
    const user = await User.findByPk(userId);
    if (user && user.email) {
      // Chạy async không cần await để không block response
      sendCouponEmail(user.email, welcomeCoupon, "🎁 Quà tặng thành viên mới từ Ocean Books").catch(err => 
        console.error('Failed to send welcome coupon email:', err)
      );
    }

    return welcomeCoupon;
  }
  return null;
};

/**
 * Assign first order coupon after first order
 */
export const assignFirstOrderCoupon = async (userId) => {
  // Check if this is really first order
  const orderCount = await Order.count({ where: { user_id: userId } });
  if (orderCount > 1) return null;

  const firstOrderCoupon = await Coupon.findOne({
    where: {
      code: { [Op.like]: '%FIRSTORDER%' },
      is_active: true
    }
  });

  if (firstOrderCoupon) {
    // Check if already assigned
    const existing = await UserCoupon.findOne({
      where: { user_id: userId, coupon_id: firstOrderCoupon.id }
    });
    if (!existing) {
      await UserCoupon.create({
        user_id: userId,
        coupon_id: firstOrderCoupon.id,
        source: 'first_order',
        claimed_at: new Date()
      });

      // Gửi email thông báo
      const user = await User.findByPk(userId);
      if (user && user.email) {
        sendCouponEmail(user.email, firstOrderCoupon, "🎉 Cảm ơn bạn đã mua hàng lần đầu!").catch(err => 
          console.error('Failed to send first order coupon email:', err)
        );
      }

      return firstOrderCoupon;
    }
  }
  return null;
};



/**
 * Get user's coupons (Mã của tôi)
 */
export const getMyCoupons = async (userId) => {
  const userCoupons = await UserCoupon.findAll({
    where: { user_id: userId },
    include: [{
      model: Coupon,
      as: 'coupon',
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
    }],
    order: [['claimed_at', 'DESC']]
  });

  return userCoupons.map(uc => ({
    ...uc.coupon.toJSON(),
    source: uc.source,
    claimed_at: uc.claimed_at,
    is_used: uc.is_used,
    used_at: uc.used_at,
    seen_at: uc.seen_at
  }));
};

/**
 * Count new (unseen) coupons for badge
 */
export const getNewCouponsCount = async (userId) => {
  const count = await UserCoupon.count({
    where: {
      user_id: userId,
      seen_at: null,
      is_used: false
    }
  });
  return count;
};

/**
 * Mark coupons as seen
 */
export const markCouponsSeen = async (userId) => {
  await UserCoupon.update(
    { seen_at: new Date() },
    { where: { user_id: userId, seen_at: null } }
  );
  return { success: true };
};



/**
 * Validate and apply coupon (updated with user check)
 */
export const validateCoupon = async (code, orderAmount, userId = null, itemsOrCategories = []) => {
  const coupon = await Coupon.findOne({ 
    where: { code },
    include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }]
  });
  
  if (!coupon) {
    throw new Error("Mã giảm giá không tồn tại");
  }

  if (!coupon.is_active) {
    throw new Error("Mã giảm giá đang bị khóa");
  }

  const now = new Date();
  if (coupon.start_date && new Date(coupon.start_date) > now) {
    throw new Error("Mã giảm giá chưa đến thời gian hiệu lực");
  }

  if (coupon.end_date && new Date(coupon.end_date) < now) {
    throw new Error("Mã giảm giá đã hết hạn");
  }

  if (coupon.quantity <= 0) {
    throw new Error("Mã giảm giá đã hết lượt sử dụng");
  }

  // Determine Eligible Amount
  let eligibleAmount = parseFloat(orderAmount);
  
  // Check category restriction
  if (coupon.category_id) {
    // Check if input is Items Array (Object with category_id) or just IDs
    const isItemsArray = Array.isArray(itemsOrCategories) && itemsOrCategories.length > 0 && typeof itemsOrCategories[0] === 'object';
    
    if (isItemsArray) {
       // Filter eligible items
       const eligibleItems = itemsOrCategories.filter(item => {
          // Handle both direct category_id or product.category_id structure
          const catId = item.category_id || item.product?.category_id;
          return parseInt(catId) === coupon.category_id;
       });

       if (eligibleItems.length === 0) {
          throw new Error(`Mã này chỉ áp dụng cho danh mục "${coupon.category?.name || 'cụ thể'}"`);
       }

       // Recalculate eligible amount
       eligibleAmount = eligibleItems.reduce((sum, item) => sum + (parseFloat(item.price) * parseInt(item.quantity)), 0);

    } else {
       // Legacy Fallback (Array of IDs) - Cannot calculate precise amount, just validate existence
       const hasCategory = itemsOrCategories.some(id => parseInt(id) === coupon.category_id);
       if (!hasCategory && itemsOrCategories.length > 0) {
          throw new Error(`Mã này chỉ áp dụng cho danh mục "${coupon.category?.name || 'cụ thể'}"`);
       }
       // If legacy, we assume orderAmount is eligible (Risk, but backward compatible)
    }
  }

  // Check Min Order on Eligible Amount (Stricter and safer)
  if (coupon.min_order_amount > eligibleAmount) {
     const currency = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
     throw new Error(`Đơn hàng (sản phẩm hợp lệ) phải từ ${currency.format(coupon.min_order_amount)} mới được áp dụng`);
  }

  // Check user usage limit ... (Keep existing logic)
  if (userId) {
    const usageCount = await CouponUsage.count({
      where: { user_id: userId, coupon_id: coupon.id }
    });
    if (usageCount >= coupon.max_uses_per_user) {
      throw new Error("Bạn đã sử dụng hết lượt cho mã này");
    }

    if (coupon.for_first_order_only) {
      const orderCount = await Order.count({ where: { user_id: userId } });
      if (orderCount > 0) {
        throw new Error("Mã này chỉ dành cho đơn hàng đầu tiên");
      }
    }
  }

  let discountAmount = 0;

  // Calculate discount based on Eligible Amount
  if (coupon.type === 'fixed') {
    discountAmount = parseFloat(coupon.value);
    // Optional: cap fixed amount at eligibleAmount?
    if (discountAmount > eligibleAmount) discountAmount = eligibleAmount;
  } else if (coupon.type === 'percentage') {
    discountAmount = (eligibleAmount * parseFloat(coupon.value)) / 100;
    
    if (coupon.max_discount_amount && parseFloat(coupon.max_discount_amount) > 0) {
       discountAmount = Math.min(discountAmount, parseFloat(coupon.max_discount_amount));
    }
  } else if (coupon.type === 'free_shipping') {
    return {
      isValid: true,
      coupon,
      type: 'free_shipping',
      discountAmount: 0
    };
  }

  discountAmount = Math.min(discountAmount, parseFloat(orderAmount));

  return {
    isValid: true,
    coupon,
    type: coupon.type,
    discountAmount
  };
};

/**
 * Record coupon usage
 */
export const recordCouponUsage = async (userId, couponId, orderId, discountAmount) => {
  // Create usage record
  await CouponUsage.create({
    user_id: userId,
    coupon_id: couponId,
    order_id: orderId,
    discount_amount: discountAmount,
    used_at: new Date()
  });

  // Update UserCoupon if exists
  await UserCoupon.update(
    { is_used: true, used_at: new Date() },
    { where: { user_id: userId, coupon_id: couponId } }
  );

  // Decrease coupon quantity and increase used_count
  await Coupon.increment('used_count', { where: { id: couponId } });
  await Coupon.decrement('quantity', { where: { id: couponId } });
};

/**
 * Get coupon statistics (Admin)
 */
export const getCouponStats = async () => {
  const stats = await CouponUsage.findAll({
    attributes: [
      'coupon_id',
      [fn('COUNT', col('id')), 'usage_count'],
      [fn('SUM', col('discount_amount')), 'total_discount']
    ],
    group: ['coupon_id'],
    include: [{
      model: Coupon,
      as: 'coupon',
      attributes: ['id', 'code', 'description', 'type', 'value', 'quantity', 'used_count']
    }],
    order: [[fn('COUNT', col('id')), 'DESC']]
  });

  return stats;
};

/**
 * Delete coupon
 */
export const deleteCoupon = async (id) => {
  return await Coupon.destroy({ where: { id } });
};

/**
 * Update coupon
 */
export const updateCoupon = async (id, data) => {
  const coupon = await Coupon.findByPk(id);
  if (!coupon) {
    throw new Error("Mã giảm giá không tồn tại");
  }
  await coupon.update(data);

  // Gửi email thông báo cho tất cả user nếu được yêu cầu (ngay cả khi update)
  console.log('Update Coupon Data:', { 
    notifyUsers: data.notifyUsers, 
    is_public: coupon.is_public, 
    is_active: coupon.is_active 
  });
  
  if (data.notifyUsers && coupon.is_public && coupon.is_active) {
    console.log('Condition met! Preparing to send emails...');
    getAllUsersForNotification().then(users => {
      console.log(`Sending coupon email (update) to ${users.length} users...`);
      users.forEach(user => {
        if (user.email) {
          sendCouponEmail(user.email, coupon, `🔥 Cập nhật: Ưu đãi ${coupon.code} đã quay trở lại!`).catch(err => 
            console.error(`Failed to send email to ${user.email}:`, err.message)
          );
        }
      });
    }).catch(err => console.error('Failed to fetch users for notification:', err));
  } else {
    console.log('Email condition NOT met.');
  }

  return coupon;
};


/**
 * Get all users for email notification
 */
export const getAllUsersForNotification = async () => {
  return await User.findAll({
    attributes: ['id', 'name', 'email'],
    where: { role: 'user' }
  });
};
