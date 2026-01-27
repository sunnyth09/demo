import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/sequelize/index.js";

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

    // Sử dụng Sequelize User model
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role', 'created_at']
    });

    if (!user) {
      return res.status(401).json({
        message: "Token không hợp lệ"
      });
    }

    req.user = user.toJSON();
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Token không hợp lệ"
    });
  }
};

export const optionalCheckToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(); // No token, proceed as guest
    }

    const token = authHeader.split(" ")[1];
    if (!token) return next();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (user) {
      req.user = user.toJSON();
    }
    next();
  } catch (err) {
    next(); // Invalid token, treat as guest
  }
};

export const checkAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      message: "Bạn không có quyền thực hiện hành động này"
    });
  }
};
