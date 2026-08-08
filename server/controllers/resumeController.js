import Resume from '../models/Resume.js';
import { extractTextFromFile } from '../services/resumeParser.js';
import { analyzeResume } from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a resume file');
  }

  const rawText = await extractTextFromFile(req.file.buffer, req.file.mimetype);

  if (!rawText || rawText.trim().length < 50) {
    res.status(400);
    throw new Error('Could not extract sufficient text from the resume');
  }

  const analyzed = await analyzeResume(rawText);

  const resumeData = {
    userId: req.user._id,
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    rawText,
    skills: analyzed.skills || [],
    programmingLanguages: analyzed.programmingLanguages || [],
    frameworks: analyzed.frameworks || [],
    projects: analyzed.projects || [],
    experience: analyzed.experience || [],
    education: analyzed.education || [],
    certifications: analyzed.certifications || [],
    achievements: analyzed.achievements || [],
  };

  const resume = await Resume.findOneAndUpdate(
    { userId: req.user._id },
    resumeData,
    { upsert: true, new: true, runValidators: true }
  );

  res.status(201).json(resume);
});

export const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id });
  if (!resume) {
    return res.status(404).json({ message: 'No resume found' });
  }
  res.json(resume);
});
