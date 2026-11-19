import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-50/80',
      text: 'text-indigo-600',
      border: 'border-indigo-100'
    },
    sky: {
      bg: 'bg-sky-50/80',
      text: 'text-sky-600',
      border: 'border-sky-100'
    },
    amber: {
      bg: 'bg-amber-50/80',
      text: 'text-amber-600',
      border: 'border-amber-100'
    },
    emerald: {
      bg: 'bg-emerald-50/80',
      text: 'text-emerald-600',
      border: 'border-emerald-100'
    },
    rose: {
      bg: 'bg-rose-50/80',
      text: 'text-rose-600',
      border: 'border-rose-100'
    },
    slate: {
      bg: 'bg-slate-100',
      text: 'text-slate-600',
      border: 'border-slate-200'
    }
  };

  const currentTheme = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 font-medium">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;

