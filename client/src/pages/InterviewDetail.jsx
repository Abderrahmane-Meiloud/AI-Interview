import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import React from 'react';


const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const { data } = await interviewAPI.getById(id);
      setInterview(data);
    } catch {
      navigate('/history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const scores = [
    { label: 'Technical Knowledge', value: interview.technicalScore },
    { label: 'DSA', value: interview.dsaScore },
    { label: 'Problem Solving', value: interview.problemSolvingScore },
    { label: 'Communication', value: interview.communicationScore },
    { label: 'Resume Knowledge', value: interview.resumeScore },
    { label: 'HR / Behavioral', value: interview.hrScore },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/history')}
        className="text-sm text-primary-600 hover:underline"
      >
        ← Back to History
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {interview.jobRole} — {interview.package}
        </h1>
        <p className="text-gray-500 mt-1">
          {new Date(interview.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="card text-center py-6">
        <p className="text-5xl font-bold text-primary-600">{interview.score}%</p>
        <p className="text-sm text-gray-500 mt-1">Overall Score</p>
      </div>

      <div className="card space-y-3">
        <h2 className="font-semibold">Scores</h2>
        {scores.map((s) => (
          <ProgressBar key={s.label} label={s.label} value={s.value || 0} />
        ))}
      </div>

      {interview.questions?.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Questions & Answers</h2>
          {interview.questions.map((q, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded capitalize">
                  {q.category}
                </span>
                {q.evaluation?.score != null && (
                  <span className="text-xs text-gray-500">
                    Score: {q.evaluation.score}/10
                  </span>
                )}
              </div>
              <p className="font-medium text-gray-900">{q.question}</p>
              {q.answer && (
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg">
                  {q.answer}
                </p>
              )}
              {q.evaluation?.feedback && (
                <p className="text-sm text-primary-700 mt-2 italic">
                  {q.evaluation.feedback}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewDetail;
