import express from "express";
import * as ArticleController from "../controllers/article.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.get("/", ArticleController.getAll);
router.get("/:id", ArticleController.getDetail);
router.post("/", upload.fields([{ name: 'thumbnail', maxCount: 1 }]), ArticleController.create);
router.put("/:id", upload.fields([{ name: 'thumbnail', maxCount: 1 }]), ArticleController.update);
router.delete("/:id", ArticleController.remove);

export default router;
