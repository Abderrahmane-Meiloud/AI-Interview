import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { jobProfileAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const experienceLevels = ['Fresher', 'Junior', 'Mid-Level', 'Senior', 'Lead'];

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Profile Setup</h1>
        <p className="text-gray-500 mt-1">
          Configure your target job to get personalized interview questions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5">
        <div>
          <label className="label">Job Role</label>
          <input
            type="text"
            value={profile.jobRole}
            onChange={(e) => setProfile({ ...profile, jobRole: e.target.value })}
            className="input-field"
            placeholder="e.g. Full Stack Developer"
            required
          />
        </div>

        <div>
          <label className="label">Experience Level</label>
          <select
            value={profile.experienceLevel}
            onChange={(e) =>
              setProfile({ ...profile, experienceLevel: e.target.value })
            }
            className="input-field"
          >
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">Expected Package</label>
          <input
            type="text"
            value={profile.expectedPackage}
            onChange={(e) =>
              setProfile({ ...profile, expectedPackage: e.target.value })
            }
            className="input-field"
            placeholder="e.g. ₹10 LPA"
            required
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary w-full py-3">
          {saving ? 'Saving...' : 'Save Job Profile'}
        </button>
      </form>

      <div className="card bg-primary-50 border-primary-200">
        <h3 className="font-medium text-primary-800 mb-2">How this affects your interview</h3>
        <ul className="text-sm text-primary-700 space-y-1">
          <li>• Questions tailored to your target role and technologies</li>
          <li>• Difficulty adjusted based on experience level</li>
          <li>• DSA questions scaled to package expectations</li>
          <li>• Previous weaknesses prioritized in future interviews</li>
        </ul>
      </div>
    </div>
  );
};

export default JobProfile;
