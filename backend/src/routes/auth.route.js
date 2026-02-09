import express from "express";
import passport from "passport";
import { register, login, forgotPassword, resetPassword, socialCallback } from "../controllers/auth.controller.js";
import { registerValidate, loginValidate, handleValidate, checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidate, handleValidate, register);
router.post("/login", loginValidate, handleValidate, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);


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
