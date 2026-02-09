import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, htmlContent) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set. Email not sent.');
    console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${htmlContent}`);
    return;
  }
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent
    });
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendCouponEmail = async (to, coupon, title = "Bạn nhận được mã giảm giá mới!") => {
  const valueText = coupon.type === 'percentage' ? `${coupon.value}%` : 
                    coupon.type === 'free_shipping' ? 'Miễn phí vận chuyển' : 
                    `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.value)}`;
  
  const endDateText = coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('vi-VN') : 'Vĩnh viễn';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #f0f0f0; }
        .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 40px 20px; text-align: center; color: white; }
        .logo { font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -1px; }
        .content { padding: 40px 30px; text-align: center; color: #374151; }
        .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 15px; }
        .description { font-size: 16px; line-height: 1.6; color: #4B5563; margin-bottom: 30px; }
        .coupon-card { background-color: #F9FAFB; border: 2px dashed #E5E7EB; border-radius: 12px; padding: 25px; margin: 0 auto 30px; max-width: 400px; position: relative; }
        .coupon-label { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #6B7280; font-weight: 600; margin-bottom: 8px; }
        .coupon-code { font-size: 32px; font-weight: 800; color: #4F46E5; letter-spacing: 2px; margin: 0; font-family: monospace; background: #fff; padding: 10px 20px; border-radius: 8px; display: inline-block; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .coupon-value { margin-top: 15px; font-size: 18px; font-weight: 600; color: #059669; }
        .coupon-expiry { font-size: 13px; color: #9CA3AF; margin-top: 8px; }
        .cta-button { display: inline-block; background-color: #4F46E5; color: white !important; font-weight: 600; padding: 14px 32px; border-radius: 50px; text-decoration: none; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2); }
        .cta-button:hover { background-color: #4338CA; }
        .footer { background-color: #F9FAFB; padding: 20px; text-align: center; font-size: 12px; color: #9CA3AF; border-top: 1px solid #F3F4F6; }
      </style>
    </head>
    <body style="background-color: #f3f4f6; padding: 40px 0; margin: 0;">
      <div class="container">
        <div class="header">
          <h1 class="logo">Ocean Books</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Ưu đãi đặc biệt dành riêng cho bạn</p>
        </div>
        
        <div class="content">
          <h2 class="title">${title}</h2>
          <p class="description">
            Xin chào! Chúng tôi gửi tặng bạn một mã giảm giá đặc biệt.<br>
            Sử dụng ngay để mua sắm những cuốn sách yêu thích với giá tốt nhất nhé!
          </p>
          
          <div class="coupon-card">
            <div class="coupon-label">MÃ CỦA BẠN</div>
            <div class="coupon-code">${coupon.code}</div>
            <div class="coupon-value">Giảm: ${valueText}</div>
            <div class="coupon-expiry">HSD: ${endDateText}</div>
          </div>
          
          <p class="description" style="font-style: italic; font-size: 14px;">
            "${coupon.description || 'Áp dụng cho đơn hàng đủ điều kiện'}"
          </p>

          <a href="http://localhost:3001/vouchers" class="cta-button">Sử dụng ngay</a>
        </div>
        
        <div class="footer">
          <p>© 2026 Ocean Books. All rights reserved.</p>
          <p>Email này được gửi tự động. Vui lòng không trả lời.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, title, htmlContent);
};

export const sendOrderConfirmationEmail = async (to, order) => {
  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const orderIdDisplay = String(order.order_code || order.id).slice(0, 8).toUpperCase();
  
  const itemsHtml = order.items.map(item => `
    <tr style="border-bottom: 1px solid #efefef;">
      <td style="padding: 10px; text-align: left;">
        <div style="font-weight: 500;">${item.product_name || 'Sản phẩm'}</div>
        <div style="font-size: 12px; color: #888;">x${item.quantity}</div>
      </td>
      <td style="padding: 10px; text-align: right;">${formatCurrency(item.price)}</td>
    </tr>
  `).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        .container { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
        .header { background-color: #4F46E5; padding: 30px 20px; text-align: center; color: white; }
        .logo { font-size: 24px; font-weight: bold; margin: 0; }
        .content { padding: 30px 20px; color: #374151; }
        .h2 { font-size: 20px; font-weight: bold; color: #111827; margin-top: 0; }
        .info-box { background-color: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 20px; font-size: 14px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
        .total-row { font-weight: bold; font-size: 16px; border-top: 2px solid #e5e7eb; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; background-color: #4F46E5; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-weight: 500; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Ocean Books</div>
          <p style="margin: 5px 0 0; opacity: 0.9;">Xác nhận đơn hàng thành công</p>
        </div>
        
        <div class="content">
          <p>Xin chào <strong>${order.customer_name}</strong>,</p>
          <p>Cảm ơn bạn đã đặt hàng tại Ocean Books. Đơn hàng của bạn đã được tiếp nhận và đang trong quá trình xử lý.</p>
          
          <div class="info-box">
            <strong>Mã đơn hàng:</strong> #${orderIdDisplay}<br>
            <strong>Ngày đặt:</strong> ${new Date(order.createdAt || new Date()).toLocaleDateString('vi-VN')}<br>
            <strong>Phương thức thanh toán:</strong> ${order.payment_method === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : order.payment_method.toUpperCase()}<br>
            <strong>Địa chỉ giao hàng:</strong> ${order.shipping_address}
          </div>

          <h3 style="font-size: 16px; margin-bottom: 10px;">Chi tiết đơn hàng</h3>
          <table class="table">
            <thead>
              <tr style="background-color: #f3f4f6; text-align: left;">
                <th style="padding: 10px;">Sản phẩm</th>
                <th style="padding: 10px; text-align: right;">Giá</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td style="padding: 10px; text-align: right;">Tạm tính:</td>
                <td style="padding: 10px; text-align: right;">${formatCurrency(order.total_amount - (order.shipping_fee || 0) + (order.discount_amount || 0))}</td>
              </tr>
              <tr>
                <td style="padding: 10px; text-align: right;">Phí vận chuyển:</td>
                <td style="padding: 10px; text-align: right;">${formatCurrency(order.shipping_fee || 0)}</td>
              </tr>
               ${order.discount_amount > 0 ? `
              <tr>
                <td style="padding: 10px; text-align: right; color: #059669;">Giảm giá:</td>
                <td style="padding: 10px; text-align: right; color: #059669;">-${formatCurrency(order.discount_amount)}</td>
              </tr>
              ` : ''}
              <tr class="total-row">
                <td style="padding: 10px; text-align: right;">Tổng cộng:</td>
                <td style="padding: 10px; text-align: right; color: #4F46E5;">${formatCurrency(order.total_amount)}</td>
              </tr>
            </tbody>
          </table>

          <p style="text-align: center;">
            ${order.user_id ? 
              `<a href="http://localhost:3001/orders/${order.id}" class="btn">Xem chi tiết đơn hàng</a>` : 
              `<span style="color: #666; font-style: italic;">Vui lòng lưu lại email này để tra cứu khi cần thiết.</span>`
            }
          </p>
        </div>
        
        <div class="footer">
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng trả lời email này hoặc liên hệ hotline 1900 xxxx.</p>
          <p>© 2026 Ocean Books. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail(to, `Xác nhận đơn hàng #${orderIdDisplay} - Ocean Books`, htmlContent);
};
