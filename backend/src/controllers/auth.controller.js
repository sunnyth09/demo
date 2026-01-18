import { registerService, loginService } from "../services/auth.service.js";

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
