import React from 'react';
import { GlassCard } from './GlassCard';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  comparisonText?: string;
  indicatorColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  comparisonText,
  indicatorColor = 'primary',
  className = '',
  onClick,
}) => {
  const indicatorClasses = {
    primary: 'bg-accent-primary shadow-glow-primary',
    secondary: 'bg-accent-secondary shadow-glow-secondary',
    success: 'bg-status-success',
    warning: 'bg-status-warning',
    danger: 'bg-status-danger',
  };

  return (
    <GlassCard
      onClick={onClick}
      className={`p-5 relative overflow-hidden group hover:border-white/[0.16] ${className}`}
    >
      {/* Top subtle colored edge accent */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] opacity-70 ${indicatorClasses[indicatorColor]}`}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-text-secondary tracking-wide uppercase">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight font-sans mt-0.5">
            {value}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-text-primary shrink-0 transition-transform group-hover:scale-105">
          {icon}
        </div>
      </div>

      {(trend || comparisonText) && (
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`flex items-center gap-1 font-semibold ${
                trend.isPositive ? 'text-status-success' : 'text-status-danger'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {trend.value}
            </span>
          )}
          {comparisonText && (
            <span className="text-text-muted text-[11px] truncate">
              {comparisonText}
            </span>
          )}
        </div>
      )}
    </GlassCard>
  );
};
