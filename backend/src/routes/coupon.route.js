import express from "express";
import * as CouponController from "../controllers/coupon.controller.js";
import { checkAdmin, checkToken, optionalCheckToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========
// Mã công khai (Săn Voucher) - optionalCheckToken để biết user đã claim chưa
router.get('/public', optionalCheckToken, CouponController.getPublicCoupons);
router.post('/apply', optionalCheckToken, CouponController.applyCoupon);

// ========== USER ROUTES (cần đăng nhập) ==========
router.get('/my', checkToken, CouponController.getMyCoupons);
router.post('/claim/:id', checkToken, CouponController.claimCoupon);
router.get('/new-count', checkToken, CouponController.getNewCouponsCount);
router.post('/mark-seen', checkToken, CouponController.markCouponsSeen);

// ========== ADMIN ROUTES ==========
router.get('/', checkToken, checkAdmin, CouponController.getCoupons);
router.get('/stats', checkToken, checkAdmin, CouponController.getCouponStats);
router.post('/', checkToken, checkAdmin, CouponController.createCoupon);
router.put('/:id', checkToken, checkAdmin, CouponController.updateCoupon);
router.delete('/:id', checkToken, checkAdmin, CouponController.deleteCoupon);

export default router;
