import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";
import { uploadFile, getFullUrl } from "../services/minio.service.js";

const router = express.Router();

// POST /api/upload/editor-image — Upload ảnh cho Quill editor (chỉ admin)
router.post(
  "/editor-image",
  checkToken,
  checkAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Không có file ảnh" });
      }

      const filename = await uploadFile(req.file);
      const url = getFullUrl(filename);

      return res.json({ status: true, url });
    } catch (error) {
      console.error("Editor image upload error:", error);
      return res.status(500).json({ message: "Lỗi khi upload ảnh" });
    }
  }
);

export default router;
