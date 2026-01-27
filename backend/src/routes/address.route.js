import express from "express";
import * as AddressController from "../controllers/address.controller.js";
import { checkToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", checkToken, AddressController.getMyAddresses);
router.post("/", checkToken, AddressController.createAddress);
router.put("/:id", checkToken, AddressController.updateAddress);
router.delete("/:id", checkToken, AddressController.deleteAddress);

export default router;
