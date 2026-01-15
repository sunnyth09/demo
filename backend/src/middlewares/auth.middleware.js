const jwt = require("jsonwebtoken");

export const auth = (req,res,next)=>{
  const token = req.headers.authorization;
  if(!token) return res.status(401).json("No token");

  jwt.verify(token,"secret",(err,decoded)=>{
    if(err) return res.status(403).json("Invalid token");
    req.user = decoded;
    next();
  });
};
