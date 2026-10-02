import React, { useState } from 'react';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useNotification } from '../../context/NotificationContext';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  FileText,
  BarChart,
  Users,
  CheckCircle2
} from 'lucide-react';

interface ReportCard {
  title: string;
  category: string;
  description: string;
  frequency: string;
  format: string;
}

export const ReportsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [activeCategory, setActiveCategory] = useState('All');

  const reports: ReportCard[] = [
    { title: 'Daily Outpatient & Emergency Census', category: 'Clinical', description: 'Complete register of all OPD and trauma encounters by clinic and attending consultant.', frequency: 'Daily (End of Day)', format: 'PDF / CSV' },
    { title: 'NABH Quality & Morbidity Indicators', category: 'Clinical', description: 'Hospital infection control rates (HAI), surgical site infections, and readmission within 30 days.', frequency: 'Monthly', format: 'PDF / XLSX' },
    { title: 'Daily Revenue & Cashier Settlement Summary', category: 'Financial', description: 'Itemized collections breakdown across UPI, POS Credit Card, Cash, and TPA pre-auth vouchers.', frequency: 'Daily', format: 'PDF / Excel' },
    { title: 'Insurance Cashless & TPA Aging Schedule', category: 'Financial', description: 'Pending insurance claims grouped by 0-30, 31-60, and >60 day aging buckets.', frequency: 'Weekly', format: 'XLSX' },
    { title: 'Inpatient Bed Occupancy & Turnaround Time', category: 'Operational', description: 'Average length of stay (ALOS), bed turnover intervals, and ward utilization statistics.', frequency: 'Weekly', format: 'PDF / CSV' },
    { title: 'Laboratory Diagnostic Turnaround Audit (TAT)', category: 'Operational', description: 'Specimen receipt-to-verification latency comparison against NABH benchmark metrics.', frequency: 'Monthly', format: 'PDF / XLSX' },
    { title: 'Pharmacy ABC / VED Stock Consumption', category: 'Inventory', description: 'Fast-moving pharmaceutical inventory movement, critical reorders, and stockouts.', frequency: 'Bi-Weekly', format: 'XLSX' },
    { title: 'Doctor Clinical Workload & RVU Performance', category: 'HR', description: 'Patient consultation volumes, inpatient procedures performed, and surgical metrics by clinician.', frequency: 'Monthly', format: 'PDF' },
  ];

  const filteredReports = activeCategory === 'All'
    ? reports
    : reports.filter(r => r.category === activeCategory);

  const tabs = [
    { id: 'All', label: 'All Reports' },
    { id: 'Clinical', label: 'Clinical' },
    { id: 'Financial', label: 'Financial' },
    { id: 'Operational', label: 'Operational' },
    { id: 'Inventory', label: 'Inventory' },
    { id: 'HR', label: 'HR / Faculty' },
  ];

  const handleDownload = (title: string) => {
    showToast(`Generating and exporting "${title}" in secure format...`, 'info', 'Report Export');
    setTimeout(() => {
      showToast(`"${title}" ready for download!`, 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Report & Compliance Center
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Automated statutory returns, clinical quality registries, and operational exports
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeCategory} onChange={setActiveCategory} />

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((rep, idx) => (
          <GlassCard key={idx} className="p-5 flex flex-col justify-between space-y-4 hover:border-white/[0.16]">
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-accent-primary/10 text-accent-primary shrink-0">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">{rep.title}</h3>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white/[0.06] text-accent-secondary border border-white/[0.08]">
                  {rep.category}
                </span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed mb-4">
                {rep.description}
              </p>

              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] flex items-center justify-between text-xs text-text-muted">
                <span>Frequency: <strong className="text-text-primary">{rep.frequency}</strong></span>
                <span>Format: <strong className="font-mono text-accent-primary">{rep.format}</strong></span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> NABH / IRDAI Standard
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(rep.title)}
                leftIcon={<Download className="w-3.5 h-3.5 text-accent-primary" />}
                className="py-1 text-xs"
              >
                Export Document
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};
