import { body } from "express-validator";

export const validateArticle = [
  body("title")
    .trim()
    .notEmpty().withMessage("Tiêu đề bài viết không được để trống")
    .isLength({ max: 255 }).withMessage("Tiêu đề bài viết không được quá 255 ký tự"),
  
  body("content")
    .trim()
    .notEmpty().withMessage("Nội dung bài viết không được để trống"),

  body("status")
    .optional()
    .isIn(['draft', 'published']).withMessage("Trạng thái phải là 'draft' hoặc 'published'"),
  
  body("excerpt")
    .optional({ nullable: true })
    .isLength({ max: 500 }).withMessage("Tóm tắt không được quá 500 ký tự"),
];
