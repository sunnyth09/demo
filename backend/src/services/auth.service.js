import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "../models/user.model.js";

export const registerService = async(data)=>{
  data.password = await bcrypt.hash(data.password,10);
  return createUser(data);
};

export const loginService = async(data)=>{
  const [rows] = await findByEmail(data.email);
  if(!rows.length) throw "User not found";

  const ok = await bcrypt.compare(data.password, rows[0].password);
  if(!ok) throw "Wrong password";

  return jwt.sign({id:rows[0].id}, "secret", {expiresIn:"1d"});
};

export const getALL = () =>{
    return getAllCategories();
}

export const getAll = async(q)=>{
  let sql="SELECT * FROM products WHERE 1=1";

  if(q.keyword){
    sql+=` AND name LIKE '%${q.keyword}%'`;
  }

  return db.query(sql);
};
