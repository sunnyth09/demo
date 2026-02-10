import express from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller.js";
import { checkToken, checkAdmin, handleValidate } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// ========== QUY TẮC VALIDATION ==========

const profileValidate = [
  body("name").optional().notEmpty().withMessage("Tên không được rỗng"),
  body("email").optional().isEmail().withMessage("Email không hợp lệ")
];

const passwordValidate = [
  body("oldPassword").notEmpty().withMessage("Mật khẩu cũ không được rỗng"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu mới ít nhất 6 ký tự")
];

const adminUserValidate = [
  body("name").notEmpty().withMessage("Tên không được rỗng"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role phải là 'user' hoặc 'admin'")
];

const createUserValidate = [
  body("name").notEmpty().withMessage("Tên không được rỗng"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu ít nhất 6 ký tự"),
  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role phải là 'user' hoặc 'admin'")
];

// ========== ROUTES PROFILE NGƯỜI DÙNG ==========
// Tất cả routes yêu cầu xác thực

router.get(
  "/profile",
  checkToken,
  userController.getProfile
);

router.put(
  "/profile",
  checkToken,
  upload.single("avatar"),
  profileValidate,
  handleValidate,
  userController.updateProfile
);

router.put(
  "/password",
  checkToken,
  passwordValidate,
  handleValidate,
  userController.changePassword
);

// ========== ROUTES QUẢN LÝ NGƯỜI DÙNG (ADMIN) ==========
// Tất cả routes yêu cầu xác thực + quyền admin

router.get(
  "/admin/users",
  checkToken,
  checkAdmin,
  userController.getAllUsers
);

router.get(
  "/admin/users/:id",
  checkToken,
  checkAdmin,
  userController.getUserById
);

router.post(
  "/admin/users",
  checkToken,
  checkAdmin,
  createUserValidate,
  handleValidate,
  userController.createUser
);

router.put(
  "/admin/users/:id",
  checkToken,
  checkAdmin,
  adminUserValidate,
  handleValidate,
  userController.updateUser
);

router.delete(
  "/admin/users/:id",
  checkToken,
  checkAdmin,
  userController.deleteUser
);

export default router;
