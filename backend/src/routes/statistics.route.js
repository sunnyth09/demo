import express from "express";
import { getStatistics } from "../controllers/statistics.controller.js";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin: Chỉ admin mới xem được thống kê
router.get("/", checkToken, checkAdmin, getStatistics);

export default router;
