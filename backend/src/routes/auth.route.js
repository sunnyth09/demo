import express from "express";
import passport from "passport";
import { register, login, forgotPassword, resetPassword, socialCallback, refreshToken } from "../controllers/auth.controller.js";
import { registerValidate, loginValidate, handleValidate, checkToken } from "../middlewares/auth.middleware.js";
import { loginLimiter, registerLimiter, forgotPasswordLimiter } from "../middlewares/rateLimit.middleware.js";
import { verifyTurnstile } from "../middlewares/turnstile.middleware.js";

const router = express.Router();

router.post("/register", registerLimiter, verifyTurnstile, registerValidate, handleValidate, register);
router.post("/login", loginLimiter, verifyTurnstile, loginValidate, handleValidate, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);


// Google Auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), socialCallback);

// Facebook Auth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), socialCallback);

router.get("/verify", checkToken, (req,res)=>{
  res.json({
    status: true,
    message: "Token hợp lệ",
    user: req.user
  });
});

export default router;
