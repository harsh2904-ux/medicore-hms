import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService } from '../../services/appointmentService';
import { QueueItem } from '../../types/appointment';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useNotification } from '../../context/NotificationContext';
import {
  Megaphone,
  Stethoscope,
  SkipForward,
  CheckCircle2,
  Clock,
  AlertCircle,
  Tv
} from 'lucide-react';

export const QueuePage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [activeCategory, setActiveCategory] = useState<'All' | 'OPD' | 'Emergency' | 'Lab' | 'Radiology'>('All');
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const data = await appointmentService.getQueue(activeCategory);
      setQueueItems(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [activeCategory]);

  const handleCallPatient = async (item: QueueItem) => {
    try {
      await appointmentService.callNextPatient(item.id);
      showToast(`Calling Token ${item.token}: ${item.patientName} to ${item.roomNumber}`, 'info', 'Patient Paged');
      fetchQueue();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleSkip = async (id: string) => {
    try {
      await appointmentService.updateQueueStatus(id, 'Skipped');
      showToast('Patient marked as skipped', 'warning');
      fetchQueue();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await appointmentService.updateQueueStatus(id, 'Completed');
      showToast('Encounter marked as completed', 'success');
      fetchQueue();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const tabs = [
    { id: 'All', label: 'All Queues', badge: queueItems.length },
    { id: 'OPD', label: 'OPD Clinics' },
    { id: 'Emergency', label: 'Emergency (ER)' },
    { id: 'Lab', label: 'Central Lab Phlebotomy' },
    { id: 'Radiology', label: 'Radiology Scans' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Real-Time Hospital Queue
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Active token paging, turnaround times, and departmental flow management
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open('/display/opd', '_blank')}
            leftIcon={<Tv className="w-3.5 h-3.5 text-purple-400" />}
          >
            Open Waiting Room TV Board
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={fetchQueue}
            leftIcon={<Clock className="w-3.5 h-3.5 text-accent-primary" />}
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeCategory} onChange={(id) => setActiveCategory(id as any)} />

      {/* Queue Table */}
      <GlassCard className="p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase tracking-wider">
                <th className="py-3 px-3">Token #</th>
                <th className="py-3 px-3">Patient</th>
                <th className="py-3 px-3">Doctor / Room</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Wait Time</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {queueItems.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  {/* Token */}
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-sm font-bold text-accent-primary bg-accent-primary/10 px-2.5 py-1 rounded-xl border border-accent-primary/20">
                      {item.token}
                    </span>
                  </td>

                  {/* Patient */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-text-primary text-sm">{item.patientName}</div>
                    <div className="text-[11px] text-text-muted font-mono">{item.patientMrn}</div>
                  </td>

                  {/* Doctor & Room */}
                  <td className="py-3.5 px-3">
                    <div className="text-text-primary font-medium">{item.doctorName}</div>
                    <div className="text-[11px] text-accent-secondary">{item.roomNumber}</div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-3">
                    <span className="font-medium text-text-secondary">{item.category}</span>
                  </td>

                  {/* Wait Time */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className={item.waitingTimeMinutes > 20 ? 'text-status-danger font-semibold' : 'text-text-muted'}>
                      {item.waitingTimeMinutes} mins
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3.5 px-3">
                    <Badge
                      variant={
                        item.priority === 'Emergency'
                          ? 'danger'
                          : item.priority === 'Urgent'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.priority === 'Emergency' && <AlertCircle className="w-3 h-3 mr-1" />}
                      {item.priority}
                    </Badge>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <StatusBadge status={item.status} size="sm" />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleCallPatient(item)}
                        leftIcon={<Megaphone className="w-3.5 h-3.5 text-accent-primary" />}
                        className="py-1 text-xs"
                      >
                        Call
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => navigate(`/opd/consultation/${item.patientId}`)}
                        leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
                        className="py-1 text-xs"
                      >
                        Consult
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSkip(item.id)}
                        title="Skip patient"
                        className="p-1.5"
                      >
                        <SkipForward className="w-3.5 h-3.5" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleComplete(item.id)}
                        title="Complete encounter"
                        className="p-1.5 text-status-success hover:bg-status-success/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
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
