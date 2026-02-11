import { body } from "express-validator";

export const validateOrder = [
  body("customer_name")
    .trim()
    .notEmpty().withMessage("Tên khách hàng không được để trống")
    .isLength({ max: 100 }).withMessage("Tên khách hàng không được quá 100 ký tự"),

  body("customer_phone")
    .trim()
    .notEmpty().withMessage("Số điện thoại là bắt buộc")
    .matches(/^(0|\+84)[0-9]{9}$/).withMessage("Số điện thoại không hợp lệ"),

  body("customer_email")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail().withMessage("Email không hợp lệ"),

  body("shipping_address")
    .trim()
    .notEmpty().withMessage("Địa chỉ giao hàng là bắt buộc"),

  body("payment_method")
    .notEmpty().withMessage("Phương thức thanh toán là bắt buộc")
    .isIn(['cod', 'banking', 'momo', 'vnpay']).withMessage("Phương thức thanh toán không hợp lệ"),

  body("items")
    .isArray({ min: 1 }).withMessage("Đơn hàng phải có ít nhất 1 sản phẩm"),
  
  body("items.*.id")
    .notEmpty().withMessage("ID sản phẩm là bắt buộc")
    .isInt().withMessage("ID sản phẩm hư hỏng"),

  body("items.*.quantity")
    .isInt({ min: 1 }).withMessage("Số lượng sản phẩm phải lớn hơn 0"),
];
