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
        icon="📈"
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
        <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
        <p className="text-gray-500 mt-1">See how your interview scores improve over time</p>
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
        <h2 className="text-lg font-semibold mb-4">Overall Score Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis domain={[0, 100]} fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Overall" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis domain={[0, 100]} fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Technical" stroke="#3b82f6" />
            <Line type="monotone" dataKey="DSA" stroke="#8b5cf6" />
            <Line type="monotone" dataKey="Communication" stroke="#10b981" />
            <Line type="monotone" dataKey="Problem Solving" stroke="#f59e0b" />
            <Line type="monotone" dataKey="Resume" stroke="#ef4444" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Interview Timeline</h2>
        <div className="space-y-3">
          {data.interviews.map((item) => (
            <div
              key={item.interview}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p className="font-medium">Interview {item.interview}</p>
                <p className="text-xs text-gray-500">{item.jobRole}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {new Date(item.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                <span
                  className={`font-bold ${
                    item.overall >= 70
                      ? 'text-green-600'
                      : item.overall >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                  }`}
                >
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
