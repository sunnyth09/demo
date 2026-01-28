import express from "express";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";
import * as RevenueController from "../controllers/admin/revenue.controller.js";

const router = express.Router();

// Route: /api/revenue
router.get("/analytics", checkToken, checkAdmin, RevenueController.getAnalytics);

export default router;
