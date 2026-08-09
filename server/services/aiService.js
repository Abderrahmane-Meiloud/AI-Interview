import { GoogleGenerativeAI } from '@google/generative-ai';
import { parseAIJSON } from '../utils/parseJSON.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const getModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is not configured. Please set GEMINI_API_KEY in server/.env');
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

};

const generateJSON = async (prompt) => {
  const model = getModel();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  return parseAIJSON(text);
};

const PROMPTS = {
  resumeAnalysis: (resumeText) => `
You are an expert resume analyzer. Extract structured information from the resume below.

Return ONLY valid JSON with this exact structure:
{
  "skills": ["skill1", "skill2"],
  "programmingLanguages": ["lang1", "lang2"],
  "frameworks": ["framework1", "framework2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "Brief description",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Duration",
      "description": "What they did"
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree",
      "year": "Year"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "achievements": ["achievement1", "achievement2"]
}

Resume:
${resumeText.slice(0, 15000)}
`,

  interviewGeneration: (context) => `
You are an expert technical interviewer. Generate a personalized interview with exactly 10 questions based on the candidate's profile.

Candidate Profile:
- Target Role: ${context.jobRole}
- Experience Level: ${context.experienceLevel}
- Expected Package: ${context.expectedPackage}
- Skills: ${context.skills?.join(', ') || 'N/A'}
- Programming Languages: ${context.programmingLanguages?.join(', ') || 'N/A'}
- Frameworks: ${context.frameworks?.join(', ') || 'N/A'}
- Projects: ${JSON.stringify(context.projects || [])}
- Experience: ${JSON.stringify(context.experience || [])}
- Previous Weaknesses: ${context.previousWeaknesses?.join(', ') || 'None'}

Generate questions that are:
1. Personalized to their resume and target role
2. Appropriate difficulty for their experience level and package expectation
3. Mix of categories: technical (3-4), resume-based (2-3), dsa (2-3), hr (2)

Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "Question text",
      "category": "technical|resume|dsa|hr",
      "difficulty": "easy|medium|hard"
    }
  ]
}
`,

  answerEvaluation: (question, answer, category) => `
You are an expert interview evaluator. Evaluate the candidate's answer.

Question: ${question}
Category: ${category}
Answer: ${answer}

Return ONLY valid JSON:
{
  "score": 8,
  "correctness": 8,
  "technicalKnowledge": 7,
  "communication": 8,
  "problemSolving": 7,
  "feedback": "Detailed feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"]
}

Score each field from 0-10. Be fair but thorough.
`,

  nextQuestion: (context) => `
You are an expert technical interviewer conducting an adaptive interview.

Candidate Profile:
- Target Role: ${context.jobRole}
- Experience Level: ${context.experienceLevel}
- Skills: ${context.skills?.join(', ') || 'N/A'}
- Projects: ${JSON.stringify(context.projects || [])}

Previous Q&A:
${context.previousQA}

Last answer score: ${context.lastScore}/10
Adjust difficulty: ${context.lastScore >= 7 ? 'increase' : context.lastScore <= 4 ? 'decrease' : 'maintain'}

Questions already asked (${context.askedCount}/10):
${context.askedQuestions}

Generate the NEXT single question. Category should be one not over-represented yet.
Categories needed: technical, resume, dsa, hr

Return ONLY valid JSON:
{
  "question": "Question text",
  "category": "technical|resume|dsa|hr",
  "difficulty": "easy|medium|hard"
}
`,

  finalEvaluation: (interviewData) => `
You are an expert interview evaluator. Provide a comprehensive final evaluation.

Interview Data:
- Job Role: ${interviewData.jobRole}
- Experience Level: ${interviewData.experienceLevel}
- Questions and Answers: ${JSON.stringify(interviewData.qaPairs)}

Return ONLY valid JSON:
{
  "overallScore": 78,
  "technicalScore": 82,
  "dsaScore": 71,
  "communicationScore": 74,
  "problemSolvingScore": 80,
  "resumeScore": 86,
  "hrScore": 76,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": [
    {
      "area": "DSA",
      "description": "Needs improvement in sliding window and binary search"
    },
    {
      "area": "Communication",
      "description": "Answers are technically correct but could be more structured"
    }
  ],
  "feedback": "Overall summary of the interview performance"
}

All scores are 0-100.
`,

  improvementPlan: (evaluation, jobRole) => `
You are a career coach. Create a personalized 7-day improvement plan.

Job Role: ${jobRole}
Evaluation: ${JSON.stringify(evaluation)}

Return ONLY valid JSON:
{
  "topAreas": ["area1", "area2", "area3"],
  "dailyPlan": [
    {
      "day": 1,
      "topic": "Arrays + Two Pointer",
      "activities": ["Practice 5 two-pointer problems", "Review time complexity"]
    },
    {
      "day": 2,
      "topic": "Sliding Window + Binary Search",
      "activities": ["Activity 1", "Activity 2"]
    }
  ]
}

Include exactly 7 days in dailyPlan.
`,
};

export const analyzeResume = async (resumeText) => {
  return generateJSON(PROMPTS.resumeAnalysis(resumeText));
};

export const generateInterviewQuestions = async (context) => {
  const result = await generateJSON(PROMPTS.interviewGeneration(context));
  return result.questions || [];
};

export const evaluateAnswer = async (question, answer, category) => {
  return generateJSON(PROMPTS.answerEvaluation(question, answer, category));
};

export const generateNextQuestion = async (context) => {
  return generateJSON(PROMPTS.nextQuestion(context));
};

export const generateFinalEvaluation = async (interviewData) => {
  return generateJSON(PROMPTS.finalEvaluation(interviewData));
};

export const generateImprovementPlan = async (evaluation, jobRole) => {
  return generateJSON(PROMPTS.improvementPlan(evaluation, jobRole));
};

export default {
  analyzeResume,
  generateInterviewQuestions,
  evaluateAnswer,
  generateNextQuestion,
  generateFinalEvaluation,
  generateImprovementPlan,
};
