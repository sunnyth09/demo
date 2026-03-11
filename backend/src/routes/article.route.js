import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { checkToken, checkAdmin, handleValidate } from "../middlewares/auth.middleware.js";
import { validateArticle } from "../middlewares/article.validate.js";

const router = express.Router();

// Public: Ai cũng xem được
router.get("/", ArticleController.getAll);

// Soft Delete routes (Admin) - phải đặt TRƯỚC /:id
router.get("/trash", checkToken, checkAdmin, ArticleController.getTrashed);

router.get("/:id", ArticleController.getDetail);

// Admin: Chỉ admin mới được thêm/sửa/xóa
router.post("/", checkToken, checkAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), validateArticle, handleValidate, ArticleController.create);
router.put("/:id", checkToken, checkAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), validateArticle, handleValidate, ArticleController.update);
router.patch("/:id/restore", checkToken, checkAdmin, ArticleController.restoreArticle);
router.delete("/:id/force", checkToken, checkAdmin, ArticleController.forceRemove);
router.delete("/:id", checkToken, checkAdmin, ArticleController.remove);

export default router;
