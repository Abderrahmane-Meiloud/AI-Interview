import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ProgressBar from '../components/ProgressBar';

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Interview Result</h1>
          <p className="text-gray-500 mt-2">
            {interview.jobRole} — {interview.package}
          </p>
        </div>

        <div className="card text-center py-8">
          <p className="text-sm text-gray-500 uppercase tracking-wide">Overall Score</p>
          <p className="text-6xl font-bold text-primary-600 mt-2">
            {interview.score}
            <span className="text-2xl text-gray-400">/100</span>
          </p>
        </div>

        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">Category Breakdown</h2>
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
            <h2 className="text-lg font-semibold mb-3">Strengths</h2>
            <ul className="space-y-2">
              {interview.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {interview.improvements?.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-3">Areas to Improve</h2>
            <div className="space-y-4">
              {interview.improvements.map((imp, i) => (
                <div key={i}>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="text-yellow-500">⚠</span> {imp.area}
                  </p>
                  <p className="text-sm text-gray-600 ml-6 mt-1">{imp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {interview.feedback && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">Overall Feedback</h2>
            <p className="text-gray-700">{interview.feedback}</p>
          </div>
        )}

        {interview.improvementPlan?.dailyPlan?.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold mb-2">7-Day Improvement Plan</h2>
            {interview.improvementPlan.topAreas?.length > 0 && (
              <p className="text-sm text-gray-600 mb-4">
                Focus areas: {interview.improvementPlan.topAreas.join(', ')}
              </p>
            )}
            <div className="space-y-3">
              {interview.improvementPlan.dailyPlan.map((day) => (
                <div key={day.day} className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-primary-700">Day {day.day}</p>
                  <p className="text-gray-900 mt-1">{day.topic}</p>
                  {day.activities?.length > 0 && (
                    <ul className="text-sm text-gray-600 mt-2 space-y-1">
                      {day.activities.map((act, i) => (
                        <li key={i}>• {act}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 justify-center">
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
