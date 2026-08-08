import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  category: {
    type: String,
    enum: ['technical', 'resume', 'dsa', 'hr'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium',
  },
  answer: String,
  evaluation: {
    score: Number,
    correctness: Number,
    technicalKnowledge: Number,
    communication: Number,
    problemSolving: Number,
    feedback: String,
    strengths: [String],
    improvements: [String],
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobRole: String,
    package: String,
    experienceLevel: String,
    status: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
    },
    currentQuestionIndex: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 10 },
    questions: [questionSchema],
    score: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    dsaScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    resumeScore: { type: Number, default: 0 },
    hrScore: { type: Number, default: 0 },
    strengths: [String],
    improvements: [
      {
        area: String,
        description: String,
      },
    ],
    improvementPlan: {
      topAreas: [String],
      dailyPlan: [
        {
          day: Number,
          topic: String,
          activities: [String],
        },
      ],
    },
    feedback: String,
  },
  { timestamps: true }
);

const Interview = mongoose.model('Interview', interviewSchema);
export default Interview;
