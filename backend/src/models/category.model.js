import { db } from "../config/db.js";

// lấy tất cả
export const getAllCategories = async () => {
  const [rows] = await db.query("SELECT * FROM categories");
  return rows;
};

// lấy theo id
export const getCategoryById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE id = ?", [id]
  );
  return rows[0];
};

// tạo
export const createCategory = async (data) => {
  const { name } = data;
  const [result] = await db.query(
    "INSERT INTO categories(name) VALUES(?)",
    [name]
  );
  return result.insertId;
};

//  cập nhật
export const bulkUpdate = async (ids, data) => {
  const { name } = data;
  await db.query(
    `UPDATE categories SET name=? WHERE id IN (?)`,
    [name, ids]
  );
};


// Xóa tất cả
export const deleteAllCategories = async () => {
    await db.query("DELETE FROM categories");
};

// xóa
export const bulkDelete = async (ids) => {
  await db.query(
    "DELETE FROM categories WHERE id IN (?)", [ids]
  );
};
