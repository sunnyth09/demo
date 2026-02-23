
import express from "express";
import { 
  createReview, 
  getProductReviews, 
  updateReview, 
  deleteReview, 
  reportReview,
  getAllReviewsAdmin,
  getReportedReviews,
  toggleReviewVisibility
} from "../controllers/review.controller.js";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public
router.get("/product/:productId", getProductReviews);

// Protected
router.post("/", checkToken, createReview);
router.put("/:id", checkToken, updateReview);
router.delete("/:id", checkToken, deleteReview);
router.post("/:id/report", checkToken, reportReview);

// Admin
router.get("/admin/all", checkToken, checkAdmin, getAllReviewsAdmin);
router.get("/admin/reported", checkToken, checkAdmin, getReportedReviews);
router.put("/:id/visibility", checkToken, checkAdmin, toggleReviewVisibility);

export default router;
