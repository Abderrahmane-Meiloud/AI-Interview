import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import React from 'react';
import { ClipboardListIcon, CalendarIcon, ChevronRightIcon } from '../components/Icons';

const scoreColor = (score) => {
  if (score >= 70) return 'text-success-600';
  if (score >= 50) return 'text-warning-500';
  return 'text-danger-500';
};

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
        icon={<ClipboardListIcon className="w-9 h-9 text-ink-faint" />}
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
        <h1 className="font-display text-2xl font-semibold text-ink">Interview History</h1>
        <p className="text-sm text-ink-soft mt-1">Review your past interview attempts</p>
      </div>

      <div className="space-y-2.5">
        {interviews.map((interview) => (
          <div
            key={interview._id}
            onClick={() => navigate(`/history/${interview._id}`)}
            className="card-compact hover:border-primary-200 hover:bg-app transition-colors cursor-pointer flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <h3 className="font-semibold text-ink truncate">
                {interview.jobRole} — {interview.package}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-ink-faint mt-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {new Date(interview.createdAt).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="text-right">
                <p className={`font-display text-xl font-semibold ${scoreColor(interview.score)}`}>
                  {interview.score}%
                </p>
                <p className="text-[11px] text-ink-faint uppercase tracking-wide">Score</p>
              </div>
              <ChevronRightIcon className="w-4 h-4 text-ink-faint" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
