import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-text-secondary flex items-center justify-between">
          <span>{label}</span>
          {props.required && <span className="text-status-danger text-xs">*</span>}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-text-muted">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full bg-[#0F131A] text-text-primary text-sm rounded-xl border transition-all duration-150 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/80 disabled:opacity-50 disabled:cursor-not-allowed ${
            leftIcon ? 'pl-9' : 'pl-3.5'
          } ${rightIcon ? 'pr-9' : 'pr-3.5'} py-2 ${
            error
              ? 'border-status-danger focus:ring-status-danger/30'
              : 'border-white/[0.1] hover:border-white/[0.2]'
          } ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 flex items-center text-text-muted">
            {rightIcon}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-status-danger font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
    </div>
  );
});

Input.displayName = 'Input';
