
import express from 'express';
import * as settingController from '../controllers/setting.controller.js';
import { checkToken, checkAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET all settings
router.get('/', settingController.getSettings);

// UPDATE settings (Admin only)
router.put('/', checkToken, checkAdmin, settingController.updateSettings);

export default router;
