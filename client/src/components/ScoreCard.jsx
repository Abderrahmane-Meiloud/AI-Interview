const ScoreCard = ({ title, score, icon, color = 'primary', suffix = '' }) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    green: 'text-success-500 bg-success-50',
    yellow: 'text-warning-500 bg-warning-50',
    red: 'text-danger-500 bg-danger-50',
  };

  const displayValue =
    score != null && score !== '' ? `${score}${suffix}` : '—';

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-soft">{title}</p>
          <p className="text-2xl font-display font-semibold mt-1">{displayValue}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
