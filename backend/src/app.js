import express from "express";
import cors from "cors";

import authRoute from "./routes/auth.route.js";
import productRoute from "./routes/product.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hello world" });
});

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

export default app;
