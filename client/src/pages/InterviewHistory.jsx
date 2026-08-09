import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import React from 'react';


const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await interviewAPI.getHistory();
      setInterviews(data);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (interviews.length === 0) {
    return (
      <EmptyState
        icon="📋"
        title="No Interview History"
        description="Complete your first interview to see your history here."
        action={
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Go to Dashboard
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interview History</h1>
        <p className="text-gray-500 mt-1">Review your past interview attempts</p>
      </div>

      <div className="space-y-3">
        {interviews.map((interview) => (
          <div
            key={interview._id}
            onClick={() => navigate(`/history/${interview._id}`)}
            className="card hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between"
          >
            <div>
              <h3 className="font-semibold text-gray-900">
                {interview.jobRole} — {interview.package}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(interview.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${
                  interview.score >= 70
                    ? 'text-green-600'
                    : interview.score >= 50
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {interview.score}%
              </p>
              <p className="text-xs text-gray-400">Score</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
