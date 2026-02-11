import { body } from "express-validator";

export const validateProduct = [
  body("name")
    .trim()
    .notEmpty().withMessage("Tên sản phẩm không được để trống")
    .isLength({ max: 255 }).withMessage("Tên sản phẩm không được quá 255 ký tự"),
  
  body("price")
    .notEmpty().withMessage("Giá sản phẩm là bắt buộc")
    .isNumeric().withMessage("Giá sản phẩm phải là số")
    .custom((value) => value >= 0).withMessage("Giá sản phẩm không được âm"),
  
  body("original_price")
    .optional({ nullable: true })
    .isNumeric().withMessage("Giá gốc phải là số")
    .custom((value) => value >= 0).withMessage("Giá gốc không được âm"),

  body("quantity")
    .optional()
    .isInt({ min: 0 }).withMessage("Số lượng tồn kho phải là số nguyên không âm"),
    
  body("sku")
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 50 }).withMessage("SKU không được quá 50 ký tự"),

  body("discount_start")
    .optional({ nullable: true })
    .isISO8601().withMessage("Ngày bắt đầu giảm giá không hợp lệ"),

  body("discount_end")
    .optional({ nullable: true })
    .isISO8601().withMessage("Ngày kết thúc giảm giá không hợp lệ")
    .custom((value, { req }) => {
      if (req.body.discount_start && value < req.body.discount_start) {
        throw new Error("Ngày kết thúc giảm giá phải sau ngày bắt đầu");
      }
      return true;
    }),
];
