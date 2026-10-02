import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-medium text-text-secondary flex items-center justify-between">
          <span>{label}</span>
          {props.required && <span className="text-status-danger text-xs">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        rows={rows}
        className={`w-full bg-[#0F131A] text-text-primary text-sm rounded-xl border p-3 transition-all duration-150 placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary/40 focus:border-accent-primary/80 disabled:opacity-50 resize-y ${
          error
            ? 'border-status-danger focus:ring-status-danger/30'
            : 'border-white/[0.1] hover:border-white/[0.2]'
        } ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-status-danger font-medium">{error}</span>}
      {!error && helperText && <span className="text-xs text-text-muted">{helperText}</span>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
