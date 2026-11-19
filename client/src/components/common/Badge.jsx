import React from 'react';

const Badge = ({ type = 'status', value, size = 'md' }) => {
  const getBadgeStyle = () => {
    const val = (value || '').toLowerCase();

    if (type === 'priority') {
      switch (val) {
        case 'urgent':
          return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
        case 'high':
          return 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20';
        case 'medium':
          return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
        case 'low':
          return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
        default:
          return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
      }
    }

    switch (val) {
      case 'open':
        return 'bg-sky-50 text-sky-700 border-sky-200 ring-sky-500/20';
      case 'in progress':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
      case 'resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
      case 'closed':
        return 'bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/20';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-500/20';
    }
  };

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ring-1 ring-inset tracking-wide ${sizeClasses} ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {value}
    </span>
  );
};

export default Badge;

