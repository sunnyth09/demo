import { registerService, loginService, forgotPasswordService, resetPasswordService, loginWithSocial } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    await registerService(req.body);

    res.status(201).json({
      status: true,
      message: "Đăng ký thành công"
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const tokens = await loginService(req.body);

    res.status(200).json(tokens);
  } catch (err) {
    res.status(401).json({
      status: false,
      message: err.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const result = await forgotPasswordService(req.body.email);
    res.status(200).json({
      status: true,
      message: result.message
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const result = await resetPasswordService(req.body);
    res.status(200).json({
      status: true,
      message: result.message
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const socialCallback = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
    const result = await loginWithSocial(user);
    
    const { accessToken, refreshToken, user: userData } = result;

    const params = new URLSearchParams({
        accessToken,
        refreshToken,
        user: JSON.stringify(userData)
    });

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?${params.toString()}`);

  } catch (err) {
    console.error("Social login error:", err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=server_error`);
  }
};
