import express from 'express';
import {
  createJobProfile,
  getJobProfile,
} from '../controllers/jobProfileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createJobProfile);
router.get('/', protect, getJobProfile);

export default router;
