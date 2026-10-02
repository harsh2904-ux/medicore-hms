import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const MediCoreLogo: React.FC<LogoProps> = ({ className = '', showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Icon: Modern medical plus cross with digital node / pulse motif */}
      <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary p-[1px] shadow-glow-primary shrink-0">
        <div className="w-full h-full rounded-xl bg-[#0A0D12] flex items-center justify-center relative overflow-hidden">
          <svg
            className="w-5 h-5 text-accent-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Medical Cross */}
            <path d="M12 5v14" />
            <path d="M5 12h14" />
            {/* Digital Node Center */}
            <circle cx="12" cy="12" r="2.2" fill="#7C5CFF" stroke="none" />
          </svg>
          <div className="absolute inset-0 bg-accent-primary/10 pointer-events-none" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-white font-sans">
              Medi<span className="text-accent-primary">Core</span>
            </span>
            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30">
              HMS
            </span>
          </div>
          <span className="text-[10px] text-text-muted font-medium tracking-wider uppercase">
            Hospital System
          </span>
        </div>
      )}
    </div>
  );
};
