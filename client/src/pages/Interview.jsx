import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

const categoryLabels = {
  technical: 'Technical',
  resume: 'Resume-Based',
  dsa: 'DSA / Problem Solving',
  hr: 'HR / Behavioral',
};

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">AI Interview</h1>
          <span className="text-sm text-gray-500">
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
          <div className="card space-y-6">
            <div>
              <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                {categoryLabels[question?.category] || question?.category}
              </span>
              <span className="text-xs text-gray-400 ml-2 capitalize">
                {question?.difficulty}
              </span>
            </div>

            <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
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
              {submitting ? 'Evaluating with AI...' : 'Submit Answer'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Answer Evaluation</h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <ScoreItem label="Overall" score={evaluation?.score} />
                <ScoreItem label="Correctness" score={evaluation?.correctness} />
                <ScoreItem label="Technical" score={evaluation?.technicalKnowledge} />
                <ScoreItem label="Communication" score={evaluation?.communication} />
              </div>

              <p className="text-gray-700 mb-4">{evaluation?.feedback}</p>

              {evaluation?.strengths?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm font-medium text-green-700 mb-1">Strengths</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {evaluation.strengths.map((s, i) => (
                      <li key={i}>✓ {s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {evaluation?.improvements?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-yellow-700 mb-1">Improvements</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {evaluation.improvements.map((imp, i) => (
                      <li key={i}>→ {imp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {questionNumber < totalQuestions ? (
              <button onClick={handleNext} className="btn-primary w-full py-3">
                Next Question →
              </button>
            ) : (
              <div className="card text-center">
                <LoadingSpinner />
                <p className="text-gray-600 mt-3">Generating final results...</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const ScoreItem = ({ label, score }) => (
  <div className="text-center p-3 bg-gray-50 rounded-lg">
    <p className="text-2xl font-bold text-primary-600">{score ?? '—'}/10</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

export default Interview;
