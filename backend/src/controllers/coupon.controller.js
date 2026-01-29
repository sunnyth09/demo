import * as CouponService from "../services/coupon.service.js";

export const getCoupons = async (req, res) => {
  try {
    const { active } = req.query;
    const coupons = await CouponService.getAllCoupons(active === 'true');
    res.json({ status: true, data: coupons });
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
    const { code, order_total, shipping_fee } = req.body;
    
    if (!code) throw new Error("Vui lòng nhập mã giảm giá");

    const result = await CouponService.validateCoupon(code, order_total);

    // Final adjustment based on shipping fee if it's free shipping type
    if (result.type === 'free_shipping') {
      result.discountAmount = shipping_fee || 0;
    }

    res.json({ status: true, data: result });
  } catch (error) {
    res.status(400).json({ status: false, message: error.message });
  }
};
