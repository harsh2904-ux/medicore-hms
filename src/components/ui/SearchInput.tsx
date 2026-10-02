import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  shortcut?: string;
  className?: string;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  shortcut,
  className = '',
  value,
  onClear,
  ...props
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
      <input
        type="text"
        value={value}
        className="w-full bg-white/[0.04] text-text-primary text-sm rounded-xl pl-9 pr-12 py-1.5 border border-white/[0.08] hover:border-white/[0.15] focus:border-accent-primary/80 focus:bg-white/[0.07] focus:outline-none transition-all placeholder:text-text-muted"
        {...props}
      />
      {shortcut && !value && (
        <span className="absolute right-2.5 text-[10px] font-mono text-text-muted bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.08] pointer-events-none">
          {shortcut}
        </span>
      )}
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-2.5 text-text-muted hover:text-text-primary text-xs p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};
