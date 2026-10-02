import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Patient, PatientTimelineItem } from '../../types/patient';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Timeline } from '../../components/ui/Timeline';
import { Skeleton } from '../../components/ui/Skeleton';
import { useNotification } from '../../context/NotificationContext';
import {
  CalendarPlus,
  Stethoscope,
  BedDouble,
  Receipt,
  Phone,
  Mail,
  MapPin,
  Shield,
  Heart,
  AlertTriangle,
  Pill,
  FileText,
  Printer,
  Edit3
} from 'lucide-react';

export const PatientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [timeline, setTimeline] = useState<PatientTimelineItem[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      try {
        const pId = id || 'pat-1';
        const p = await patientService.getPatientById(pId);
        if (p) {
          setPatient(p);
          const tl = await patientService.getPatientTimeline(p.id);
          setTimeline(tl);
        } else {
          // Fallback to first patient
          const fallback = await patientService.getPatientById('pat-1');
          setPatient(fallback);
          if (fallback) {
            const tl = await patientService.getPatientTimeline(fallback.id);
            setTimeline(tl);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-12 text-center text-text-muted">
        Patient record not found.
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'timeline', label: 'Clinical Timeline', badge: timeline.length },
    { id: 'medical-history', label: 'Medical History' },
    { id: 'prescriptions', label: 'Prescriptions', badge: '1 Active' },
    { id: 'lab-reports', label: 'Lab Reports', badge: 'Verified' },
    { id: 'radiology', label: 'Radiology' },
    { id: 'bills', label: 'Bills & Invoices', badge: 'Paid' },
  ];

  return (
    <div className="space-y-6">
      {/* Patient 360 Header Glass Banner */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar, Name, MRN, Demographics */}
          <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-wrap">
            <Avatar name={patient.fullName} size="xl" className="ring-4 ring-white/[0.08]" />

            <div className="space-y-1.5">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight font-sans">
                  {patient.fullName}
                </h1>
                <StatusBadge status={patient.status} />
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/30">
                  {patient.bloodGroup}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
                <span className="font-mono text-accent-primary font-semibold">
                  MRN: {patient.mrn}
                </span>
                <span>•</span>
                <span>{patient.age} Years</span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>DOB: {patient.dob}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-text-muted" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-text-muted" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-text-muted" />
                  <span>{patient.city}, {patient.state}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Primary Patient Actions */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              leftIcon={<Printer className="w-3.5 h-3.5" />}
              className="no-print"
            >
              Print Card
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/appointments')}
              leftIcon={<CalendarPlus className="w-3.5 h-3.5 text-status-warning" />}
            >
              Appointment
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/opd/consultation/${patient.id}`)}
              leftIcon={<Stethoscope className="w-3.5 h-3.5" />}
            >
              Consult
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/ipd')}
              leftIcon={<BedDouble className="w-3.5 h-3.5 text-accent-primary" />}
            >
              Admit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/billing/invoices')}
              leftIcon={<Receipt className="w-3.5 h-3.5 text-status-success" />}
            >
              Create Bill
            </Button>
          </div>
        </div>

        {/* Identity & Insurance ribbon */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-4 text-xs text-text-secondary flex-wrap">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-accent-secondary" />
            <span>Digital ABHA:</span>
            <span className="font-mono text-text-primary">{patient.abhaId || 'Pending Link'}</span>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5 text-status-danger" />
            <span>Insurance:</span>
            <span className="text-text-primary font-medium">
              {patient.insuranceProvider || 'Direct Cash'} {patient.policyNumber ? `(${patient.policyNumber})` : ''}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-text-muted">Primary Consultant:</span>
            <span className="text-text-primary font-semibold">
              {patient.assignedDoctorName || 'Dr. Rajesh Mehta (Cardiology)'}
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Total Encounters</span>
          <div className="text-2xl font-bold text-text-primary mt-1">4 Visits</div>
          <span className="text-[11px] text-text-muted">Last on {patient.lastVisit}</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Diagnostic Reports</span>
          <div className="text-2xl font-bold text-text-primary mt-1">6 Reports</div>
          <span className="text-[11px] text-status-success">1 verified today</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Prescriptions</span>
          <div className="text-2xl font-bold text-text-primary mt-1">3 Active</div>
          <span className="text-[11px] text-accent-primary">RX-2026-9021 dispensed</span>
        </GlassCard>

        <GlassCard className="p-4">
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Outstanding Balance</span>
          <div className="text-2xl font-bold text-status-success mt-1">₹ 0.00</div>
          <span className="text-[11px] text-text-muted">All dues cleared</span>
        </GlassCard>
      </div>

      {/* Tabs Navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Vitals & Clinical Alerts (1 col) */}
          <div className="space-y-6">
            {/* Allergies & Alerts */}
            <GlassCard className="p-5 border-status-danger/20">
              <div className="flex items-center gap-2 mb-3 text-status-danger">
                <AlertTriangle className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-wider">Critical Allergies</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {patient.allergies.length > 0 ? (
                  patient.allergies.map(a => (
                    <span
                      key={a}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-status-danger/15 text-status-danger border border-status-danger/30"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-text-muted">No known drug allergies reported (NKDA)</span>
                )}
              </div>
            </GlassCard>

            {/* Chronic Conditions */}
            <GlassCard className="p-5">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                Chronic Medical Conditions
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {patient.chronicConditions.map(c => (
                  <span
                    key={c}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/[0.06] text-text-primary border border-white/[0.08]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Emergency Contact Card */}
            <GlassCard className="p-5">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
                Emergency Next of Kin
              </h3>
              <div className="space-y-1 text-xs">
                <div className="font-semibold text-text-primary">{patient.emergencyContact.name}</div>
                <div className="text-text-muted">Relationship: {patient.emergencyContact.relationship}</div>
                <div className="font-mono text-accent-primary pt-1">{patient.emergencyContact.phone}</div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Mini Timeline & Recent Findings (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-text-primary">Recent Clinical Events</h3>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className="text-xs text-accent-primary hover:underline font-medium"
                >
                  View full history →
                </button>
              </div>

              <Timeline items={timeline.slice(0, 3)} />
            </GlassCard>

            {/* Active Medication Card */}
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Pill className="w-4 h-4 text-accent-secondary" />
                  <h3 className="text-sm font-semibold text-text-primary">Current Prescribed Regimen</h3>
                </div>
                <span className="text-xs text-text-muted">Updated today</span>
              </div>

              <div className="divide-y divide-white/[0.06]">
                {patient.currentMedications.map((med, i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-text-primary">{med}</span>
                    <span className="text-text-muted font-mono">Routine Daily</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Tab 2: Full Clinical Timeline */}
      {activeTab === 'timeline' && (
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-text-primary">Chronological Patient Journey</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Consolidated stream of consultations, lab specimens, radiology orders, and settlements
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => showToast('Timeline exported to audit log', 'info')}
            >
              Export Stream
            </Button>
          </div>

          <Timeline items={timeline} />
        </GlassCard>
      )}

      {/* Tab 3: Medical History */}
      {activeTab === 'medical-history' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Past Medical & Surgical History</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                <div className="font-semibold text-text-primary">Appendectomy (2018)</div>
                <div className="text-text-muted">Laparoscopic uncomplicated procedure. Uneventful recovery.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                <div className="font-semibold text-text-primary">Mild Bronchial Asthma</div>
                <div className="text-text-muted">Exacerbated seasonally. Controlled on Levocetirizine PRN.</div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Family Health History</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                <div className="font-semibold text-text-primary">Father: Premature Ischemic Heart Disease (CAD)</div>
                <div className="text-text-muted">CABG performed at age 52.</div>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                <div className="font-semibold text-text-primary">Mother: Essential Hypertension</div>
                <div className="text-text-muted">On ACE inhibitors.</div>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Tab 4: Prescriptions */}
      {activeTab === 'prescriptions' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Active Doctor Prescriptions</h3>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/opd/consultation/${patient.id}`)}
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
            >
              Author New Rx
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                  <th className="py-2.5 px-3">Medicine</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Route</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Ecosprin 75 mg (Aspirin)</td>
                  <td className="py-3 px-3">75 mg</td>
                  <td className="py-3 px-3">Oral</td>
                  <td className="py-3 px-3">Once daily</td>
                  <td className="py-3 px-3">30 Days</td>
                  <td className="py-3 px-3 text-text-secondary">After breakfast with water</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Rosuvas 20 mg (Rosuvastatin)</td>
                  <td className="py-3 px-3">20 mg</td>
                  <td className="py-3 px-3">Oral</td>
                  <td className="py-3 px-3">Before bed</td>
                  <td className="py-3 px-3">30 Days</td>
                  <td className="py-3 px-3 text-text-secondary">At bedtime</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-text-primary">Telma 40 mg (Telmisartan)</td>
                  <td className="py-3 px-3">40 mg</td>
                  <td className="py-3 px-3">Oral</td>
                  <td className="py-3 px-3">Once daily</td>
                  <td className="py-3 px-3">30 Days</td>
                  <td className="py-3 px-3 text-text-secondary">Morning post food</td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Tab 5: Lab Reports */}
      {activeTab === 'lab-reports' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Laboratory Investigation Results</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/laboratory/results')}
            >
              Open Full Lab Desk
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="font-semibold text-text-primary text-sm">
                  Complete Blood Count (CBC) with Automated Differential
                </span>
                <span className="text-xs text-text-muted block">
                  Report ID: REP-CBC-9921 • Verified by Dr. Kavita Joshi (Pathology)
                </span>
              </div>
              <StatusBadge status="Verified" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-text-muted">Hemoglobin</span>
                <div className="text-base font-bold text-status-warning">11.4 g/dL (LOW)</div>
                <span className="text-[10px] text-text-muted">Ref: 13.0 - 17.0</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-text-muted">WBC Count</span>
                <div className="text-base font-bold text-status-success">8,400 /µL</div>
                <span className="text-[10px] text-text-muted">Ref: 4,000 - 11,000</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-text-muted">Platelets</span>
                <div className="text-base font-bold text-status-success">240,000 /µL</div>
                <span className="text-[10px] text-text-muted">Ref: 150k - 450k</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-text-muted">ESR (1st Hr)</span>
                <div className="text-base font-bold text-status-danger">18 mm (HIGH)</div>
                <span className="text-[10px] text-text-muted">Ref: 0 - 15</span>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Tab 6: Radiology */}
      {activeTab === 'radiology' && (
        <GlassCard className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Imaging & Diagnostic Scans</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/radiology')}>
              Radiology Worklist
            </Button>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.08] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-text-primary">Chest X-Ray PA View Erect</span>
              <StatusBadge status="Verified" />
            </div>
            <p className="text-text-secondary leading-relaxed">
              <strong>Findings:</strong> Normal cardiac silhouette. Clear bilateral lung fields. Sharp costophrenic angles. Normal vascular markings.
            </p>
            <p className="text-accent-primary font-medium">
              <strong>Impression:</strong> Normal baseline study. No acute cardiopulmonary pathology.
            </p>
          </div>
        </GlassCard>
      )}

      {/* Tab 7: Bills */}
      {activeTab === 'bills' && (
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Invoices & Financial Settlements</h3>
            <Button variant="primary" size="sm" onClick={() => navigate('/billing/invoices')}>
              New Invoice
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                  <th className="py-2.5 px-3">Invoice #</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Subtotal</th>
                  <th className="py-2.5 px-3">Total Paid</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                <tr>
                  <td className="py-3 px-3 font-mono font-semibold text-text-primary">INV-2026-00431</td>
                  <td className="py-3 px-3 text-text-muted">2026-09-30</td>
                  <td className="py-3 px-3 font-mono">₹ 5,340</td>
                  <td className="py-3 px-3 font-mono font-bold text-status-success">₹ 4,850</td>
                  <td className="py-3 px-3">UPI</td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status="Paid" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </div>
  );
};
