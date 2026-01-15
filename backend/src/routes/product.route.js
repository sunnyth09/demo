import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Iphone" },
    { id: 2, name: "Samsung" },
    { id: 3, name: "Xiaomi" },
    { id: 4, name: "Oppo" },
    { id: 5, name: "Vivo" }
  ]);
});

export default router;
