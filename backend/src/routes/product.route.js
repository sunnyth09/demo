import express from "express";
import { getAll, getDetail, create, update, remove } from "../controllers/product.controller.js";
import { checkToken, checkAdmin, handleValidate } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { validateProduct } from "../middlewares/product.validate.js";

const router = express.Router();

// Public routes
router.get("/", getAll);
router.get("/:id", getDetail);

router.post("/", checkToken, checkAdmin, upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), validateProduct, handleValidate, create);

router.put("/:id", checkToken, checkAdmin, upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 }
]), validateProduct, handleValidate, update);

router.delete("/:id", checkToken, checkAdmin, remove);

export default router;
