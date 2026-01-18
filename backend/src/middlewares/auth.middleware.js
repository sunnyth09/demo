import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { findById } from "../models/user.model.js";

export const registerValidate = [
  body("name").notEmpty().withMessage("Tên không được rỗng"),
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Mật khẩu ít nhất 6 ký tự"),
];

export const loginValidate = [
  body("email").isEmail().withMessage("Email không hợp lệ"),
  body("password").notEmpty().withMessage("Mật khẩu không được rỗng"),
];

export const handleValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
};

export const checkToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Không có token"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await findById(decoded.id);

    req.user = user[0]; 
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token không hợp lệ"
    });
  }
};
