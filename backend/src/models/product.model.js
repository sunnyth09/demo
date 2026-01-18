import { db } from "../config/db.js";

export const getAllProducts = async (limit, offset) => {
  const [rows] = await db.query("SELECT * FROM products LIMIT ? OFFSET ?", [
    limit,
    offset,
  ]);
  return rows;
};
