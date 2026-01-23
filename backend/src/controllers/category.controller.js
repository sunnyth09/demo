import * as CategoryService from "../services/category.service.js";

// lấy danh sách
export const listCategories = async (req, res) => {
  try {
    const data = await CategoryService.getCategories();
    res.json({
      status: true,
      data: data
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// lấy chi tiết
export const getCategory = async (req, res) => {
  try {
    const data = await CategoryService.getCategoryDetail(req.params.id);
    res.json({
      status: true,
      data: data
    });
  } catch (err) {
    // Check if error is "Not found" to return 404?
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// tạo
export const create = async (req, res) => {
  try {
    const result = await CategoryService.create(req.body);
    res.json({ status: true, msg: "Thêm thành công", data: result });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// cập nhật 1 item
export const update = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.update(id, req.body);
    res.json({
      status: true,
      msg: "Cập nhật thành công"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// cập nhật nhiều
export const bulkUpdate = async (req, res) => {
  try {
    const { id, data } = req.body;
    await CategoryService.bulkUpdate(id, data);
    res.json({
      status: true,
      msg: "Cập nhật thành công",
      updatedIds: id
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// xóa 1 item
export const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.remove(id);
    res.json({
      status: true,
      msg: "Xóa thành công"
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// xóa tất cả
export const removeAll = async (req, res) => {
  try {
    await CategoryService.removeAll();
    res.json({ status: true, msg: "Đã xóa toàn bộ danh mục" });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

// xóa nhiều
export const bulkRemove = async (req, res) => {
  try {
    const { id } = req.body;
    await CategoryService.bulkRemove(id);
    res.json({
      status: true,
      msg: "Xóa thành công",
      deletedIds: id
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message
    });
  }
};

