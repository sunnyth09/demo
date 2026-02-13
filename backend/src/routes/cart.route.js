import express from "express";
import * as CartController from "../controllers/cart.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(checkToken); // All cart routes require login

router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/update", CartController.updateItem);
router.delete("/remove", CartController.removeItem); // Using body for productId
router.delete("/clear", CartController.clearCart);
router.post("/sync", CartController.syncCart);

export default router;
