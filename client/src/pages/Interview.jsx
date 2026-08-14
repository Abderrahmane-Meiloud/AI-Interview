import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import AIThinking from '../components/AIThinking';
import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon, ArrowRightIcon } from '../components/Icons';

const categoryLabels = {
  technical: 'Technical',
  resume: 'Resume-Based',
  dsa: 'DSA / Problem Solving',
  hr: 'HR / Behavioral',
};

const EVALUATION_STEPS = [
  'Reading your answer…',
  'Evaluating technical depth…',
  'Checking communication clarity…',
  'Preparing feedback…',
];

const IN_PROGRESS_KEY = 'inProgressInterviewId';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    loadInterview();
  }, [id]);

  const loadInterview = async () => {
    try {
      const { data } = await interviewAPI.getCurrent(id);
      setQuestion(data.currentQuestion);
      setQuestionNumber(data.questionNumber);
      setTotalQuestions(data.totalQuestions);
    } catch {
      localStorage.removeItem(IN_PROGRESS_KEY);
      toast.error('Failed to load interview');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Please write an answer');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await interviewAPI.submitAnswer(id, answer);
      setEvaluation(data.evaluation);
      setShowFeedback(true);

      if (data.isComplete) {
        await interviewAPI.complete(id);
        localStorage.removeItem(IN_PROGRESS_KEY);
        setTimeout(() => navigate(`/interview/${id}/result`), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit answer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setEvaluation(null);
    setAnswer('');
    loadInterview();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app">
      <header className="bg-white border-b border-line px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="font-display text-lg font-semibold text-ink">AI Interview</h1>
          <span className="text-sm text-ink-faint font-mono">
            Question {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div className="max-w-3xl mx-auto mt-3">
          <ProgressBar
            value={questionNumber}
            max={totalQuestions}
            showValue={false}
            color="primary"
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-8">
        {!showFeedback ? (
          submitting ? (
            <div className="card">
              <AIThinking steps={EVALUATION_STEPS} />
            </div>
          ) : (
            <div className="card space-y-6">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary">
                  {categoryLabels[question?.category] || question?.category}
                </span>
                <span className="text-xs text-ink-faint capitalize">
                  {question?.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-medium text-ink leading-relaxed">
                {question?.question}
              </h2>

              <div>
                <label className="label">Your Answer</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="input-field min-h-[200px] resize-y"
                  placeholder="Type your answer here..."
                  disabled={submitting}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !answer.trim()}
                className="btn-primary w-full py-3"
              >
                Submit Answer
              </button>
            </div>
          )
        ) : (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-base font-semibold text-ink mb-4">Answer Evaluation</h3>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <ScoreItem label="Overall" score={evaluation?.score} />
                <ScoreItem label="Correctness" score={evaluation?.correctness} />
                <ScoreItem label="Technical" score={evaluation?.technicalKnowledge} />
                <ScoreItem label="Communication" score={evaluation?.communication} />
                <ScoreItem label="Problem Solving" score={evaluation?.problemSolving} />
              </div>

              <p className="text-sm text-ink-soft mb-4">{evaluation?.feedback}</p>

              {evaluation?.strengths?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-semibold text-success-700 mb-1.5">Strengths</p>
                  <ul className="space-y-1.5">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                        <CheckCircleIcon className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation?.improvements?.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-warning-600 mb-1.5">Improvements</p>
                  <ul className="space-y-1.5">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                        <AlertTriangleIcon className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {questionNumber < totalQuestions ? (
              <button onClick={handleNext} className="btn-primary w-full py-3">
                <span>Next Question</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>
            ) : (
              <div className="card">
                <AIThinking
                  steps={['Calculating final scores…', 'Preparing your feedback…']}
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const ScoreItem = ({ label, score }) => (
  <div className="text-center p-3 bg-app rounded-lg border border-line">
    <p className="font-display text-2xl font-semibold text-primary-700">{score ?? '—'}<span className="text-sm text-ink-faint">/10</span></p>
    <p className="text-xs text-ink-faint mt-1">{label}</p>
  </div>
);

export default Interview;
