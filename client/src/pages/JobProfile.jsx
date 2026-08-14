import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobProfileAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import React from 'react';
import { BriefcaseIcon, TrendingUpIcon, WalletIcon, CheckCircleIcon, ChevronDownIcon } from '../components/Icons';

const experienceLevels = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'];

const effects = [
  'Questions tailored to your target role and technologies',
  'Difficulty adjusted based on experience level',
  'DSA questions scaled to package expectations',
  'Previous weaknesses prioritized in future interviews',
];

const JobProfile = () => {
  const [profile, setProfile] = useState({
    jobRole: '',
    experienceLevel: 'Fresher',
    expectedPackage: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await jobProfileAPI.get();
      setProfile({
        jobRole: data.jobRole,
        experienceLevel: data.experienceLevel,
        expectedPackage: data.expectedPackage,
      });
    } catch {
      // No profile yet
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await jobProfileAPI.create(profile);
      setProfile({
        jobRole: data.jobRole,
        experienceLevel: data.experienceLevel,
        expectedPackage: data.expectedPackage,
      });
      toast.success('Job profile saved!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Job Profile Setup</h1>
        <p className="text-sm text-ink-soft mt-1">
          Configure your target job to get personalized interview questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Job Role</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
              <BriefcaseIcon className="w-[18px] h-[18px]" />
            </div>
            <input
              type="text"
              value={profile.jobRole}
              onChange={(e) => setProfile({ ...profile, jobRole: e.target.value })}
              className="input-field pl-10"
              placeholder="e.g. Full Stack Developer"
              required
            />
          </div>
        </div>

        <div>
          <label className="label">Experience Level</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
              <TrendingUpIcon className="w-[18px] h-[18px]" />
            </div>
            <select
              value={profile.experienceLevel}
              onChange={(e) =>
                setProfile({ ...profile, experienceLevel: e.target.value })
              }
              className="input-field pl-10 pr-10 appearance-none"
            >
              {experienceLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-ink-faint">
              <ChevronDownIcon className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div>
          <label className="label">Expected Package</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-faint">
              <WalletIcon className="w-[18px] h-[18px]" />
            </div>
            <input
              type="text"
              value={profile.expectedPackage}
              onChange={(e) =>
                setProfile({ ...profile, expectedPackage: e.target.value })
              }
              className="input-field pl-10"
              placeholder="e.g. ₹10 LPA"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3">
          {saving ? 'Saving...' : 'Save Job Profile'}
        </button>
      </form>

      <div className="card bg-primary-50 border-primary-100">
        <h3 className="text-sm font-semibold text-primary-800 mb-3">How this affects your interview</h3>
        <ul className="space-y-2">
          {effects.map((effect) => (
            <li key={effect} className="flex items-start gap-2 text-sm text-primary-700">
              <CheckCircleIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{effect}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default JobProfile;
