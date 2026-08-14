import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import React from 'react';
import { ArrowLeftIcon, CalendarIcon } from '../components/Icons';

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
    <div className="max-w-4xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/history')}
        className="flex items-center gap-1.5 text-sm text-primary-700 hover:underline"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Back to History
      </button>

      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          {interview.jobRole} — {interview.package}
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-ink-soft mt-1">
          <CalendarIcon className="w-3.5 h-3.5" />
          {new Date(interview.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      <div className="card text-center py-6">
        <p className="font-display text-5xl font-semibold text-primary-700">{interview.score}%</p>
        <p className="text-sm text-ink-faint mt-1">Overall Score</p>
      </div>

      <div className="card space-y-3">
        <h2 className="text-base font-semibold text-ink">Scores</h2>
        {scores.map((s) => (
          <ProgressBar key={s.label} label={s.label} value={s.value || 0} />
        ))}
      </div>

      {interview.questions?.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-ink">Questions &amp; Answers</h2>
          {interview.questions.map((q, i) => (
            <div key={i} className="card">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge badge-neutral capitalize">
                  {q.category}
                </span>
                {q.evaluation?.score != null && (
                  <span className="text-xs text-ink-faint font-mono">
                    Score: {q.evaluation.score}/10
                  </span>
                )}
              </div>
              <p className="font-medium text-sm text-ink">{q.question}</p>
              {q.answer && (
                <p className="text-sm text-ink-soft mt-2 bg-app p-3 rounded-lg border border-line">
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
