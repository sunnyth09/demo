import { db } from "../config/db.js";

export const createUser = (data)=>{
  return db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [data.name, data.email, data.password]
  );
};

export const findByEmail = async (email)=>{
  const [rows] = await db.query(
    "SELECT * FROM users WHERE email=?",
    [email]
  );
  return rows;
};

export const findById = async (id)=>{
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [id]
  );
  return rows;
};

export const getAllCategories = (page = 1, limit = 10)=>{
  const offset = (page - 1) * limit;
  return db.query(
    "SELECT * FROM categories LIMIT ? OFFSET ?",
    [limit, offset]
  );
};
