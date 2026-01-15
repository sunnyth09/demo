import { registerService, loginService } from "../services/auth.service.js";

export const register = async(req,res)=>{
  await registerService(req.body);
  res.json({msg:"Register success"});
};

export const login = async(req,res)=>{
  const token = await loginService(req.body);
  res.json({token});
};

export const getALL = async(req,res)=>{
  const [data] = await getAllCategories();
  res.json(data);
};