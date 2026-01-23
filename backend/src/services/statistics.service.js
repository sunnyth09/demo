import { Product, Category, User } from "../models/sequelize/index.js";

/**
 * Đếm tổng số sản phẩm
 */
export const countProducts = async () => {
  return await Product.count();
};

/**
 * Đếm tổng số danh mục
 */
export const countCategories = async () => {
  return await Category.count();
};

/**
 * Đếm tổng số người dùng
 */
export const countUsers = async () => {
  return await User.count();
};

/**
 * Lấy thống kê tổng hợp
 */
export const getStatistics = async () => {
  const [products, categories, users] = await Promise.all([
    countProducts(),
    countCategories(),
    countUsers()
  ]);

  return {
    products,
    categories,
    users
  };
};
