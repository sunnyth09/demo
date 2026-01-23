import express from "express";

import {
  listCategories,
  getCategory,
  create,
  update,
  remove,
  bulkUpdate,
  bulkRemove,
  removeAll
} from "../controllers/category.controller.js";
import { checkToken, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", listCategories); // Ai cũng xem được
router.get("/:id", getCategory); // Ai cũng xem được

// Chỉ Admin mới được thêm/sửa/xóa
router.post("/", checkToken, checkAdmin, create);

router.put("/bulk", checkToken, checkAdmin, bulkUpdate);
router.put("/:id", checkToken, checkAdmin, update);

router.delete("/", checkToken, checkAdmin, removeAll);
router.delete("/bulk", checkToken, checkAdmin, bulkRemove);
router.delete("/:id", checkToken, checkAdmin, remove);

export default router;
