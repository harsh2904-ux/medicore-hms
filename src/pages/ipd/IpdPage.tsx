import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operationsService } from '../../services/operationsService';
import { InpatientAdmission } from '../../types/operations';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  BedDouble,
  Users,
  CheckCircle2,
  Clock,
  ArrowRightLeft,
  LogOut,
  Eye,
  Activity
} from 'lucide-react';

export const IpdPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [admissions, setAdmissions] = useState<InpatientAdmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAdmissions = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getAdmissions();
      setAdmissions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const handleDischarge = async (adm: InpatientAdmission) => {
    try {
      await operationsService.dischargePatient(adm.id);
      showToast(`Discharge summary generated for ${adm.patientName}. Bed freed for cleaning.`, 'success', 'Discharge Complete');
      fetchAdmissions();
    } catch {
      showToast('Discharge failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Inpatient Department (IPD)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Ward admissions, bed allocations, daily progress, and discharge workflows
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => navigate('/ipd/beds')}
            leftIcon={<BedDouble className="w-4 h-4 text-accent-primary" />}
          >
            Visual Bed Layout
          </Button>
        </div>
      </div>

      {/* IPD KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Current Inpatients"
          value="42"
          icon={<Users className="w-5 h-5 text-accent-primary" />}
          comparisonText="195 beds occupied"
          indicatorColor="primary"
        />
        <StatCard
          label="Discharges Today"
          value="8"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="5 pending summaries"
          indicatorColor="success"
        />
        <StatCard
          label="Bed Occupancy"
          value="78%"
          icon={<Activity className="w-5 h-5 text-status-info" />}
          comparisonText="Capacity 250"
          indicatorColor="primary"
        />
        <StatCard
          label="Average Stay (ALOS)"
          value="4.2d"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="NABH benchmark: 4.5d"
          indicatorColor="warning"
        />
      </div>

      {/* Current Admissions Table */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Active Ward Admissions</h2>
            <p className="text-xs text-text-muted">Inpatient ward registry and clinical attending team</p>
          </div>
          <span className="text-xs font-mono text-text-muted">{admissions.length} Inpatients</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Ward & Room</th>
                <th className="py-2.5 px-3">Admitting Doctor</th>
                <th className="py-2.5 px-3">Admit Date</th>
                <th className="py-2.5 px-3">Diagnosis</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {admissions.map(adm => (
                <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary text-sm">{adm.patientName}</div>
                    <div className="text-[10px] text-text-muted font-mono">{adm.mrn} • {adm.age}y {adm.gender}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono text-accent-primary font-medium">{adm.roomBed}</div>
                    <div className="text-[10px] text-text-muted">{adm.ward} ({adm.building})</div>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">{adm.admittingDoctor}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{adm.admissionDate}</td>
                  <td className="py-3 px-3 text-text-secondary max-w-xs truncate">{adm.diagnosis}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={adm.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => navigate(`/patients/${adm.patientId}`)}
                        title="View Patient 360"
                        className="p-1.5"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          showToast(`Transfer request initiated for ${adm.patientName}`, 'info');
                          navigate('/ipd/beds');
                        }}
                        leftIcon={<ArrowRightLeft className="w-3.5 h-3.5 text-accent-primary" />}
                        className="text-xs py-1"
                      >
                        Transfer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDischarge(adm)}
                        leftIcon={<LogOut className="w-3.5 h-3.5 text-status-warning" />}
                        className="text-xs py-1"
                      >
                        Discharge
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
