import React from 'react';

const Chips = ({ items }) => (
  <div className="flex flex-wrap gap-1.5">
    {items.map((item, i) => (
      <span
        key={i}
        className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
      >
        {item}
      </span>
    ))}
  </div>
);

const Field = ({ title, items }) => {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <Chips items={items} />
    </div>
  );
};

const ResumeSummary = ({ resume }) => {
  if (!resume) return null;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field title="Skills" items={resume.skills} />
        <Field title="Programming Languages" items={resume.programmingLanguages} />
        <Field title="Frameworks" items={resume.frameworks} />
        <Field title="Certifications" items={resume.certifications} />
      </div>

      {resume.projects?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Projects</h4>
          <div className="space-y-2">
            {resume.projects.map((project, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">{project.name}</p>
                {project.description && (
                  <p className="text-xs text-gray-600 mt-1">{project.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {resume.experience?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience</h4>
          <div className="space-y-2">
            {resume.experience.map((exp, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-sm">
                  {exp.role} {exp.company ? `at ${exp.company}` : ''}
                </p>
                {exp.duration && <p className="text-xs text-gray-500">{exp.duration}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeSummary;
