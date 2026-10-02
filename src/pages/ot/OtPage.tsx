import React, { useState, useEffect } from 'react';
import { clinicalService } from '../../services/clinicalService';
import { OperationRecord } from '../../types/clinical';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  Scissors,
  CheckCircle2,
  Clock,
  UserCheck,
  CalendarDays,
  AlertCircle
} from 'lucide-react';

export const OtPage: React.FC = () => {
  const { showToast } = useNotification();
  const [operations, setOperations] = useState<OperationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOt = async () => {
    setIsLoading(true);
    try {
      const data = await clinicalService.getOperations();
      setOperations(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOt();
  }, []);

  const handleUpdateStatus = async (id: string, status: OperationRecord['status']) => {
    try {
      await clinicalService.updateOperationStatus(id, status);
      showToast(`Surgery status updated to ${status}`, 'success');
      fetchOt();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Operation Theatre (OT) Complex
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Surgical suite scheduling, sterile team rosters, pre-anesthetic clearance, and intra-operative logs
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => showToast('New OT booking slot opened', 'info')}
          leftIcon={<CalendarDays className="w-4 h-4" />}
        >
          Book OT Suite
        </Button>
      </div>

      {/* OT KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Active Suites"
          value="4 / 6"
          icon={<Scissors className="w-5 h-5 text-accent-primary" />}
          comparisonText="2 in sterilization"
          indicatorColor="primary"
        />
        <StatCard
          label="Scheduled Today"
          value="8 Surgeries"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="Major & Minor cases"
          indicatorColor="warning"
        />
        <StatCard
          label="In Progress Now"
          value="2"
          icon={<UserCheck className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Neuro & Cardiac OTs"
          indicatorColor="secondary"
        />
        <StatCard
          label="Completed Today"
          value="4 Cases"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="Uneventful recovery"
          indicatorColor="success"
        />
      </div>

      {/* OT Schedule Cards */}
      <div className="space-y-4">
        {operations.map(op => (
          <GlassCard key={op.id} className="p-5 border-white/[0.08] hover:border-white/[0.14] space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30">
                  {op.otNumber}
                </span>
                <div>
                  <h3 className="text-base font-bold text-text-primary">{op.procedureName}</h3>
                  <div className="text-xs text-text-muted">
                    Patient: <strong className="text-text-primary">{op.patientName}</strong> ({op.mrn})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={op.preOpChecklistComplete ? 'success' : 'warning'} size="sm">
                  {op.preOpChecklistComplete ? 'Pre-Op Checklist OK' : 'PAC Clearance Pending'}
                </Badge>
                <StatusBadge status={op.status} size="sm" />
              </div>
            </div>

            {/* Surgical Team Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] text-xs">
              <div>
                <span className="text-text-muted block">Lead Surgeon:</span>
                <span className="font-semibold text-text-primary">{op.leadSurgeon}</span>
              </div>
              <div>
                <span className="text-text-muted block">Anesthetist:</span>
                <span className="font-semibold text-text-primary">{op.anesthetist}</span>
              </div>
              <div>
                <span className="text-text-muted block">Scrub Nurse:</span>
                <span className="font-semibold text-text-primary">{op.scrubNurse}</span>
              </div>
            </div>

            {/* Timing & Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-xs flex-wrap gap-2">
              <div className="flex items-center gap-4 text-text-muted font-mono">
                <span>Date: {op.scheduledDate}</span>
                <span>Time: {op.scheduledTime}</span>
                <span>Est: {op.durationEstMinutes} Mins</span>
              </div>

              <div className="flex items-center gap-2">
                {op.status === 'Scheduled' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleUpdateStatus(op.id, 'In Progress')}
                    className="py-1 text-xs"
                  >
                    Start Surgery
                  </Button>
                )}
                {op.status === 'In Progress' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleUpdateStatus(op.id, 'Post-Op Recovery')}
                    className="py-1 text-xs"
                  >
                    Send to PACU Recovery
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
