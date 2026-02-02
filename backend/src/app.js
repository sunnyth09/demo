import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";
import categoryRoute from "./routes/category.route.js";
import statisticsRoute from "./routes/statistics.route.js";
import userRoute from "./routes/user.route.js";
import addressRoute from "./routes/address.route.js";
import orderRoute from "./routes/order.route.js";
import revenueRoute from "./routes/revenue.route.js";
import shippingRoute from "./routes/shipping.route.js";
import couponRoute from "./routes/coupon.route.js";
import articleRoute from "./routes/article.route.js";
import favoriteRoute from "./routes/favorite.route.js";

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
app.use("/api/statistics", statisticsRoute);
app.use("/api/user", userRoute);
app.use("/api/addresses", addressRoute);
app.use("/api/orders", orderRoute);
app.use("/api/revenue", revenueRoute);
app.use("/api/shipping", shippingRoute);
app.use("/api/coupons", couponRoute);
app.use("/api/articles", articleRoute);
app.use("/api/favorites", favoriteRoute);

app.use((req,res)=>{
  res.status(404).json({
    message: "API không tồn tại"
  });
});

export default app;
