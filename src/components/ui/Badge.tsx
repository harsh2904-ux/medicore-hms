import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  const variantClasses = {
    primary: 'bg-accent-primary/15 text-accent-primary border border-accent-primary/30',
    secondary: 'bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30',
    success: 'bg-status-success/15 text-status-success border border-status-success/30',
    warning: 'bg-status-warning/15 text-status-warning border border-status-warning/30',
    danger: 'bg-status-danger/15 text-status-danger border border-status-danger/30',
    info: 'bg-status-info/15 text-status-info border border-status-info/30',
    neutral: 'bg-white/[0.06] text-text-secondary border border-white/[0.08]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
