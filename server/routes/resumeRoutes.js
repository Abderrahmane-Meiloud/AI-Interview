import express from 'express';
import { uploadResume, getResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);

export default router;
