import express from "express";
import * as OrderController from "../controllers/order.controller.js";
import { checkToken, optionalCheckToken, checkAdmin, handleValidate } from "../middlewares/auth.middleware.js";
import { validateOrder } from "../middlewares/order.validate.js";

const router = express.Router();


// Routes cho user
router.post("/", optionalCheckToken, validateOrder, handleValidate, OrderController.createOrder);
router.get("/my-orders", checkToken, OrderController.getMyOrders);
router.get("/my-orders/:id", checkToken, OrderController.getMyOrderById);
router.put("/my-orders/:id/cancel", checkToken, OrderController.cancelMyOrder);

// Routes cho admin
router.get("/admin", checkToken, checkAdmin, OrderController.getAllOrders);
router.get("/admin/stats", checkToken, checkAdmin, OrderController.getOrderStats);
router.get("/admin/:id", checkToken, checkAdmin, OrderController.getOrderById);
router.put("/admin/:id/status", checkToken, checkAdmin, OrderController.updateStatus);

export default router;
