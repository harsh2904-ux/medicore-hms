import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { Bed, BedStatus } from '../../types/operations';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../context/NotificationContext';
import { BedSanitizationModal } from '../../components/ipd/BedSanitizationModal';
import {
  BedDouble,
  Building,
  CheckCircle2,
  Sparkles,
  Wrench,
  Lock,
  User,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

export const BedsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [beds, setBeds] = useState<Bed[]>([]);
  const [buildingFilter, setBuildingFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBed, setSelectedBed] = useState<Bed | null>(null);
  const [sanitizingBed, setSanitizingBed] = useState<Bed | null>(null);
  const [isSanitizingModalOpen, setIsSanitizingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBeds = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getBeds({
        building: buildingFilter,
        category: categoryFilter,
        status: statusFilter,
      });
      setBeds(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, [buildingFilter, categoryFilter, statusFilter]);

  const handleUpdateStatus = async (bedId: string, status: BedStatus) => {
    try {
      await operationsService.updateBedStatus(bedId, status);
      showToast(`Bed status updated to ${status}`, 'success');
      setSelectedBed(null);
      fetchBeds();
    } catch {
      showToast('Failed to update bed status', 'error');
    }
  };

  const getStatusIcon = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return <CheckCircle2 className="w-4 h-4 text-status-success" />;
      case 'Occupied':
        return <User className="w-4 h-4 text-accent-primary" />;
      case 'Cleaning':
        return <Sparkles className="w-4 h-4 text-status-warning" />;
      case 'Sanitization Needed':
        return <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />;
      case 'Maintenance':
        return <Wrench className="w-4 h-4 text-status-danger" />;
      case 'Reserved':
        return <Lock className="w-4 h-4 text-purple-400" />;
    }
  };

  const statusBorderColor = (status: BedStatus) => {
    switch (status) {
      case 'Available':
        return 'border-status-success/30 hover:border-status-success/60';
      case 'Occupied':
        return 'border-accent-primary/40 hover:border-accent-primary/70';
      case 'Cleaning':
        return 'border-status-warning/40 hover:border-status-warning/70';
      case 'Sanitization Needed':
        return 'border-amber-400/50 hover:border-amber-400/80 bg-amber-500/[0.03]';
      case 'Maintenance':
        return 'border-status-danger/40 hover:border-status-danger/70';
      case 'Reserved':
        return 'border-purple-400/40 hover:border-purple-400/70';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Visual Bed & Ward Management
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Real-time multi-tower inpatient bed layout, occupancy, and sterilization tracker
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-text-muted flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-status-success" /> Available</span>
          <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-accent-primary" /> Occupied</span>
          <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Sanitization Needed</span>
          <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-status-warning" /> Cleaning</span>
          <span className="flex items-center gap-1.5 ml-2"><span className="w-2.5 h-2.5 rounded-full bg-status-danger" /> Maintenance</span>
        </div>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Select
            options={[
              { value: 'All', label: 'All Buildings' },
              { value: 'Tower A', label: 'Tower A (Main)' },
              { value: 'Tower B', label: 'Tower B (Wards)' },
            ]}
            value={buildingFilter}
            onChange={e => setBuildingFilter(e.target.value)}
            className="py-1 text-xs min-w-[140px]"
          />

          <Select
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'ICU', label: 'ICU / Critical Care' },
              { value: 'General', label: 'General Ward' },
              { value: 'Private', label: 'Private Suite' },
              { value: 'Emergency', label: 'Emergency Bays' },
            ]}
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="py-1 text-xs min-w-[150px]"
          />

          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Available', label: 'Available' },
              { value: 'Occupied', label: 'Occupied' },
              { value: 'Sanitization Needed', label: 'Sanitization Needed' },
              { value: 'Cleaning', label: 'Cleaning In Progress' },
              { value: 'Reserved', label: 'Reserved' },
              { value: 'Maintenance', label: 'Maintenance' },
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1 text-xs min-w-[160px]"
          />
        </div>

        <span className="text-xs font-mono text-text-muted">
          Showing {beds.length} Total Units
        </span>
      </GlassCard>

      {/* Beds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {beds.map(bed => (
          <GlassCard
            key={bed.id}
            onClick={() => setSelectedBed(bed)}
            className={`p-4 cursor-pointer transition-all border ${statusBorderColor(bed.status)} relative group`}
          >
            {/* Top row: Bed # and Category badge */}
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                {bed.bedNumber}
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-text-secondary">
                {bed.category}
              </span>
            </div>

            {/* Location hierarchy */}
            <div className="text-xs text-text-muted space-y-0.5 mb-3">
              <div className="text-text-secondary font-medium">{bed.wardName}</div>
              <div className="text-[11px]">{bed.building} • {bed.floor} • {bed.roomNumber}</div>
            </div>

            {/* Occupant or status detail */}
            <div className="p-2.5 rounded-xl bg-white/[0.025] border border-white/[0.04] text-xs">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-text-muted">Status:</span>
                <div className="flex items-center gap-1 font-semibold">
                  {getStatusIcon(bed.status)}
                  <span>{bed.status}</span>
                </div>
              </div>

              {bed.currentPatientName ? (
                <div className="mt-1 pt-1 border-t border-white/[0.04]">
                  <div className="font-semibold text-text-primary truncate">{bed.currentPatientName}</div>
                  <div className="text-[10px] text-accent-primary font-mono">{bed.currentPatientMrn}</div>
                </div>
              ) : (
                <div className="text-[11px] text-text-muted mt-1">
                  ₹{bed.dailyRate.toLocaleString()} / day
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Bed Action Modal */}
      {selectedBed && (
        <Modal
          isOpen={!!selectedBed}
          onClose={() => setSelectedBed(null)}
          title={`Bed Operations: ${selectedBed.bedNumber}`}
          subtitle={`${selectedBed.wardName} • ${selectedBed.building}, ${selectedBed.floor}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Current Status:</span>
                <StatusBadge status={selectedBed.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Category:</span>
                <span className="text-text-primary font-semibold">{selectedBed.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-muted">Daily Rate:</span>
                <span className="font-mono text-status-success font-semibold">₹{selectedBed.dailyRate} / day</span>
              </div>
              {selectedBed.currentPatientName && (
                <div className="pt-2 border-t border-white/[0.06] text-xs">
                  <span className="text-text-muted block">Occupant:</span>
                  <div className="font-bold text-text-primary text-sm mt-0.5">{selectedBed.currentPatientName}</div>
                  <div className="font-mono text-[11px] text-accent-primary">{selectedBed.currentPatientMrn}</div>
                  <div className="text-text-secondary mt-1">Doctor: {selectedBed.attendingDoctor}</div>
                </div>
              )}
            </div>

            {/* Quick status change buttons */}
            <div>
              <span className="text-xs font-semibold text-text-secondary block mb-2">Hospital Bed Workflow Actions</span>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBed.id, 'Available')}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-status-success" />}
                >
                  Mark Available
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBed.id, 'Sanitization Needed')}
                  leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                >
                  Needs Sanitization
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSanitizingBed(selectedBed);
                    setIsSanitizingModalOpen(true);
                    setSelectedBed(null);
                  }}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                  className="col-span-2"
                >
                  Open NABH Sterilization Checklist
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBed.id, 'Maintenance')}
                  leftIcon={<Wrench className="w-3.5 h-3.5 text-status-danger" />}
                >
                  Under Maintenance
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedBed.id, 'Reserved')}
                  leftIcon={<Lock className="w-3.5 h-3.5 text-purple-400" />}
                >
                  Mark Reserved
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Terminal Sanitization & Housekeeping Checklist Modal */}
      <BedSanitizationModal
        isOpen={isSanitizingModalOpen}
        onClose={() => {
          setIsSanitizingModalOpen(false);
          setSanitizingBed(null);
        }}
        bed={sanitizingBed}
        onCompleteSanitization={async (bedId, housekeeperName) => {
          await operationsService.updateBedStatus(bedId, 'Available');
          showToast(`Bed sterilized and cleared by ${housekeeperName}. Marked Available!`, 'success', 'Nurse Clearance Complete');
          fetchBeds();
        }}
      />
    </div>
  );
};
