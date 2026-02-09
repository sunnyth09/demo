import express from "express";
import { body } from "express-validator";
import * as contactController from "../controllers/contact.controller.js";
import { checkToken, checkAdmin, handleValidate } from "../middlewares/auth.middleware.js";

const router = express.Router();

const contactValidate = [
  body("name").notEmpty().withMessage("Vui lòng nhập họ tên"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("subject").notEmpty().withMessage("Vui lòng nhập tiêu đề"),
  body("message").notEmpty().withMessage("Vui lòng nhập nội dung")
];

// Public: Gửi liên hệ
router.post(
  "/",
  contactValidate,
  handleValidate,
  contactController.createContact
);

// Admin: Xem danh sách
router.get(
  "/",
  checkToken,
  checkAdmin,
  contactController.getAllContacts
);

// Admin: Xóa liên hệ
router.delete(
  "/:id",
  checkToken,
  checkAdmin,
  contactController.deleteContact
);

// Admin: Phản hồi liên hệ
router.post(
  "/:id/reply",
  checkToken,
  checkAdmin,
  contactController.replyContact
);

export default router;
