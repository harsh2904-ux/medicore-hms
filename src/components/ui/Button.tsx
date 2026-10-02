import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#05070A] disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
    icon: 'p-2 text-sm',
  };

  const variantClasses = {
    primary: 'bg-accent-primary hover:bg-[#4E7CE8] text-white font-semibold shadow-md shadow-accent-primary/25 border border-accent-primary/30 focus:ring-accent-primary/50',
    secondary: 'bg-white/[0.08] hover:bg-white/[0.12] text-text-primary border border-white/[0.1] focus:ring-white/20',
    outline: 'bg-transparent border border-white/[0.15] text-text-primary hover:bg-white/[0.06] hover:border-white/[0.25] focus:ring-white/20',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-white/[0.06] focus:ring-white/20',
    danger: 'bg-status-danger/90 hover:bg-status-danger text-white border border-status-danger/30 shadow-md shadow-status-danger/25 focus:ring-status-danger/50',
    success: 'bg-status-success/90 hover:bg-status-success text-black font-semibold border border-status-success/30 shadow-md shadow-status-success/25 focus:ring-status-success/50',
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          {size !== 'icon' && children}
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};
