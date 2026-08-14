import { useEffect, useState } from 'react';
import React from 'react';

const AIThinking = ({ steps, stepDuration = 1400 }) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
    if (steps.length <= 1) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, stepDuration);

    return () => clearInterval(interval);
  }, [steps, stepDuration]);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600 mb-5" />
      <p className="text-gray-800 font-medium">{steps[stepIndex]}</p>
      <div className="flex gap-1.5 mt-4">
        {steps.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= stepIndex ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AIThinking;
