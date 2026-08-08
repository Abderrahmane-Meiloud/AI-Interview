const ScoreCard = ({ title, score, icon, color = 'primary', suffix = '' }) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
  };

  const displayValue =
    score != null && score !== '' ? `${score}${suffix}` : '—';

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{displayValue}</p>
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        )}
      </div>
    </div>
  );
};

export default ScoreCard;
