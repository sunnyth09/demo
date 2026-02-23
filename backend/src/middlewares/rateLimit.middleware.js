import rateLimit from 'express-rate-limit';

/**
 * Rate Limiter cho Login - Chống brute-force attack
 * 5 lần thử đăng nhập / 1 phút / IP
 */
export const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 1 phút.'
  }
});

/**
 * Rate Limiter cho Register - Chống spam tạo tài khoản
 * 3 lần / 15 phút / IP
 */
export const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Quá nhiều yêu cầu đăng ký. Vui lòng thử lại sau 15 phút.'
  }
});

/**
 * Rate Limiter cho Forgot Password - Chống spam reset password
 * 3 lần / 15 phút / IP
 */
export const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Quá nhiều yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau 15 phút.'
  }
});

/**
 * Rate Limiter chung cho toàn bộ API
 * 100 requests / 1 phút / IP
 */
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: false,
    message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau.'
  }
});
