import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import upload from "../middlewares/upload.middleware.js";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public: Ai cũng xem được
router.get("/", ArticleController.getAll);
router.get("/:id", ArticleController.getDetail);

// Admin: Chỉ admin mới được thêm/sửa/xóa
router.post("/", checkToken, checkAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), ArticleController.create);
router.put("/:id", checkToken, checkAdmin, upload.fields([{ name: 'thumbnail', maxCount: 1 }]), ArticleController.update);
router.delete("/:id", checkToken, checkAdmin, ArticleController.remove);

export default router;
