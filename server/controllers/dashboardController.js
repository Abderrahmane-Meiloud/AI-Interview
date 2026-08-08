import Resume from '../models/Resume.js';
import JobProfile from '../models/JobProfile.js';
import Interview from '../models/Interview.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const [resume, jobProfile, latestInterview, allInterviews] = await Promise.all([
    Resume.findOne({ userId: req.user._id }),
    JobProfile.findOne({ userId: req.user._id }),
    Interview.findOne({ userId: req.user._id, status: 'completed' }).sort({
      createdAt: -1,
    }),
    Interview.find({ userId: req.user._id, status: 'completed' }).sort({
      createdAt: -1,
    }),
  ]);

  const avgScore =
    allInterviews.length > 0
      ? Math.round(
          allInterviews.reduce((sum, i) => sum + (i.score || 0), 0) /
            allInterviews.length
        )
      : 0;

  const areasToImprove = latestInterview?.improvements?.map((i) => i.area) || [];

  res.json({
    user: {
      name: req.user.name,
      email: req.user.email,
    },
    resumeStatus: resume ? 'uploaded' : 'not_uploaded',
    resume,
    jobProfile,
    latestScore: latestInterview?.score || null,
    interviewReadiness: avgScore || (resume && jobProfile ? 50 : 0),
    areasToImprove,
    totalInterviews: allInterviews.length,
  });
});

export const getProgress = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    userId: req.user._id,
    status: 'completed',
  })
    .sort({ createdAt: 1 })
    .select(
      'score technicalScore dsaScore communicationScore problemSolvingScore resumeScore hrScore jobRole createdAt'
    );

  const progressData = interviews.map((interview, index) => ({
    interview: index + 1,
    date: interview.createdAt,
    jobRole: interview.jobRole,
    overall: interview.score,
    technical: interview.technicalScore,
    dsa: interview.dsaScore,
    communication: interview.communicationScore,
    problemSolving: interview.problemSolvingScore,
    resume: interview.resumeScore,
    hr: interview.hrScore,
  }));

  res.json({
    interviews: progressData,
    totalInterviews: interviews.length,
    latestScore: interviews.length > 0 ? interviews[interviews.length - 1].score : 0,
    improvement:
      interviews.length >= 2
        ? interviews[interviews.length - 1].score - interviews[0].score
        : 0,
  });
});
