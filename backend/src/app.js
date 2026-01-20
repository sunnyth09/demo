import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import categoryRoute from "./routes/category.route.js";
import { initBucket } from "./services/minio.service.js";

dotenv.config();

initBucket().catch(console.error);

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend running"
  });
});

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);

app.use((req,res)=>{
  res.status(404).json({
    message: "API không tồn tại"
  });
});

export default app;
