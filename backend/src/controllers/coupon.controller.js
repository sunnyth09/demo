import * as CouponService from "../services/coupon.service.js";

export const getCoupons = async (req, res) => {
  try {
    const { active } = req.query;
    const coupons = await CouponService.getAllCoupons(active === 'true');
    res.json({ status: true, data: coupons });
  } catch (error) {
    console.error('❌ Error getCoupons:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getPublicCoupons = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const coupons = await CouponService.getPublicCoupons(userId);
    res.json({ status: true, data: coupons });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getMyCoupons = async (req, res) => {
  try {
    const userId = req.user.id;
    const coupons = await CouponService.getMyCoupons(userId);
    res.json({ status: true, data: coupons });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const claimCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const couponId = req.params.id;
    const result = await CouponService.claimCoupon(userId, couponId);
    res.json({ status: true, ...result });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const getNewCouponsCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await CouponService.getNewCouponsCount(userId);
    res.json({ status: true, data: { count } });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const markCouponsSeen = async (req, res) => {
  try {
    const userId = req.user.id;
    await CouponService.markCouponsSeen(userId);
    res.json({ status: true, message: "Đã đánh dấu đã xem" });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const getCouponStats = async (req, res) => {
  try {
    const stats = await CouponService.getCouponStats();
    res.json({ status: true, data: stats });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.createCoupon(req.body);
    res.status(201).json({ status: true, data: coupon, message: "Tạo mã giảm giá thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await CouponService.updateCoupon(req.params.id, req.body);
    res.json({ status: true, data: coupon, message: "Cập nhật thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    await CouponService.deleteCoupon(req.params.id);
    res.json({ status: true, message: "Xóa thành công" });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code, order_total, shipping_fee, items } = req.body;
    const userId = req.user?.id || null;
    
    if (!code) throw new Error("Vui lòng nhập mã giảm giá");

    // Pass items to validateCoupon for category check logic
    const result = await CouponService.validateCoupon(code, order_total, userId, items || []);

    if (result.type === 'free_shipping') {
      result.discountAmount = shipping_fee || 0;
    }

    res.json({ status: true, data: result });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
