
import express from "express";
import { createPaymentUrl, vnpayReturn, vnpayIpn } from "../controllers/payment.controller.js";
import { optionalCheckToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create_payment_url", optionalCheckToken, createPaymentUrl);
router.get("/vnpay_return", vnpayReturn);   // Callback từ VNPay - không cần auth
router.get("/vnpay_ipn", vnpayIpn);         // IPN từ VNPay - không cần auth

export default router;
