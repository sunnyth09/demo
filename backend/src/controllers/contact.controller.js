import Contact from "../models/sequelize/Contact.js";
import { sendEmail } from "../services/email.service.js";

/**
 * Tạo liên hệ mới (Public)
 */
export const createContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    const newContact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    return res.status(201).json({
      status: "success",
      message: "Gửi liên hệ thành công. Chúng tôi sẽ phản hồi sớm nhất có thể.",
      data: newContact
    });
  } catch (error) {
    console.error("Create Contact Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Đã có lỗi xảy ra, vui lòng thử lại sau."
    });
  }
};

/**
 * Lấy danh sách liên hệ (Admin)
 */
export const getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) {
      where.status = status;
    }

    const { count, rows } = await Contact.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return res.status(200).json({
      status: "success",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error("Get All Contacts Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server"
    });
  }
};

/**
 * Xóa liên hệ (Admin)
 */
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Liên hệ không tồn tại"
      });
    }

    await contact.destroy();

    return res.status(200).json({
      status: "success",
      message: "Xóa liên hệ thành công"
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server"
    });
  }
};

/**
 * Phản hồi liên hệ (Admin)
 */
export const replyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng nhập nội dung phản hồi"
      });
    }

    const contact = await Contact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "Liên hệ không tồn tại"
      });
    }

    // Gửi email
    await sendEmail(
      contact.email,
      `Phản hồi từ cửa hàng: ${contact.subject}`,
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h3>Xin chào ${contact.name},</h3>
        <p>Cảm ơn bạn đã liên hệ với chúng tôi.</p>
        <p><strong>Nội dung phản hồi:</strong></p>
        <blockquote style="background: #f9f9f9; border-left: 5px solid #ccc; margin: 1.5em 10px; padding: 0.5em 10px;">
          ${message.replace(/\n/g, '<br>')}
        </blockquote>
        <hr>
        <p style="font-size: 0.9em; color: #666;">
          Trân trọng,<br>
          Ban quản trị
        </p>
      </div>
      `
    );

    // Cập nhật trạng thái
    contact.status = 'replied';
    contact.reply_message = message;
    contact.replied_at = new Date();
    await contact.save();

    return res.status(200).json({
      status: "success",
      message: "Đã gửi phản hồi thành công",
      data: contact
    });

  } catch (error) {
    console.error("Reply Contact Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Lỗi server khi gửi phản hồi"
    });
  }
};
