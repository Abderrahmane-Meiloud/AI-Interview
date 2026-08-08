import express from 'express';
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getInterviewHistory,
  getInterviewById,
  getCurrentInterview,
} from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, startInterview);
router.get('/history', protect, getInterviewHistory);
router.get('/:id/current', protect, getCurrentInterview);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/complete', protect, completeInterview);
router.get('/:id', protect, getInterviewById);

export default router;
