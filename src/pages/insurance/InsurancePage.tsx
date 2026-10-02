import React, { useState, useEffect } from 'react';
import { billingService } from '../../services/billingService';
import { InsuranceClaim } from '../../types/billing';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../context/NotificationContext';
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  IndianRupee
} from 'lucide-react';

export const InsurancePage: React.FC = () => {
  const { showToast } = useNotification();
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      const data = await billingService.getInsuranceClaims(statusFilter);
      setClaims(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const handleApproveClaim = async (id: string, requestedAmount: number) => {
    try {
      await billingService.updateClaimStatus(id, 'Approved', requestedAmount);
      showToast('Insurance cashless claim marked as approved', 'success');
      fetchClaims();
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
            Insurance & Third Party Administrator (TPA) Desk
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Cashless pre-authorizations, query resolutions, IRDAI claim tracking, and settlements
          </p>
        </div>
      </div>

      {/* Claims KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Active Claims"
          value="18"
          icon={<ShieldCheck className="w-5 h-5 text-accent-primary" />}
          comparisonText="Incurred this month"
          indicatorColor="primary"
        />
        <StatCard
          label="Under Review"
          value="4"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="TPA query response due"
          indicatorColor="warning"
        />
        <StatCard
          label="Approved Rate"
          value="94.2%"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="Cashless clearance"
          indicatorColor="success"
        />
        <StatCard
          label="Total Settled (₹)"
          value="₹ 14.8L"
          icon={<IndianRupee className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Received in bank"
          indicatorColor="secondary"
        />
      </div>

      {/* Claims Table */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Insurance Claims Tracker</h2>
            <p className="text-xs text-text-muted">Individual patient coverage breakdown and cashless pre-authorization</p>
          </div>

          <Select
            options={[
              { value: 'All', label: 'All Claim Statuses' },
              { value: 'Under Review', label: 'Under Review' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Settled', label: 'Settled' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1 text-xs min-w-[150px]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Claim ID</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Insurance Provider & TPA</th>
                <th className="py-2.5 px-3">Policy Number</th>
                <th className="py-2.5 px-3">Claim Amount</th>
                <th className="py-2.5 px-3">Approved Amount</th>
                <th className="py-2.5 px-3">Pre-Auth</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {claims.map(c => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary text-sm">{c.patientName}</div>
                    <div className="text-[10px] text-text-muted font-mono">{c.mrn}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-text-primary">{c.insuranceProvider}</div>
                    <div className="text-[10px] text-text-muted">{c.tpaName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono text-text-secondary">{c.policyNumber}</td>
                  <td className="py-3 px-3 font-mono font-bold text-text-primary">
                    ₹{c.claimAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-status-success">
                    {c.approvedAmount ? `₹${c.approvedAmount.toLocaleString()}` : '—'}
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={c.preAuthStatus === 'Approved' ? 'success' : 'warning'} size="sm">
                      {c.preAuthStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    {c.status === 'Under Review' ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleApproveClaim(c.id, c.claimAmount)}
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        className="py-1 text-xs"
                      >
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showToast(`Claim dossier ${c.id} generated`, 'info')}
                        leftIcon={<FileText className="w-3.5 h-3.5" />}
                        className="py-1 text-xs"
                      >
                        Dossier
                      </Button>
                    )}
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
