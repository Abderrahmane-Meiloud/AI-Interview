import { useEffect, useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { resumeAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AIThinking from '../components/AIThinking';
import React from 'react';
import { UploadCloudIcon, FileTextIcon, FolderCodeIcon, BriefcaseIcon, GraduationCapIcon } from '../components/Icons';

const ANALYSIS_STEPS = [
  'Uploading your resume…',
  'Reading your resume…',
  'Understanding your experience…',
  'Extracting skills & projects…',
];

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const { data } = await resumeAPI.get();
      setResume(data);
    } catch {
      // No resume yet
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setProgress(0);

    try {
      const { data } = await resumeAPI.upload(formData, setProgress);
      setResume(data);
      toast.success('Resume uploaded and analyzed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Resume Upload</h1>
        <p className="text-sm text-ink-soft mt-1">
          Upload your resume for AI-powered analysis and personalized interviews
        </p>
      </div>

      <div className="card">
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg py-10 px-8 text-center cursor-pointer transition-colors ${
            uploading
              ? 'border-primary-300 bg-primary-50'
              : 'border-line hover:border-primary-400 hover:bg-app'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />

          {uploading ? (
            progress < 100 ? (
              <div className="space-y-4">
                <LoadingSpinner />
                <p className="text-sm text-ink-soft">Uploading your resume…</p>
                <div className="w-full max-w-xs mx-auto bg-line/60 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-ink-faint font-mono">{progress}% uploaded</p>
              </div>
            ) : (
              <AIThinking steps={ANALYSIS_STEPS} />
            )
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <UploadCloudIcon className="w-6 h-6 text-primary-600" />
              </div>
              <p className="text-ink font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-sm text-ink-faint mt-1">PDF or DOCX (max 5MB)</p>
            </>
          )}
        </div>
      </div>

      {resume && (
        <div className="space-y-5">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-ink">Extracted Information</h2>
              <span className="flex items-center gap-1.5 text-xs text-ink-faint font-mono">
                <FileTextIcon className="w-3.5 h-3.5" />
                {resume.fileName}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoSection title="Skills" items={resume.skills} />
              <InfoSection title="Programming Languages" items={resume.programmingLanguages} />
              <InfoSection title="Frameworks" items={resume.frameworks} />
              <InfoSection title="Certifications" items={resume.certifications} />
            </div>
          </div>

          {resume.projects?.length > 0 && (
            <div className="card">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                <FolderCodeIcon className="w-4 h-4 text-ink-faint" />
                Projects
              </h3>
              <div className="space-y-2.5">
                {resume.projects.map((project, i) => (
                  <div key={i} className="p-3.5 bg-app rounded-lg border border-line">
                    <p className="font-medium text-sm text-ink">{project.name}</p>
                    <p className="text-sm text-ink-soft mt-1">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {project.technologies.map((tech, j) => (
                          <span
                            key={j}
                            className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.experience?.length > 0 && (
            <div className="card">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                <BriefcaseIcon className="w-4 h-4 text-ink-faint" />
                Experience
              </h3>
              <div className="space-y-2.5">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="p-3.5 bg-app rounded-lg border border-line">
                    <p className="font-medium text-sm text-ink">{exp.role} at {exp.company}</p>
                    <p className="text-xs text-ink-faint font-mono mt-0.5">{exp.duration}</p>
                    <p className="text-sm text-ink-soft mt-1.5">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resume.education?.length > 0 && (
            <div className="card">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                <GraduationCapIcon className="w-4 h-4 text-ink-faint" />
                Education
              </h3>
              <div className="space-y-2">
                {resume.education.map((edu, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="font-medium text-ink">{edu.degree}</span>
                    <span className="text-ink-soft">{edu.institution} · {edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InfoSection = ({ title, items }) => {
  if (!items?.length) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-faint mb-2.5">{title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-xs bg-app text-ink-soft border border-line px-2.5 py-1 rounded-full"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumeUpload;
