import React from 'react';
import { StatusBadge } from './StatusBadge';
import { Stethoscope, FlaskConical, Scan, Pill, Receipt, Hospital, UserCheck } from 'lucide-react';

export interface TimelineItemData {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  category?: 'consultation' | 'lab' | 'radiology' | 'prescription' | 'billing' | 'admission' | 'discharge';
  doctorOrUser?: string;
  badge?: string;
}

interface TimelineProps {
  items: TimelineItemData[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({ items, className = '' }) => {
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'consultation':
        return <Stethoscope className="w-3.5 h-3.5 text-accent-primary" />;
      case 'lab':
        return <FlaskConical className="w-3.5 h-3.5 text-status-warning" />;
      case 'radiology':
        return <Scan className="w-3.5 h-3.5 text-status-info" />;
      case 'prescription':
        return <Pill className="w-3.5 h-3.5 text-accent-secondary" />;
      case 'billing':
        return <Receipt className="w-3.5 h-3.5 text-status-success" />;
      case 'admission':
      case 'discharge':
        return <Hospital className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <UserCheck className="w-3.5 h-3.5 text-text-muted" />;
    }
  };

  return (
    <div className={`relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.08] ${className}`}>
      {items.map((item) => (
        <div key={item.id} className="relative group">
          {/* Node icon dot */}
          <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-[#0F131A] border-2 border-accent-primary/60 flex items-center justify-center -translate-x-1/2 group-hover:border-accent-primary group-hover:scale-110 transition-transform">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary" />
          </div>

          {/* Content card */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-white/[0.05]">
                  {getCategoryIcon(item.category)}
                </span>
                <span className="text-xs font-semibold text-text-primary">{item.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-text-muted">
                <span>{item.date} {item.time && `• ${item.time}`}</span>
                {item.badge && <StatusBadge status={item.badge} size="sm" />}
              </div>
            </div>

            <p className="text-xs text-text-secondary leading-relaxed mt-1">
              {item.description}
            </p>

            {item.doctorOrUser && (
              <div className="mt-2 text-[11px] text-text-muted flex items-center gap-1 font-mono">
                <span>Attending:</span>
                <span className="text-text-secondary">{item.doctorOrUser}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
