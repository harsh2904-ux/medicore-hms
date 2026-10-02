import React, { useState, useEffect } from 'react';
import { labService } from '../../services/labService';
import { LabOrder, LabResultReport } from '../../types/diagnostics';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../context/NotificationContext';
import {
  FlaskConical,
  CheckCircle2,
  FileCheck2,
  Clock,
  Printer,
  FileText,
  AlertTriangle,
  Microscope,
  Download
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { PrintLabReportModal, PrintableLabReportData } from '../../components/clinical/PrintLabReportModal';

export const LaboratoryPage: React.FC = () => {
  const { showToast } = useNotification();
  const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedReport, setSelectedReport] = useState<LabResultReport | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isPrintLabModalOpen, setIsPrintLabModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const printableData: PrintableLabReportData | null = selectedReport
    ? {
        orderId: selectedReport.orderId,
        testName: selectedReport.testName,
        specimenType: selectedReport.category || 'Blood Specimen',
        patientName: selectedReport.patientName,
        patientMrn: selectedReport.mrn,
        patientAge: selectedReport.age,
        patientGender: selectedReport.gender,
        orderedBy: 'Dr. Vikramaditya Rathore, MD',
        verifiedBy: selectedReport.verifiedBy || 'Dr. Kavita Joshi, MD (Pathology)',
        collectedAt: selectedReport.collectedAt,
        verifiedAt: selectedReport.reportedAt,
        parameters: selectedReport.parameters.map((p) => ({
          name: p.name,
          value: p.value,
          unit: p.unit,
          referenceRange: p.referenceRange,
          status: (p.flag.toUpperCase() as any) || 'NORMAL',
        })),
        clinicalRemarks: selectedReport.clinicalInterpretation,
      }
    : null;

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await labService.getLabOrders({
        category: categoryFilter,
        status: statusFilter,
      });
      setLabOrders(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [categoryFilter, statusFilter]);

  const handleOpenReport = async (orderId: string) => {
    try {
      const report = await labService.getLabResultReport(orderId);
      if (report) {
        setSelectedReport(report);
        setIsReportModalOpen(true);
      } else {
        showToast('Result report still in processing', 'info');
      }
    } catch {
      showToast('Failed to load report', 'error');
    }
  };

  const handleVerifyResult = async () => {
    if (!selectedReport) return;
    try {
      const updated = await labService.verifyLabResult(selectedReport.orderId, 'Dr. Kavita Joshi, MD (Pathology)');
      setSelectedReport({ ...updated });
      
      // Dispatch automated WhatsApp & SMS alert to patient
      await communicationService.sendLabReportAlert({
        patientName: selectedReport.patientName,
        phone: '+91 98765 43210',
        testName: selectedReport.testName,
        specimenId: selectedReport.orderId,
        doctorName: selectedReport.verifiedBy || 'Dr. Kavita Joshi, MD (Pathology)'
      });

      showToast('Lab result signed, verified & instant WhatsApp/SMS notification dispatched to patient!', 'success', 'Report Verified & Dispatched');
      fetchOrders();
    } catch {
      showToast('Verification failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Central Laboratory & Pathology
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Specimen tracking, automated analyzer feeds, reference intervals, and pathologist verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => handleOpenReport('LAB-2026-0891')}
            leftIcon={<FileCheck2 className="w-4 h-4" />}
          >
            Review Pending Batch
          </Button>
        </div>
      </div>

      {/* Lab Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <StatCard
          label="Total Orders"
          value="184"
          icon={<FlaskConical className="w-5 h-5 text-accent-primary" />}
          comparisonText="Today's workload"
          indicatorColor="primary"
        />
        <StatCard
          label="Samples Collected"
          value="152"
          icon={<Microscope className="w-5 h-5 text-status-info" />}
          comparisonText="Phlebotomy done"
          indicatorColor="primary"
        />
        <StatCard
          label="In Processing"
          value="24"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="Automated analyzers"
          indicatorColor="warning"
        />
        <StatCard
          label="Awaiting Sign-off"
          value="12"
          icon={<FileCheck2 className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Pathologist review"
          indicatorColor="secondary"
        />
        <StatCard
          label="Verified Reports"
          value="148"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="91% completed"
          indicatorColor="success"
        />
      </div>

      {/* Filter and Table */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Laboratory Worklist & Sample Tracker</h2>
            <p className="text-xs text-text-muted">Real-time status of specimen progression through analyzer pipeline</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'Hematology', label: 'Hematology' },
                { value: 'Biochemistry', label: 'Biochemistry' },
                { value: 'Microbiology', label: 'Microbiology' },
                { value: 'Pathology', label: 'Pathology' },
              ]}
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="py-1 text-xs min-w-[130px]"
            />

            <Select
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Pending', label: 'Pending' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Awaiting Verification', label: 'Awaiting Verification' },
                { value: 'Verified', label: 'Verified' },
              ]}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1 text-xs min-w-[150px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[720px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Test Investigation</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Sample Status</th>
                <th className="py-2.5 px-3">Urgency</th>
                <th className="py-2.5 px-3">Verification</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {labOrders.map(order => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                    {order.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary text-sm">{order.patientName}</div>
                    <div className="text-[10px] text-text-muted font-mono">{order.mrn}</div>
                  </td>
                  <td className="py-3 px-3 text-text-secondary font-medium">{order.testName}</td>
                  <td className="py-3 px-3 text-text-muted">{order.category}</td>
                  <td className="py-3 px-3">
                    <Badge variant={order.sampleStatus === 'Completed' ? 'success' : 'neutral'} size="sm">
                      {order.sampleStatus}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <Badge variant={order.urgency === 'Stat' ? 'danger' : order.urgency === 'Urgent' ? 'warning' : 'neutral'} size="sm">
                      {order.urgency}
                    </Badge>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={order.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant={order.status === 'Awaiting Verification' ? 'primary' : 'outline'}
                      onClick={() => handleOpenReport(order.id)}
                      leftIcon={<FileText className="w-3.5 h-3.5" />}
                      className="text-xs py-1"
                    >
                      {order.status === 'Awaiting Verification' ? 'Verify Result' : 'View Report'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Lab Result Report Modal */}
      {selectedReport && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={`Diagnostic Report: ${selectedReport.testName}`}
          subtitle={`Patient: ${selectedReport.patientName} (${selectedReport.mrn}) • Order: ${selectedReport.orderId}`}
          maxWidth="3xl"
        >
          <div className="space-y-4">
            {/* Header info bar */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs flex-wrap gap-2">
              <div>
                <span className="text-text-muted">Collected: </span>
                <span className="font-mono text-text-primary">{selectedReport.collectedAt}</span>
              </div>
              <div>
                <span className="text-text-muted">Reported: </span>
                <span className="font-mono text-text-primary">{selectedReport.reportedAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedReport.status} />
              </div>
            </div>

            {/* Parameters Table */}
            <div className="rounded-xl border border-white/[0.08] overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-white/[0.04] border-b border-white/[0.08] text-text-muted uppercase">
                    <th className="py-2.5 px-3">Investigation Parameter</th>
                    <th className="py-2.5 px-3">Result Value</th>
                    <th className="py-2.5 px-3">Unit</th>
                    <th className="py-2.5 px-3">Biological Reference</th>
                    <th className="py-2.5 px-3 text-right">Status Flag</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {selectedReport.parameters.map(param => (
                    <tr key={param.id} className="hover:bg-white/[0.02]">
                      <td className="py-2.5 px-3 font-medium text-text-primary">{param.name}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-sm text-text-primary">
                        {param.value}
                      </td>
                      <td className="py-2.5 px-3 text-text-muted">{param.unit}</td>
                      <td className="py-2.5 px-3 font-mono text-text-secondary">{param.referenceRange}</td>
                      <td className="py-2.5 px-3 text-right">
                        <Badge
                          variant={
                            param.flag === 'Normal'
                              ? 'success'
                              : param.flag === 'Low' || param.flag === 'High'
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {param.flag}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Clinical Interpretation */}
            {selectedReport.clinicalInterpretation && (
              <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] text-xs space-y-1">
                <span className="font-bold text-text-secondary uppercase tracking-wider block text-[10px]">
                  Pathologist Clinical Impression:
                </span>
                <p className="text-text-primary leading-relaxed">
                  {selectedReport.clinicalInterpretation}
                </p>
                <div className="pt-2 text-[11px] text-text-muted flex items-center justify-between">
                  <span>Sign-off: <strong className="text-text-secondary">{selectedReport.verifiedBy}</strong></span>
                  <span className="font-mono text-status-success flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Electronic Signature Verified
                  </span>
                </div>
              </div>
            )}

            {/* Footer buttons */}
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPrintLabModalOpen(true)}
                  leftIcon={<Download className="w-3.5 h-3.5 text-accent-primary" />}
                  className="no-print"
                >
                  Download PDF
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.print()}
                  leftIcon={<Printer className="w-3.5 h-3.5" />}
                  className="no-print"
                >
                  Print
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsReportModalOpen(false)}>
                  Close
                </Button>
                {selectedReport.status !== 'Verified' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleVerifyResult}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Verify & Release
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Official Printable / Downloadable Lab Diagnostic Report Modal */}
      <PrintLabReportModal
        isOpen={isPrintLabModalOpen}
        onClose={() => setIsPrintLabModalOpen(false)}
        data={printableData}
      />
    </div>
  );
};
