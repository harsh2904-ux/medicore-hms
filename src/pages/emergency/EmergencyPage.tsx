import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clinicalService } from '../../services/clinicalService';
import { EmergencyPatient } from '../../types/clinical';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  Siren,
  Activity,
  Heart,
  UserPlus,
  Stethoscope,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [erPatients, setErPatients] = useState<EmergencyPatient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEr = async () => {
    setIsLoading(true);
    try {
      const data = await clinicalService.getEmergencyPatients();
      setErPatients(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEr();
  }, []);

  const handleUpdateTriage = async (id: string, level: EmergencyPatient['triageLevel']) => {
    try {
      await clinicalService.updateEmergencyTriage(id, level);
      showToast(`Triage level updated to ${level}`, 'info');
      fetchEr();
    } catch {
      showToast('Update failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
              Emergency & Trauma Resuscitation Center
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-status-danger/15 text-status-danger text-xs font-bold border border-status-danger/30">
              <span className="w-2 h-2 rounded-full bg-status-danger animate-ping" />
              LIVE ER
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Manchester triage scoring, rapid trauma intake, and resuscitative care tracking
          </p>
        </div>

        <Button
          variant="danger"
          onClick={() => navigate('/patients/new')}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Fast-Track ER Intake
        </Button>
      </div>

      {/* Emergency KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Active In Trauma Bays"
          value="4"
          icon={<Siren className="w-5 h-5 text-status-danger" />}
          comparisonText="2 Critical, 2 Urgent"
          indicatorColor="danger"
        />
        <StatCard
          label="Triage Response Time"
          value="< 3 mins"
          icon={<Flame className="w-5 h-5 text-status-warning" />}
          comparisonText="National target < 5 mins"
          indicatorColor="warning"
        />
        <StatCard
          label="On-Call Intensivists"
          value="3"
          icon={<Activity className="w-5 h-5 text-accent-primary" />}
          comparisonText="Trauma team primed"
          indicatorColor="primary"
        />
        <StatCard
          label="Beds Available"
          value="6 / 12"
          icon={<Heart className="w-5 h-5 text-status-success" />}
          comparisonText="Bay 4-8 vacant"
          indicatorColor="success"
        />
      </div>

      {/* Active Triage Board */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Emergency Triage Board</h2>
            <p className="text-xs text-text-muted">Color-coded urgency classification and clinical vital parameters</p>
          </div>
          <span className="text-xs font-mono text-text-muted">{erPatients.length} Active Cases</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {erPatients.map(er => {
            const isCritical = er.triageLevel === 'Critical';
            const isUrgent = er.triageLevel === 'Urgent';

            return (
              <div
                key={er.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-status-danger/[0.04] border-status-danger/40 shadow-glass-sm'
                    : isUrgent
                    ? 'bg-status-warning/[0.04] border-status-warning/40 shadow-glass-sm'
                    : 'bg-white/[0.03] border-white/[0.08]'
                }`}
              >
                {/* Header: Bay # and Triage Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-white/[0.06] text-text-primary">
                    {er.bayNumber}
                  </span>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={isCritical ? 'danger' : isUrgent ? 'warning' : 'success'}
                      size="md"
                      className="font-bold uppercase tracking-wider"
                    >
                      {er.triageLevel}
                    </Badge>
                    <StatusBadge status={er.status} size="sm" />
                  </div>
                </div>

                {/* Patient Info */}
                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-text-primary">{er.patientName}</h3>
                    <span className="text-xs text-text-muted font-mono">{er.arrivalTime}</span>
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    {er.mrn} • {er.age}y {er.gender}
                  </div>
                </div>

                {/* Chief Complaint */}
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-3 text-xs">
                  <span className="text-text-muted block text-[10px] uppercase font-bold tracking-wider">
                    Presenting Complaint:
                  </span>
                  <p className="text-text-secondary mt-0.5 font-medium leading-relaxed">
                    {er.chiefComplaint}
                  </p>
                </div>

                {/* Vitals Snapshot */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs mb-4">
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-[10px] text-text-muted block">BP</span>
                    <span className="font-mono font-bold text-text-primary">
                      {er.vitals.bloodPressureSystolic}/{er.vitals.bloodPressureDiastolic}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-[10px] text-text-muted block">Pulse</span>
                    <span className="font-mono font-bold text-text-primary">
                      {er.vitals.pulseRate} bpm
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-[10px] text-text-muted block">SpO2</span>
                    <span className={`font-mono font-bold ${er.vitals.spO2 < 95 ? 'text-status-danger' : 'text-text-primary'}`}>
                      {er.vitals.spO2}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04]">
                    <span className="text-[10px] text-text-muted block">Temp</span>
                    <span className="font-mono font-bold text-text-primary">
                      {er.vitals.temperature}°F
                    </span>
                  </div>
                </div>

                {/* Attending & Actions */}
                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs text-text-muted">
                    Attending: <strong className="text-text-primary">{er.assignedDoctor}</strong>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => navigate(`/opd/consultation/${er.patientId}`)}
                      leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
                    >
                      Open ER Chart
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
