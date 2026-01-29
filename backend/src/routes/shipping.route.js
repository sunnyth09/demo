import express from 'express';
import {
  getShippingZones,
  calculateShipping,
  adminGetAllZones,
  adminGetZoneById,
  adminCreateZone,
  adminUpdateZone,
  adminDeleteZone
} from '../controllers/shipping.controller.js';
import { checkToken, checkAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// ============ PUBLIC ROUTES ============
// Lấy danh sách khu vực vận chuyển
router.get('/zones', getShippingZones);

// Tính phí ship
router.post('/calculate', calculateShipping);

// ============ ADMIN ROUTES ============
// Lấy tất cả khu vực (bao gồm inactive)
router.get('/admin/zones', checkToken, checkAdmin, adminGetAllZones);

// Lấy khu vực theo ID
router.get('/admin/zones/:id', checkToken, checkAdmin, adminGetZoneById);

// Tạo khu vực mới
router.post('/admin/zones', checkToken, checkAdmin, adminCreateZone);

// Cập nhật khu vực
router.put('/admin/zones/:id', checkToken, checkAdmin, adminUpdateZone);

// Xóa khu vực
router.delete('/admin/zones/:id', checkToken, checkAdmin, adminDeleteZone);

export default router;
