import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import toast from 'react-hot-toast';
import { dashboardAPI, interviewAPI } from '../services/api';
import { DashboardSkeleton } from '../components/Skeleton';
import ProgressBar from '../components/ProgressBar';
import ScoreCard from '../components/ScoreCard';
import EmptyState from '../components/EmptyState';
import AIThinking from '../components/AIThinking';
import ResumeSummary from '../components/ResumeSummary';
import { TargetIcon, WalletIcon, StarIcon, ClipboardListIcon, AlertTriangleIcon, UploadCloudIcon } from '../components/Icons';

const GENERATION_STEPS = [
  'Reviewing your job profile…',
  'Matching questions to your experience…',
  'Generating personalized questions…',
  'Finalizing your interview…',
];

const IN_PROGRESS_KEY = 'inProgressInterviewId';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inProgress, setInProgress] = useState(null);
  const [checkingInProgress, setCheckingInProgress] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboard();
    checkInProgressInterview();
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

  const checkInProgressInterview = async () => {
    const savedId = localStorage.getItem(IN_PROGRESS_KEY);
    if (!savedId) {
      setCheckingInProgress(false);
      return;
    }
    try {
      const { data: current } = await interviewAPI.getCurrent(savedId);
      setInProgress({ id: savedId, ...current });
    } catch {
      localStorage.removeItem(IN_PROGRESS_KEY);
    } finally {
      setCheckingInProgress(false);
    }
  };

  const openConfirm = () => {
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
    setShowConfirm(true);
  };

  const handleStartInterview = async () => {
    setStarting(true);
    try {
      const { data: interview } = await interviewAPI.start();
      localStorage.setItem(IN_PROGRESS_KEY, interview.interviewId);
      navigate(`/interview/${interview.interviewId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview');
      setStarting(false);
    }
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {data?.user?.name?.split(' ')[0]}
        </h1>
        <p className="text-sm text-ink-soft mt-1">Here&apos;s your interview preparation overview</p>
      </div>

      {!checkingInProgress && inProgress && (
        <div className="card border-primary-100 bg-primary-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary-800">
              You have an interview in progress
            </p>
            <p className="text-sm text-primary-700 mt-0.5">
              {data?.jobProfile?.jobRole ? `${data.jobProfile.jobRole} · ` : ''}
              Question {inProgress.questionNumber} of {inProgress.totalQuestions}
              {inProgress.answeredQuestions != null &&
                ` · ${inProgress.answeredQuestions} answered`}
            </p>
            <div className="mt-2 max-w-xs">
              <ProgressBar
                value={inProgress.questionNumber - 1}
                max={inProgress.totalQuestions}
                showValue={false}
                color="primary"
              />
            </div>
          </div>
          <button
            onClick={() => navigate(`/interview/${inProgress.id}`)}
            className="btn-primary px-5 py-2.5 whitespace-nowrap"
          >
            Resume Interview
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ScoreCard
          title="Target Role"
          score={data?.jobProfile?.jobRole || 'Not set'}
          icon={<TargetIcon className="w-[18px] h-[18px]" />}
        />
        <ScoreCard
          title="Target Package"
          score={data?.jobProfile?.expectedPackage || 'Not set'}
          icon={<WalletIcon className="w-[18px] h-[18px]" />}
        />
        <ScoreCard
          title="Latest Score"
          score={data?.latestScore}
          suffix="%"
          icon={<StarIcon className="w-[18px] h-[18px]" />}
          color={data?.latestScore >= 70 ? 'green' : 'yellow'}
        />
        <ScoreCard
          title="Total Interviews"
          score={data?.totalInterviews || 0}
          icon={<ClipboardListIcon className="w-[18px] h-[18px]" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold text-ink mb-4">Interview Readiness</h2>
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
          <p className="text-sm text-ink-soft mt-3">
            {data?.resumeStatus === 'uploaded'
              ? 'Resume uploaded ✓'
              : 'Upload your resume to get started'}
            {data?.jobProfile ? ' · Job profile set ✓' : ' · Set up job profile'}
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={openConfirm}
              disabled={starting || !!inProgress}
              className="btn-primary px-6 py-2.5"
            >
              {inProgress ? 'Finish current interview first' : 'Start New Interview'}
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
          <h2 className="text-base font-semibold text-ink mb-4">Areas to Improve</h2>
          {data?.areasToImprove?.length > 0 ? (
            <ul className="space-y-2.5">
              {data.areasToImprove.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                  <AlertTriangleIcon className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ink-faint">
              Complete an interview to see improvement areas
            </p>
          )}
        </div>
      </div>

      {!data?.resume && (
        <EmptyState
          icon={<UploadCloudIcon className="w-9 h-9 text-ink-faint" />}
          title="No Resume Uploaded"
          description="Upload your resume to get personalized interview questions based on your skills and experience."
          action={
            <button onClick={() => navigate('/resume')} className="btn-primary">
              Upload Resume
            </button>
          }
        />
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-ink/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-card shadow-card max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {starting ? (
              <div className="p-8">
                <AIThinking steps={GENERATION_STEPS} />
              </div>
            ) : (
              <div className="p-6 sm:p-8">
                <h2 className="font-display text-xl font-semibold text-ink">
                  Here&apos;s what we understood from your resume
                </h2>
                <p className="text-sm text-ink-soft mt-1 mb-6">
                  Your interview questions will be personalized using this information.
                </p>

                <ResumeSummary resume={data?.resume} />

                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-line">
                  <button onClick={handleStartInterview} className="btn-primary px-6 py-2.5">
                    Looks Good — Start Interview
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="btn-secondary px-6 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => navigate('/resume')}
                    className="text-sm text-primary-700 hover:underline px-2 py-2.5 ml-auto"
                  >
                    Edit Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
