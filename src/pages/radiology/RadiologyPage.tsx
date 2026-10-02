import React, { useState, useEffect } from 'react';
import { labService } from '../../services/labService';
import { RadiologyScan } from '../../types/diagnostics';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Textarea } from '../../components/ui/Textarea';
import { useNotification } from '../../context/NotificationContext';
import {
  Scan,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Activity
} from 'lucide-react';

export const RadiologyPage: React.FC = () => {
  const { showToast } = useNotification();
  const [scans, setScans] = useState<RadiologyScan[]>([]);
  const [modalityFilter, setModalityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedScan, setSelectedScan] = useState<RadiologyScan | null>(null);
  const [findingsInput, setFindingsInput] = useState('');
  const [impressionInput, setImpressionInput] = useState('');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchScans = async () => {
    setIsLoading(true);
    try {
      const data = await labService.getRadiologyScans({
        modality: modalityFilter,
        status: statusFilter,
      });
      setScans(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchScans();
  }, [modalityFilter, statusFilter]);

  const handleOpenScan = (scan: RadiologyScan) => {
    setSelectedScan(scan);
    setFindingsInput(scan.findings || '');
    setImpressionInput(scan.impression || '');
    setIsReportModalOpen(true);
  };

  const handleSaveReport = async () => {
    if (!selectedScan) return;
    try {
      const updated = await labService.saveRadiologyReport(
        selectedScan.id,
        findingsInput,
        impressionInput,
        'Dr. Shalini Swaminathan (Radiology)'
      );
      setSelectedScan(updated);
      showToast(`Radiology report verified for ${updated.patientName}`, 'success', 'Report Signed');
      setIsReportModalOpen(false);
      fetchScans();
    } catch {
      showToast('Failed to save report', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Radiology & Diagnostic Imaging
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            PACS integration, modality DICOM scheduling, and radiologist imaging impressions
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Today's Scans"
          value="48"
          icon={<Scan className="w-5 h-5 text-accent-primary" />}
          comparisonText="Across 4 modalities"
          indicatorColor="primary"
        />
        <StatCard
          label="MRI / CT Scheduled"
          value="18"
          icon={<Clock className="w-5 h-5 text-status-warning" />}
          comparisonText="High field 3.0T"
          indicatorColor="warning"
        />
        <StatCard
          label="Awaiting Reading"
          value="7"
          icon={<FileText className="w-5 h-5 text-accent-secondary" />}
          comparisonText="Radiologist queue"
          indicatorColor="secondary"
        />
        <StatCard
          label="Reports Released"
          value="41"
          icon={<CheckCircle2 className="w-5 h-5 text-status-success" />}
          comparisonText="85% verified"
          indicatorColor="success"
        />
      </div>

      {/* Worklist Card */}
      <GlassCard className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Modality Worklist (PACS Stream)</h2>
            <p className="text-xs text-text-muted">Digital imaging queues across MRI, CT, Ultrasound, and X-Ray</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Select
              options={[
                { value: 'All', label: 'All Modalities' },
                { value: 'X-Ray', label: 'Digital X-Ray' },
                { value: 'CT', label: 'Computed Tomography (CT)' },
                { value: 'MRI', label: 'Magnetic Resonance (MRI)' },
                { value: 'Ultrasound', label: 'Ultrasound Doppler' },
              ]}
              value={modalityFilter}
              onChange={e => setModalityFilter(e.target.value)}
              className="py-1 text-xs min-w-[150px]"
            />

            <Select
              options={[
                { value: 'All', label: 'All Status' },
                { value: 'Scheduled', label: 'Scheduled' },
                { value: 'Reported', label: 'Reported' },
                { value: 'Verified', label: 'Verified' },
              ]}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="py-1 text-xs min-w-[120px]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Accession #</th>
                <th className="py-2.5 px-3">Patient</th>
                <th className="py-2.5 px-3">Modality</th>
                <th className="py-2.5 px-3">Anatomical Region</th>
                <th className="py-2.5 px-3">Referred By</th>
                <th className="py-2.5 px-3">Scheduled Time</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {scans.map(scan => (
                <tr key={scan.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                    {scan.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-text-primary text-sm">{scan.patientName}</div>
                    <div className="text-[10px] text-text-muted font-mono">{scan.mrn}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-white/[0.06] text-accent-secondary border border-white/[0.08]">
                      {scan.modality}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-text-primary font-medium">{scan.bodyPart}</td>
                  <td className="py-3 px-3 text-text-secondary">{scan.orderedBy}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{scan.scheduledTime}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={scan.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleOpenScan(scan)}
                      leftIcon={<FileText className="w-3.5 h-3.5" />}
                      className="py-1 text-xs"
                    >
                      {scan.findings ? 'Read Report' : 'Author Report'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Radiology Report Modal */}
      {selectedScan && (
        <Modal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          title={`Radiology Report: ${selectedScan.modality} ${selectedScan.bodyPart}`}
          subtitle={`Patient: ${selectedScan.patientName} (${selectedScan.mrn}) • Radiologist: ${selectedScan.radiologist}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] flex items-center justify-between text-xs">
              <div>Modality: <strong className="text-accent-secondary font-mono">{selectedScan.modality}</strong></div>
              <div>Accession: <strong className="text-text-primary font-mono">{selectedScan.id}</strong></div>
              <StatusBadge status={selectedScan.status} size="sm" />
            </div>

            <Textarea
              label="Detailed Imaging Findings"
              value={findingsInput}
              onChange={e => setFindingsInput(e.target.value)}
              placeholder="Enter anatomical and structural observations..."
              rows={4}
            />

            <Textarea
              label="Radiological Impression & Diagnostic Conclusion"
              value={impressionInput}
              onChange={e => setImpressionInput(e.target.value)}
              placeholder="Enter final diagnostic summary..."
              rows={3}
            />

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                className="no-print"
              >
                Print Scan Sheet
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleSaveReport}
                  leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                >
                  Verify & Sign
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
