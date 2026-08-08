import mongoose from 'mongoose';

const jobProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    jobRole: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'],
      required: true,
    },
    expectedPackage: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const JobProfile = mongoose.model('JobProfile', jobProfileSchema);
export default JobProfile;
