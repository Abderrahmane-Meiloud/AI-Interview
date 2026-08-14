const ProgressBar = ({ value, max = 100, color = 'primary', label, showValue = true }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colors = {
    primary: 'bg-primary-600',
    green: 'bg-success-500',
    yellow: 'bg-warning-500',
    red: 'bg-danger-500',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-ink-soft">{label}</span>}
          {showValue && (
            <span className="text-sm font-mono font-medium text-ink-soft">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
