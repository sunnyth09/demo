import bcrypt from "bcryptjs";
import { User } from "../models/sequelize/index.js";
import { Op } from "sequelize";

// ========== DỊCH VỤ PROFILE NGƯỜI DÙNG ==========

/**
 * Lấy thông tin profile người dùng
 */
export const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'role', 'phone', 'avatar', 'created_at']
  });
  
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  return user;
};

/**
 * Cập nhật thông tin profile
 */
export const updateProfile = async (userId, data) => {
  // Kiểm tra email đã tồn tại chưa (loại trừ user hiện tại)
  if (data.email) {
    const emailExists = await User.findOne({
      where: {
        email: data.email,
        id: { [Op.ne]: userId }
      }
    });
    
    if (emailExists) {
      throw new Error("Email đã được sử dụng");
    }
  }
  
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  await user.update({
    name: data.name || user.name,
    email: data.email || user.email,
    phone: data.phone !== undefined ? data.phone : user.phone,
    avatar: data.avatar || user.avatar
  });
  
  // Trả về user đã cập nhật (không có password)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    avatar: user.avatar,
    created_at: user.created_at
  };
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  // Xác thực mật khẩu cũ
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  
  if (!isMatch) {
    throw new Error("Mật khẩu cũ không đúng");
  }
  
  // Mã hóa mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);
  
  await user.update({ password: hashedPassword });
};

// ========== DỊCH VỤ QUẢN LÝ NGƯỜI DÙNG (ADMIN) ==========

/**
 * Lấy danh sách tất cả người dùng (có phân trang)
 */
export const getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  const { count, rows } = await User.findAndCountAll({
    attributes: ['id', 'name', 'email', 'role', 'phone', 'created_at'],
    order: [['id', 'DESC']],
    limit,
    offset
  });
  
  return {
    users: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/**
 * Lấy chi tiết 1 người dùng theo ID
 */
export const getUserById = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'name', 'email', 'role', 'phone', 'created_at']
  });
  
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  return user;
};

/**
 * Cập nhật thông tin người dùng (Admin)
 */
export const updateUser = async (userId, data) => {
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  // Kiểm tra email đã tồn tại chưa (loại trừ user hiện tại)
  if (data.email) {
    const emailExists = await User.findOne({
      where: {
        email: data.email,
        id: { [Op.ne]: userId }
      }
    });
    
    if (emailExists) {
      throw new Error("Email đã được sử dụng");
    }
  }
  
  await user.update({
    name: data.name || user.name,
    email: data.email || user.email,
    role: data.role || user.role,
    phone: data.phone !== undefined ? data.phone : user.phone
  });
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    created_at: user.created_at
  };
};

/**
 * Xóa người dùng
 */
export const deleteUser = async (userId, currentUserId) => {
  // Ngăn admin tự xoá chính mình
  if (parseInt(userId) === parseInt(currentUserId)) {
    throw new Error("Bạn không thể xoá chính mình");
  }
  
  const user = await User.findByPk(userId);
  
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  
  await user.destroy();
};

/**
 * Tạo người dùng mới (Admin)
 */
export const createUser = async (data) => {
  // Kiểm tra email đã tồn tại chưa
  const emailExists = await User.findOne({
    where: { email: data.email }
  });
  
  if (emailExists) {
    throw new Error("Email đã được sử dụng");
  }
  
  // Mã hóa mật khẩu
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);
  
  await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role || 'user',
    phone: data.phone || null
  });
};
