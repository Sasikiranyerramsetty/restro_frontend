import React from 'react';

export const toneTokens = {
  sky: {
    bg: 'bg-sky-50',
    text: 'text-sky-600',
    chip: 'bg-sky-100 text-sky-700',
    border: 'border-sky-100'
  },
  rose: {
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    chip: 'bg-rose-100 text-rose-700',
    border: 'border-rose-100'
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    chip: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100'
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    chip: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-100'
  },
  indigo: {
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
    chip: 'bg-indigo-100 text-indigo-700',
    border: 'border-indigo-100'
  }
};

export const GlassCard = ({ as: Component = 'div', className = '', children }) => (
  <Component className={`rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 ${className}`}>
    {children}
  </Component>
);

export const SectionHeading = ({ title, description, actionLabel, onAction }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
    {actionLabel && (
      <button
        type="button"
        onClick={onAction}
        className="text-sm font-medium text-indigo-600 inline-flex items-center gap-1 dark:text-indigo-300"
      >
        {actionLabel}
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )}
  </div>
);

export const StatChip = ({ tone = 'sky', children }) => {
  const toneDef = toneTokens[tone] || toneTokens.sky;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${toneDef.chip}`}>
      {children}
    </span>
  );
};

export const MetricTile = ({ label, value, delta, icon: Icon, tone = 'sky' }) => {
  const toneDef = toneTokens[tone] || {};
  return (
    <GlassCard className={`p-4 ${toneDef.border || ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        {delta && <StatChip tone={tone}>{delta}</StatChip>}
      </div>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        {Icon && (
          <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${toneDef.bg || 'bg-slate-100'} ${toneDef.text || 'text-slate-600'} dark:bg-slate-800/70`}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </GlassCard>
  );
};

export const EmptyState = ({ title, description }) => (
  <GlassCard className="text-center">
    <p className="text-xl font-semibold text-slate-900 dark:text-white">{title}</p>
    {description && <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
  </GlassCard>
);

