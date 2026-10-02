import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'elevated' | 'glow';
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white/[0.045] backdrop-blur-xl border border-white/[0.08] shadow-glass hover:border-white/[0.12]',
    subtle: 'bg-white/[0.025] backdrop-blur-md border border-white/[0.05] shadow-glass-sm hover:border-white/[0.09]',
    elevated: 'bg-[#0F131A] border border-white/[0.09] shadow-2xl',
    glow: 'bg-white/[0.05] backdrop-blur-xl border border-accent-primary/30 shadow-glow-primary',
  };

  const interactiveClasses = onClick ? 'cursor-pointer hover:-translate-y-0.5' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${variantStyles[variant]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
