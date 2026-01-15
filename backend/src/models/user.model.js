import { db } from "../config/db.js";

export const createUser = (data)=>{
  return db.query(
    "INSERT INTO users(name,email,password) VALUES(?,?,?)",
    [data.name, data.email, data.password]
  );
};

export const findByEmail = (email)=>{
  return db.query("SELECT * FROM users WHERE email=?", [email]);
};

export const getAllCategories = ()=>{
  return db.query("SELECT * FROM categories");
};