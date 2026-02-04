import * as userService from "../services/user.service.js";

// ========== CONTROLLER PROFILE NGƯỜI DÙNG ==========

export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.id);
    
    res.status(200).json({
      status: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const data = req.body;
    
    // Nếu có file ảnh được upload
    if (req.file) {
      const { uploadFile } = await import("../services/minio.service.js");
      const avatarUrl = await uploadFile(req.file);
      data.avatar = avatarUrl;
    }

    const user = await userService.updateProfile(req.user.id, data);
    
    res.status(200).json({
      status: true,
      message: "Cập nhật thông tin thành công",
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    await userService.changePassword(req.user.id, oldPassword, newPassword);
    
    res.status(200).json({
      status: true,
      message: "Đổi mật khẩu thành công"
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

// ========== CONTROLLER QUẢN LÝ NGƯỜI DÙNG (ADMIN) ==========

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await userService.getAllUsers(page, limit);
    
    res.status(200).json({
      status: true,
      data: result.users,
      pagination: result.pagination
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    res.status(200).json({
      status: true,
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    
    res.status(200).json({
      status: true,
      message: "Cập nhật người dùng thành công",
      data: user
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id, req.user.id);
    
    res.status(200).json({
      status: true,
      message: "Xoá người dùng thành công"
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};

export const createUser = async (req, res) => {
  try {
    await userService.createUser(req.body);
    
    res.status(201).json({
      status: true,
      message: "Tạo người dùng thành công"
    });
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message
    });
  }
};
