/**
 * Cloudflare Turnstile Verification Middleware
 * 
 * Xác minh Turnstile token từ client bằng cách gọi Cloudflare siteverify API.
 * Nếu TURNSTILE_SECRET_KEY không được cấu hình, middleware sẽ skip (cho môi trường dev).
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const verifyTurnstile = async (req, res, next) => {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // Skip nếu chưa cấu hình secret key (dev mode)
  if (!secretKey) {
    console.warn('[Turnstile] TURNSTILE_SECRET_KEY chưa được cấu hình — bỏ qua xác minh.');
    return next();
  }

  const { turnstileToken } = req.body;

  if (!turnstileToken) {
    return res.status(400).json({
      status: false,
      message: 'Vui lòng xác minh bạn không phải robot.'
    });
  }

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: secretKey,
        response: turnstileToken,
        remoteip: req.ip
      })
    });

    const data = await response.json();

    if (!data.success) {
      console.warn('[Turnstile] Xác minh thất bại:', data['error-codes']);
      return res.status(400).json({
        status: false,
        message: 'Xác minh CAPTCHA thất bại. Vui lòng thử lại.'
      });
    }

    // Xóa turnstileToken khỏi body để không truyền xuống controller
    delete req.body.turnstileToken;

    next();
  } catch (err) {
    console.error('[Turnstile] Lỗi khi gọi API Cloudflare:', err.message);
    return res.status(500).json({
      status: false,
      message: 'Lỗi hệ thống khi xác minh CAPTCHA.'
    });
  }
};
