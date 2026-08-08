import JobProfile from '../models/JobProfile.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createJobProfile = asyncHandler(async (req, res) => {
  const { jobRole, experienceLevel, expectedPackage } = req.body;

  if (!jobRole || !experienceLevel || !expectedPackage) {
    res.status(400);
    throw new Error('Please provide job role, experience level, and expected package');
  }

  const profile = await JobProfile.findOneAndUpdate(
    { userId: req.user._id },
    { userId: req.user._id, jobRole, experienceLevel, expectedPackage },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json(profile);
});

export const getJobProfile = asyncHandler(async (req, res) => {
  const profile = await JobProfile.findOne({ userId: req.user._id });
  if (!profile) {
    return res.status(404).json({ message: 'No job profile found' });
  }
  res.json(profile);
});
