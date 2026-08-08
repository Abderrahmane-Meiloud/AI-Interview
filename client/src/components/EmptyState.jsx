const EmptyState = ({ icon, title, description, action }) => (
  <div className="card text-center py-12">
    {icon && <div className="text-4xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    {description && (
      <p className="text-gray-500 mt-2 max-w-md mx-auto">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
