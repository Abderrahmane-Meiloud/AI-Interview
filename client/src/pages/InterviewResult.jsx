import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';
import React from 'react';
import { CheckCircleIcon, AlertTriangleIcon } from '../components/Icons';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [id]);

  const fetchResult = async () => {
    try {
      const { data } = await interviewAPI.getById(id);
      setInterview(data);
    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const scores = [
    { label: 'Technical Knowledge', value: interview.technicalScore },
    { label: 'DSA', value: interview.dsaScore },
    { label: 'Problem Solving', value: interview.problemSolvingScore },
    { label: 'Communication', value: interview.communicationScore },
    { label: 'Resume Knowledge', value: interview.resumeScore },
    { label: 'HR / Behavioral', value: interview.hrScore },
  ];

  return (
    <div className="min-h-screen bg-app py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="text-center">
          <h1 className="font-display text-3xl font-semibold text-ink">Interview Result</h1>
          <p className="text-sm text-ink-soft mt-2">
            {interview.jobRole} — {interview.package}
          </p>
        </div>

        <div className="card text-center py-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Overall Score</p>
          <p className="font-display text-6xl font-semibold text-primary-700 mt-2">
            {interview.score}
            <span className="text-2xl text-ink-faint">/100</span>
          </p>
        </div>

        <div className="card space-y-4">
          <h2 className="text-base font-semibold text-ink">Category Breakdown</h2>
          {scores.map((s) => (
            <ProgressBar
              key={s.label}
              label={s.label}
              value={s.value || 0}
              color={s.value >= 70 ? 'green' : s.value >= 50 ? 'yellow' : 'red'}
            />
          ))}
        </div>

        {interview.strengths?.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-ink mb-3">Strengths</h2>
            <ul className="space-y-2">
              {interview.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <CheckCircleIcon className="w-4 h-4 text-success-600 flex-shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {interview.improvements?.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-ink mb-3">Areas to Improve</h2>
            <div className="space-y-4">
              {interview.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangleIcon className="w-4 h-4 text-warning-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-sm text-ink">{imp.area}</p>
                    <p className="text-sm text-ink-soft mt-0.5">{imp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {interview.feedback && (
          <div className="card">
            <h2 className="text-base font-semibold text-ink mb-2">Overall Feedback</h2>
            <p className="text-sm text-ink-soft">{interview.feedback}</p>
          </div>
        )}

        {interview.improvementPlan?.dailyPlan?.length > 0 && (
          <div className="card">
            <h2 className="text-base font-semibold text-ink mb-2">7-Day Improvement Plan</h2>
            {interview.improvementPlan.topAreas?.length > 0 && (
              <p className="text-sm text-ink-soft mb-4">
                Focus areas: {interview.improvementPlan.topAreas.join(', ')}
              </p>
            )}
            <div className="space-y-2.5">
              {interview.improvementPlan.dailyPlan.map((day) => (
                <div key={day.day} className="p-4 bg-app rounded-lg border border-line">
                  <p className="font-mono text-xs font-semibold text-primary-700 uppercase tracking-wide">Day {day.day}</p>
                  <p className="text-sm font-medium text-ink mt-1">{day.topic}</p>
                  {day.activities?.length > 0 && (
                    <ul className="text-sm text-ink-soft mt-2 space-y-1">
                      {day.activities.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-ink-faint">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-3">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/progress')} className="btn-secondary px-8 py-3">
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewResult;
