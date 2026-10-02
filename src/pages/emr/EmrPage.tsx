import React, { useState } from 'react';
import { initialPatients, initialPatientTimeline } from '../../services/mockData';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Timeline } from '../../components/ui/Timeline';
import { Button } from '../../components/ui/Button';
import { SearchInput } from '../../components/ui/SearchInput';
import {
  FileHeart,
  Stethoscope,
  Pill,
  AlertTriangle,
  History,
  FileText,
  Printer
} from 'lucide-react';

export const EmrPage: React.FC = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatients[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const patient = initialPatients.find(p => p.id === selectedPatientId) || initialPatients[0];
  const timeline = initialPatientTimeline[patient.id] || initialPatientTimeline['pat-1'] || [];

  const filteredPatients = initialPatients.filter(
    p => p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Electronic Medical Record (EMR)
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Longitudinal electronic patient chart, historical encounters, and clinical timeline
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
          leftIcon={<Printer className="w-3.5 h-3.5" />}
          className="no-print"
        >
          Print Record
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Patient Selector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <GlassCard className="p-4 space-y-3">
            <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider">
              Select Patient Chart
            </h2>
            <SearchInput
              placeholder="Filter by name or MRN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onClear={() => setSearchQuery('')}
            />

            <div className="space-y-1.5 max-h-[550px] overflow-y-auto">
              {filteredPatients.map(p => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatientId(p.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selectedPatientId === p.id
                      ? 'bg-accent-primary/20 border border-accent-primary/40 shadow-sm'
                      : 'bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={p.fullName} size="sm" />
                    <div className="min-w-0">
                      <div className="font-semibold text-xs text-text-primary truncate">{p.fullName}</div>
                      <div className="text-[10px] text-text-muted font-mono">{p.mrn}</div>
                    </div>
                  </div>
                  <StatusBadge status={p.status} size="sm" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Right: Master EMR Workspace (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Patient Header Banner */}
          <GlassCard className="p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Avatar name={patient.fullName} size="lg" />
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-xl font-bold text-text-primary">{patient.fullName}</h2>
                    <span className="font-mono text-xs text-accent-primary font-bold">({patient.mrn})</span>
                    <StatusBadge status={patient.status} />
                  </div>
                  <div className="text-xs text-text-secondary mt-1">
                    {patient.age} Years • {patient.gender} • Blood Group: <strong className="text-accent-secondary">{patient.bloodGroup}</strong> • ABHA: {patient.abhaId}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Clinical Summaries Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Allergies */}
            <GlassCard className="p-4 border-status-danger/25">
              <div className="flex items-center gap-1.5 text-xs font-bold text-status-danger uppercase tracking-wider mb-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Drug Allergies</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map(a => (
                    <span key={a} className="px-2 py-0.5 rounded text-xs bg-status-danger/15 text-status-danger font-semibold">
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">No allergies recorded</span>
                )}
              </div>
            </GlassCard>

            {/* Chronic Conditions */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                <FileHeart className="w-3.5 h-3.5 text-accent-primary" />
                <span>Chronic Illness</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {patient.chronicConditions.map(c => (
                  <span key={c} className="px-2 py-0.5 rounded text-xs bg-white/[0.06] text-text-primary">
                    {c}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Active Meds */}
            <GlassCard className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                <Pill className="w-3.5 h-3.5 text-accent-secondary" />
                <span>Active Rx</span>
              </div>
              <div className="space-y-1 text-xs text-text-secondary">
                {patient.currentMedications.map((m, i) => (
                  <div key={i} className="truncate">• {m}</div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Visual Longitudinal Timeline */}
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-accent-primary" />
                <h3 className="text-sm font-semibold text-text-primary">Longitudinal Medical Record Timeline</h3>
              </div>
              <span className="text-xs text-text-muted font-mono">{timeline.length} Entries Logged</span>
            </div>

            <Timeline items={timeline} />
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
