// src/components/common/StatCard.jsx - Dashboard Statistics Card
const StatCard = ({ title, value, icon, color = 'purple' }) => {
  const colorMap = {
    purple: 'from-purple-600 to-purple-800 border-purple-500',
    blue: 'from-blue-600 to-blue-800 border-blue-500',
    green: 'from-green-600 to-green-800 border-green-500',
    red: 'from-red-600 to-red-800 border-red-500',
    yellow: 'from-yellow-600 to-yellow-800 border-yellow-500',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border rounded-xl p-6 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-4xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};
export default StatCard;
