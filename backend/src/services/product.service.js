import { getAllProducts } from "../models/product.model.js";

export const getProducts = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  return await getAllProducts(limit, offset);
};
