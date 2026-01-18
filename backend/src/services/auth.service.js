import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "../models/user.model.js";

export const registerService = async (data)=>{
  const user = await findByEmail(data.email);
  if(user.length > 0){
    throw new Error("Email đã tồn tại");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(data.password, salt);

  await createUser({
    name: data.name,
    email: data.email,
    password: hash
  });
};

export const loginService = async (data)=> {
  const user = await findByEmail(data.email);
  if(user.length === 0){
    throw new Error("Sai email hoặc mật khẩu");
  }

  const isMatch = await bcrypt.compare(
    data.password,
    user[0].password
  );

  if(!isMatch){
    throw new Error("Sai email hoặc mật khẩu");
  }

  const accessToken = jwt.sign(
    { id: user[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user[0].id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {status: true,accessToken,refreshToken};
};
