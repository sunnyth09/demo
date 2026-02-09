import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/sequelize/index.js";
import { sendEmail } from "./email.service.js";
import { assignWelcomeCoupon } from "./coupon.service.js";

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
  const newUser = await User.create({
    name: data.name,
    email: data.email,
    password: hash,
    role: 'user',
    phone: data.phone || null
  });

  // Tặng mã welcome cho user mới
  try {
    await assignWelcomeCoupon(newUser.id);
  } catch (err) {
    console.log('Welcome coupon not assigned:', err.message);
  }
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

  // Determine expiration based on rememberMe
  const expiresIn = data.rememberMe ? "30d" : "1d";

  // Tạo access token
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // Tạo refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  // Trả về thông tin user (không bao gồm password)
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    created_at: user.created_at
  };

  return { status: true, accessToken, refreshToken, user: userData };
};

/**
 * Đăng nhập bằng Social (Google, Facebook)
 */
export const loginWithSocial = async (user) => {
  // Tạo access token
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "30d" } 
  );

  // Tạo refresh token
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  // Trả về thông tin user
  const userData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    created_at: user.created_at
  };

  return { status: true, accessToken, refreshToken, user: userData };
};

/**
 * Quên mật khẩu: Gửi OTP qua email
 */
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  // Tạo OTP 6 số
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Hết hạn sau 3 phút
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

  user.otp_code = otp;
  user.otp_expires_at = expiresAt;
  await user.save();

  await sendEmail(email, "Mã OTP đặt lại mật khẩu - Ocean Books", `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="background-color: #0F172A; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Ocean Books Password Reset</h1>
        </div>
        
        <div style="padding: 32px; background-color: #ffffff;">
            <p style="font-size: 16px; color: #334155; margin-bottom: 24px; text-align: center;">Bạn vừa yêu cầu đặt lại mật khẩu. Sử dụng mã OTP bên dưới để tiếp tục:</p>
            
            <div style="background-color: #F1F5F9; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #0F172A; letter-spacing: 4px;">${otp}</span>
            </div>
            
            <p style="font-size: 14px; color: #64748B; text-align: center; margin: 0;">Mã này sẽ hết hạn sau <strong>3 phút</strong>.</p>
            <p style="font-size: 14px; color: #64748B; text-align: center; margin-top: 8px;">Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        </div>
        
        <div style="background-color: #F8FAFC; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94A3B8; margin: 0;">&copy; ${new Date().getFullYear()}Ocean Books. All rights reserved.</p>
        </div>
    </div>
  `);
  
  return { message: "Đã gửi mã OTP qua email" };
};

/**
 * Đặt lại mật khẩu với OTP
 */
export const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("Email không tồn tại");
  }

  if (user.otp_code !== otp) {
    throw new Error("Mã OTP không đúng");
  }

  if (new Date() > user.otp_expires_at) {
    throw new Error("Mã OTP đã hết hạn");
  }

  // Hash password mới
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);
  
  // Xóa OTP
  user.otp_code = null;
  user.otp_expires_at = null;
  await user.save();

  return { message: "Đặt lại mật khẩu thành công" };
};
