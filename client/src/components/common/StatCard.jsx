// src/components/common/StatCard.jsx - Dashboard Statistics Card
const StatCard = ({ title, value, icon, color = 'purple' }) => {
  const colorMap = {
    purple: 'from-indigo-500/5 to-violet-500/5 border-indigo-500/20',
    blue: 'from-blue-500/5 to-cyan-500/5 border-blue-500/20',
    green: 'from-emerald-500/5 to-teal-500/5 border-emerald-500/20',
    red: 'from-rose-500/5 to-red-500/5 border-rose-500/20',
    yellow: 'from-amber-500/5 to-orange-500/5 border-amber-500/20',
  };

  const bgIconMap = {
    purple: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <div className={`bg-zinc-900/50 bg-gradient-to-br ${colorMap[color]} backdrop-blur-sm border rounded-2xl p-6 transition-transform hover:-translate-y-1 hover:shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">{title}</p>
          <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl border ${bgIconMap[color]} shadow-inner`}>
          {icon}
        </div>
      </div>
    </div>
  );
};
export default StatCard;
