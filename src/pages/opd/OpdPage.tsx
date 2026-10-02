import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { QueueItem } from '../../types/appointment';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import {
  Stethoscope,
  Users,
  Clock,
  CheckCircle2,
  CalendarDays,
  ArrowRight,
  Activity
} from 'lucide-react';

export const OpdPage: React.FC = () => {
  const navigate = useNavigate();
  const [opdQueue, setOpdQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const queue = await appointmentService.getQueue('OPD');
        setOpdQueue(queue);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Outpatient Department (OPD)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Active clinics, consult queues, and direct electronic physician desk
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => navigate('/opd/consultation/con-101')}
          leftIcon={<Stethoscope className="w-4 h-4" />}
        >
          Launch Doctor Desk
        </Button>
      </div>

      {/* OPD Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Today's OPD Patients"
          value="142"
          icon={<Users className="w-5 h-5 text-accent-primary" />}
          comparisonText="Across all clinics"
          indicatorColor="primary"
        />
        <StatCard
          label="Waiting in Queue"
          value="18"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="Avg wait 12 mins"
          indicatorColor="warning"
        />
        <StatCard
          label="In Consultation"
          value="6"
          icon={<Activity className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Active chambers"
          indicatorColor="secondary"
        />
        <StatCard
          label="Completed Today"
          value="118"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="83% fulfilled"
          indicatorColor="success"
        />
      </div>

      {/* OPD Live Queue Table */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Today&apos;s OPD Clinic Queue</h2>
            <p className="text-xs text-text-muted">Directly launch EHR consultation workstation per token</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/appointments')}>
            View Appointments
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Token</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Consulting Doctor</th>
                <th className="py-2.5 px-3">Room</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {opdQueue.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-accent-primary">
                    {item.token}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary">{item.patientName}</div>
                    <div className="text-[10px] text-text-muted">{item.patientMrn}</div>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">{item.doctorName}</td>
                  <td className="py-3 px-3 font-mono text-accent-secondary">{item.roomNumber}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{item.waitingTimeMinutes} mins</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/opd/consultation/${item.patientId}`)}
                      leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
                      className="py-1 text-xs"
                    >
                      Start Consultation
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
