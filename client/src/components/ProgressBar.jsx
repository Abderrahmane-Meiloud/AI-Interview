const ProgressBar = ({ value, max = 100, color = 'primary', label, showValue = true }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const colors = {
    primary: 'bg-primary-600',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between mb-1.5">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showValue && (
            <span className="text-sm font-medium text-gray-600">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colors[color]} h-2.5 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
