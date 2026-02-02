import express from "express";
import { toggle, list } from "../controllers/favorite.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/toggle", checkToken, toggle);
router.get("/", checkToken, list);

export default router;
