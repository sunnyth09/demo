import * as Category from "../models/category.model.js";


// lấy danh sách
export const listCategories = async (req, res) => {
  const data = await Category.getAllCategories();
  res.json(data);
};

// lấy chi tiết
export const getCategory = async (req, res) => {
  const data = await Category.getCategoryById(req.params.id);
  if (!data)
    return res.status(404).json({ msg: "Không tìm thấy danh mục" });
  res.json(data);
};

// tạo
export const create = async (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ msg: "Vui lòng nhập tên" });
  }

  const id = await Category.createCategory({
    name: req.body.name
  });

  res.json({ msg: "Thêm thành công", id });
};


// cập nhật 1 item
export const update = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  if (!data.name) {
    return res.status(400).json({ msg: "Vui lòng nhập tên" });
  }

  await Category.bulkUpdate([id], data);

  res.json({
    msg: "Cập nhật thành công"
  });
};

// cập nhật nhiều
export const bulkUpdate = async (req, res) => {
  const { id, data } = req.body;

  if (!id || !id.length) {
    return res.status(400).json({ msg: "vui lòng nhập id" });
  }
  
  if (!data || !data.name) {
      return res.status(400).json({ msg: "Vui lòng nhập tên cần sửa" });
  }

  await Category.bulkUpdate(id, data);

  res.json({
    msg: "Cập nhật thành công",
    updatedIds: id
  });
};



// xóa 1 item
export const remove = async (req, res) => {
  const { id } = req.params;
  
  await Category.bulkDelete([id]);

  res.json({
    msg: "Xóa thành công"
  });
};

// xóa tất cả
export const removeAll = async (req, res) => {
  await Category.deleteAllCategories();
  res.json({ msg: "Đã xóa toàn bộ danh mục" });
};

// xóa nhiều
export const bulkRemove = async (req, res) => {
  const { id } = req.body;

  if (!id || !id.length) {
    return res.status(400).json({ msg: "vui lòng nhập id" });
  }

  await Category.bulkDelete(id);

  res.json({
    msg: "Xóa thành công",
    deletedIds: id
  });
};

