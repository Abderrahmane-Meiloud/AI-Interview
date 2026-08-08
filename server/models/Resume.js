import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fileName: String,
    fileType: String,
    rawText: String,
    skills: [String],
    programmingLanguages: [String],
    frameworks: [String],
    projects: [
      {
        name: String,
        description: String,
        technologies: [String],
      },
    ],
    experience: [
      {
        company: String,
        role: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        institution: String,
        degree: String,
        year: String,
      },
    ],
    certifications: [String],
    achievements: [String],
  },
  { timestamps: true }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
