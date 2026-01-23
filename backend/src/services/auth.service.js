import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/sequelize/index.js";

/**
 * Đăng ký người dùng mới
 */
export const registerService = async (data) => {
  // Kiểm tra email đã tồn tại chưa
  const existingUser = await User.findOne({
    where: { email: data.email }
  });
  
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salt);

  // Tạo user mới
  await User.create({
    name: data.name,
    email: data.email,
    password: hash,
    role: 'user'
  });
};

/**
 * Đăng nhập
 */
export const loginService = async (data) => {
  // Tìm user theo email
  const user = await User.findOne({
    where: { email: data.email }
  });
  
  if (!user) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  // Kiểm tra mật khẩu
  const isMatch = await bcrypt.compare(data.password, user.password);

  if (!isMatch) {
    throw new Error("Sai email hoặc mật khẩu");
  }

  // Tạo access token
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }  // Tăng lên 7 ngày để tiện development
  );

  // Tạo refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Trả về thông tin user (không bao gồm password)
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return { status: true, accessToken, refreshToken, user: userData };
};
