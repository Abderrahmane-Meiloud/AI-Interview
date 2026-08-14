import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dashboardAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ScoreCard from '../components/ScoreCard';
import React from 'react';
import { TrendingUpIcon, CalendarIcon } from '../components/Icons';

const scoreColor = (score) => {
  if (score >= 70) return 'text-success-600';
  if (score >= 50) return 'text-warning-500';
  return 'text-danger-500';
};

const Progress = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data: progressData } = await dashboardAPI.getProgress();
      setData(progressData);
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!data?.interviews?.length) {
    return (
      <EmptyState
        icon={<TrendingUpIcon className="w-9 h-9 text-ink-faint" />}
        title="No Progress Data"
        description="Complete at least one interview to track your progress."
        action={
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Start Interview
          </button>
        }
      />
    );
  }

  const chartData = data.interviews.map((item) => ({
    name: `Interview ${item.interview}`,
    Overall: item.overall,
    Technical: item.technical,
    DSA: item.dsa,
    Communication: item.communication,
    'Problem Solving': item.problemSolving,
    Resume: item.resume,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Progress Tracking</h1>
        <p className="text-sm text-ink-soft mt-1">See how your interview scores improve over time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <ScoreCard title="Total Interviews" score={data.totalInterviews} />
        <ScoreCard title="Latest Score" score={data.latestScore} suffix="%" color="green" />
        <ScoreCard
          title="Improvement"
          score={data.improvement > 0 ? `+${data.improvement}` : data.improvement}
          suffix="%"
          color={data.improvement > 0 ? 'green' : 'red'}
        />
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-ink mb-4">Overall Score Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDE5DF" />
            <XAxis dataKey="name" fontSize={12} stroke="#8B978F" tick={{ fill: '#647067' }} />
            <YAxis domain={[0, 100]} fontSize={12} stroke="#8B978F" tick={{ fill: '#647067' }} />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#DDE5DF', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line type="monotone" dataKey="Overall" stroke="#166534" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-ink mb-4">Category Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDE5DF" />
            <XAxis dataKey="name" fontSize={12} stroke="#8B978F" tick={{ fill: '#647067' }} />
            <YAxis domain={[0, 100]} fontSize={12} stroke="#8B978F" tick={{ fill: '#647067' }} />
            <Tooltip contentStyle={{ borderRadius: 8, borderColor: '#DDE5DF', fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Line type="monotone" dataKey="Technical" stroke="#166534" strokeWidth={2} />
            <Line type="monotone" dataKey="DSA" stroke="#15803D" strokeWidth={2} />
            <Line type="monotone" dataKey="Communication" stroke="#22A85F" strokeWidth={2} />
            <Line type="monotone" dataKey="Problem Solving" stroke="#92660A" strokeWidth={2} />
            <Line type="monotone" dataKey="Resume" stroke="#B23A3A" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-base font-semibold text-ink mb-4">Interview Timeline</h2>
        <div className="space-y-2">
          {data.interviews.map((item) => (
            <div
              key={item.interview}
              className="flex items-center justify-between p-3.5 bg-app rounded-lg border border-line"
            >
              <div>
                <p className="font-medium text-sm text-ink">Interview {item.interview}</p>
                <p className="text-xs text-ink-faint mt-0.5">{item.jobRole}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-ink-faint">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                <span className={`font-display font-semibold ${scoreColor(item.overall)}`}>
                  {item.overall}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
