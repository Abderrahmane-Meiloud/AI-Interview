import Resume from '../models/Resume.js';
import JobProfile from '../models/JobProfile.js';
import Interview from '../models/Interview.js';
import {
  generateInterviewQuestions,
  evaluateAnswer,
  generateNextQuestion,
  generateFinalEvaluation,
  generateImprovementPlan,
} from '../services/aiService.js';
import asyncHandler from '../utils/asyncHandler.js';

const getPreviousWeaknesses = async (userId) => {
  const lastInterview = await Interview.findOne({
    userId,
    status: 'completed',
  }).sort({ createdAt: -1 });

  return lastInterview?.improvements?.map((i) => i.area) || [];
};

export const startInterview = asyncHandler(async (req, res) => {
  const [resume, jobProfile] = await Promise.all([
    Resume.findOne({ userId: req.user._id }),
    JobProfile.findOne({ userId: req.user._id }),
  ]);

  if (!resume) {
    res.status(400);
    throw new Error('Please upload your resume before starting an interview');
  }

  if (!jobProfile) {
    res.status(400);
    throw new Error('Please set up your job profile before starting an interview');
  }

  const previousWeaknesses = await getPreviousWeaknesses(req.user._id);

  const context = {
    jobRole: jobProfile.jobRole,
    experienceLevel: jobProfile.experienceLevel,
    expectedPackage: jobProfile.expectedPackage,
    skills: resume.skills,
    programmingLanguages: resume.programmingLanguages,
    frameworks: resume.frameworks,
    projects: resume.projects,
    experience: resume.experience,
    previousWeaknesses,
  };

  const questions = await generateInterviewQuestions(context);

  const interview = await Interview.create({
    userId: req.user._id,
    jobRole: jobProfile.jobRole,
    package: jobProfile.expectedPackage,
    experienceLevel: jobProfile.experienceLevel,
    questions: questions.slice(0, 10).map((q) => ({
      question: q.question,
      category: q.category,
      difficulty: q.difficulty,
    })),
    totalQuestions: Math.min(questions.length, 10),
    currentQuestionIndex: 0,
    status: 'in_progress',
  });

  res.status(201).json({
    interviewId: interview._id,
    totalQuestions: interview.totalQuestions,
    currentQuestion: interview.questions[0],
    questionNumber: 1,
  });
});

export const submitAnswer = asyncHandler(async (req, res) => {
  const { answer } = req.body;
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (interview.status === 'completed') {
    res.status(400);
    throw new Error('Interview already completed');
  }

  if (!answer || answer.trim().length === 0) {
    res.status(400);
    throw new Error('Please provide an answer');
  }

  const currentIndex = interview.currentQuestionIndex;
  const currentQuestion = interview.questions[currentIndex];

  if (!currentQuestion) {
    res.status(400);
    throw new Error('No current question found');
  }

  const evaluation = await evaluateAnswer(
    currentQuestion.question,
    answer,
    currentQuestion.category
  );

  interview.questions[currentIndex].answer = answer;
  interview.questions[currentIndex].evaluation = evaluation;

  const nextIndex = currentIndex + 1;
  interview.currentQuestionIndex = nextIndex;

  let nextQuestion = null;
  const isComplete = nextIndex >= interview.totalQuestions;

  if (!isComplete && nextIndex < interview.questions.length) {
    nextQuestion = interview.questions[nextIndex];
  } else if (!isComplete) {
    const [resume, jobProfile] = await Promise.all([
      Resume.findOne({ userId: req.user._id }),
      JobProfile.findOne({ userId: req.user._id }),
    ]);

    const previousQA = interview.questions
      .slice(0, nextIndex)
      .map(
        (q) =>
          `Q: ${q.question}\nA: ${q.answer || 'N/A'}\nScore: ${q.evaluation?.score || 'N/A'}`
      )
      .join('\n\n');

    const adaptiveContext = {
      jobRole: jobProfile.jobRole,
      experienceLevel: jobProfile.experienceLevel,
      skills: resume.skills,
      projects: resume.projects,
      previousQA,
      lastScore: evaluation.score,
      askedCount: nextIndex,
      askedQuestions: interview.questions.map((q) => q.question).join('\n'),
    };

    const newQ = await generateNextQuestion(adaptiveContext);
    interview.questions.push({
      question: newQ.question,
      category: newQ.category,
      difficulty: newQ.difficulty,
    });
    nextQuestion = interview.questions[nextIndex];
  }

  await interview.save();

  res.json({
    evaluation,
    isComplete,
    nextQuestion: isComplete ? null : nextQuestion,
    questionNumber: isComplete ? interview.totalQuestions : nextIndex + 1,
    totalQuestions: interview.totalQuestions,
  });
});

export const completeInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  if (interview.status === 'completed') {
    return res.json(interview);
  }

  const qaPairs = interview.questions
    .filter((q) => q.answer)
    .map((q) => ({
      question: q.question,
      category: q.category,
      answer: q.answer,
      score: q.evaluation?.score || 0,
    }));

  const finalEval = await generateFinalEvaluation({
    jobRole: interview.jobRole,
    experienceLevel: interview.experienceLevel,
    qaPairs,
  });

  const improvementPlan = await generateImprovementPlan(finalEval, interview.jobRole);

  interview.status = 'completed';
  interview.score = finalEval.overallScore;
  interview.technicalScore = finalEval.technicalScore;
  interview.dsaScore = finalEval.dsaScore;
  interview.communicationScore = finalEval.communicationScore;
  interview.problemSolvingScore = finalEval.problemSolvingScore;
  interview.resumeScore = finalEval.resumeScore;
  interview.hrScore = finalEval.hrScore;
  interview.strengths = finalEval.strengths;
  interview.improvements = finalEval.improvements;
  interview.feedback = finalEval.feedback;
  interview.improvementPlan = improvementPlan;

  await interview.save();

  res.json(interview);
});

export const getInterviewHistory = asyncHandler(async (req, res) => {
  const interviews = await Interview.find({
    userId: req.user._id,
    status: 'completed',
  })
    .sort({ createdAt: -1 })
    .select('jobRole package score createdAt status');

  res.json(interviews);
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!interview) {
    res.status(404);
    throw new Error('Interview not found');
  }

  res.json(interview);
});

export const getCurrentInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findOne({
    _id: req.params.id,
    userId: req.user._id,
    status: 'in_progress',
  });

  if (!interview) {
    res.status(404);
    throw new Error('Active interview not found');
  }

  const currentQuestion = interview.questions[interview.currentQuestionIndex];

  res.json({
    interviewId: interview._id,
    totalQuestions: interview.totalQuestions,
    currentQuestion,
    questionNumber: interview.currentQuestionIndex + 1,
    answeredQuestions: interview.questions.filter((q) => q.answer).length,
  });
});
