import React from 'react';
import { Badge } from './Badge';

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '', size = 'sm' }) => {
  const normalized = status.toLowerCase();

  let variant: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'neutral' = 'neutral';
  let dotColor = 'bg-text-muted';

  if (['active', 'completed', 'paid', 'verified', 'available', 'successful', 'optimal', 'in stock', 'settled', 'on duty'].includes(normalized)) {
    variant = 'success';
    dotColor = 'bg-status-success';
  } else if (['in consultation', 'waiting', 'pending', 'under review', 'in progress', 'scheduled', 'confirmed', 'sample collected', 'awaiting verification', 'discharge pending', 'cleaning'].includes(normalized)) {
    variant = 'warning';
    dotColor = 'bg-status-warning';
  } else if (['critical', 'danger', 'stat', 'cancelled', 'no-show', 'overdue', 'rejected', 'out of stock', 'failed'].includes(normalized)) {
    variant = 'danger';
    dotColor = 'bg-status-danger';
  } else if (['inpatient', 'admitted', 'low stock', 'expiring', 'partially paid', 'reserved', 'on trip'].includes(normalized)) {
    variant = 'info';
    dotColor = 'bg-status-info';
  } else if (['first visit', 'follow-up', 'routine'].includes(normalized)) {
    variant = 'primary';
    dotColor = 'bg-accent-primary';
  }

  return (
    <Badge variant={variant} size={size} className={className}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status}</span>
    </Badge>
  );
};
