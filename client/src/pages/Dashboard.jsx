import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import toast from 'react-hot-toast';
import { dashboardAPI, interviewAPI } from '../services/api';
import { DashboardSkeleton } from '../components/Skeleton';
import ProgressBar from '../components/ProgressBar';
import ScoreCard from '../components/ScoreCard';
import EmptyState from '../components/EmptyState';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data: dashData } = await dashboardAPI.get();
      setData(dashData);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    if (data?.resumeStatus !== 'uploaded') {
      toast.error('Please upload your resume first');
      navigate('/resume');
      return;
    }
    if (!data?.jobProfile) {
      toast.error('Please set up your job profile first');
      navigate('/job-profile');
      return;
    }

    setStarting(true);
    try {
      const { data: interview } = await interviewAPI.start();
      navigate(`/interview/${interview.interviewId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {data?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your interview preparation overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Target Role"
          score={data?.jobProfile?.jobRole || 'Not set'}
          icon={<span className="text-xl">🎯</span>}
        />
        <ScoreCard
          title="Target Package"
          score={data?.jobProfile?.expectedPackage || 'Not set'}
          icon={<span className="text-xl">💰</span>}
        />
        <ScoreCard
          title="Latest Score"
          score={data?.latestScore}
          suffix="%"
          icon={<span className="text-xl">⭐</span>}
          color={data?.latestScore >= 70 ? 'green' : 'yellow'}
        />
        <ScoreCard
          title="Total Interviews"
          score={data?.totalInterviews || 0}
          icon={<span className="text-xl">📝</span>}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-4">Interview Readiness</h2>
          <ProgressBar
            value={data?.interviewReadiness || 0}
            label={`${data?.interviewReadiness || 0}/100`}
            color={
              data?.interviewReadiness >= 70
                ? 'green'
                : data?.interviewReadiness >= 40
                  ? 'yellow'
                  : 'red'
            }
          />
          <p className="text-sm text-gray-500 mt-3">
            {data?.resumeStatus === 'uploaded'
              ? 'Resume uploaded ✓'
              : 'Upload your resume to get started'}
            {data?.jobProfile ? ' · Job profile set ✓' : ' · Set up job profile'}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={handleStartInterview}
              disabled={starting}
              className="btn-primary px-6 py-2.5"
            >
              {starting ? 'Starting...' : 'Start New Interview'}
            </button>
            <button
              onClick={() => navigate('/resume')}
              className="btn-secondary px-6 py-2.5"
            >
              Upload Resume
            </button>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Areas to Improve</h2>
          {data?.areasToImprove?.length > 0 ? (
            <ul className="space-y-2">
              {data.areasToImprove.map((area, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="text-yellow-500">⚠</span>
                  {area}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              Complete an interview to see improvement areas
            </p>
          )}
        </div>
      </div>

      {!data?.resume && (
        <EmptyState
          icon="📄"
          title="No Resume Uploaded"
          description="Upload your resume to get personalized interview questions based on your skills and experience."
          action={
            <button onClick={() => navigate('/resume')} className="btn-primary">
              Upload Resume
            </button>
          }
        />
      )}
    </div>
  );
};

export default Dashboard;
