import express from "express";
import * as CouponController from "../controllers/coupon.controller.js";
import { checkAdmin, checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public route for checking coupon
router.post('/apply', CouponController.applyCoupon);
router.get('/', CouponController.getCoupons); // Allow public to list coupons (supports ?active=true)

// Admin routes
router.post('/', checkToken, checkAdmin, CouponController.createCoupon);
router.put('/:id', checkToken, checkAdmin, CouponController.updateCoupon);
router.delete('/:id', checkToken, checkAdmin, CouponController.deleteCoupon);

export default router;
