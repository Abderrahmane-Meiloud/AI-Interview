import express from 'express';
import { getDashboard, getProgress } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getDashboard);
router.get('/progress', protect, getProgress);

export default router;
