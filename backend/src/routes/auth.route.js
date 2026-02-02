import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";
import { registerValidate, loginValidate, handleValidate, checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidate, handleValidate, register);
router.post("/login", loginValidate, handleValidate, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/verify", checkToken, (req,res)=>{
  res.json({
    status: true,
    message: "Token hợp lệ",
    user: req.user
  });
});

export default router;
