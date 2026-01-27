import express from "express";
import * as OrderController from "../controllers/order.controller.js";
import { checkToken, optionalCheckToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", optionalCheckToken, OrderController.createOrder);
router.get("/my-orders", checkToken, OrderController.getMyOrders);

export default router;
