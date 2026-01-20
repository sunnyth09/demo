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

const router = express.Router();

router.get("/", listCategories);
router.get("/:id", getCategory);

router.post("/", create);

router.put("/bulk", bulkUpdate);


router.put("/:id", update);

router.delete("/", removeAll);
router.delete("/bulk", bulkRemove);

router.delete("/:id", remove);

export default router;
