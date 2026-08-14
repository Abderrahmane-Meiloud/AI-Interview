import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobProfileRoutes from './routes/jobProfileRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    message: 'Interview Coach Backend API is running successfully!',
    docs: {
      health: '/api/health',
      auth: '/api/auth',
      resume: '/api/resume',
      jobProfile: '/api/job-profile',
      interview: '/api/interview',
      dashboard: '/api/dashboard',
    },
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Interview Coach API is running' });
});

// Mount all API routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/job-profile', jobProfileRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
