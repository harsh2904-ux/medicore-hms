import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Patient } from '../../types/patient';
import { patientService } from '../../services/patientService';
import { billingService } from '../../services/billingService';
import { appointmentService } from '../../services/appointmentService';
import { Invoice } from '../../types/billing';
import { Appointment } from '../../types/appointment';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';
import { PrintInvoiceModal } from '../../components/billing/PrintInvoiceModal';
import { PrintPrescriptionModal } from '../../components/clinical/PrintPrescriptionModal';
import { PrintLabReportModal, PrintableLabReportData } from '../../components/clinical/PrintLabReportModal';
import { PrintDischargeSummaryModal, PrintableDischargeSummaryData } from '../../components/clinical/PrintDischargeSummaryModal';
import { BookPatientAppointmentModal } from '../../components/portal/BookPatientAppointmentModal';
import { PrintAppointmentSlipModal } from '../../components/portal/PrintAppointmentSlipModal';
import {
  Heart,
  Pill,
  FlaskConical,
  Receipt,
  Calendar,
  CalendarPlus,
  Printer,
  Download,
  LogOut,
  ShieldCheck,
  Activity,
  AlertCircle,
  FileText,
  User,
  Clock,
  Building,
  Bell,
  MessageSquare
} from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { communicationService } from '../../services/communicationService';

const PORTAL_STORAGE_KEY = 'medicore_portal_patient';

export const PatientPortalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'lab' | 'discharge' | 'billing' | 'appointments'>('prescriptions');

  // Notifications Popover State
  const [showPatientNotifs, setShowPatientNotifs] = useState(false);
  const [patientAlerts, setPatientAlerts] = useState([
    {
      id: 'p-notif-1',
      title: 'Lab Report Verified',
      message: 'Complete Blood Count (CBC) results verified by Pathology department.',
      time: '1 hour ago',
      tab: 'lab' as const,
      read: false,
    },
    {
      id: 'p-notif-2',
      title: 'Active Prescription Available',
      message: 'Cardiology prescription pad ready for digital download and print.',
      time: '2 hours ago',
      tab: 'prescriptions' as const,
      read: false,
    },
    {
      id: 'p-notif-3',
      title: 'Digital Health Card Active',
      message: 'Your hospital MRN is linked with MediCore Health Network.',
      time: 'Today',
      tab: 'appointments' as const,
      read: true,
    },
  ]);

  // Modals state
  const [isPrintInvoiceOpen, setIsPrintInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPrintRxOpen, setIsPrintRxOpen] = useState(false);
  const [isPrintLabOpen, setIsPrintLabOpen] = useState(false);
  const [selectedLabData, setSelectedLabData] = useState<PrintableLabReportData | null>(null);
  const [isPrintDischargeOpen, setIsPrintDischargeOpen] = useState(false);
  const [isBookAptModalOpen, setIsBookAptModalOpen] = useState(false);
  const [selectedAptForSlip, setSelectedAptForSlip] = useState<Appointment | null>(null);
  const [isPrintSlipOpen, setIsPrintSlipOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PORTAL_STORAGE_KEY);
    if (!stored) {
      navigate('/portal');
      return;
    }
    try {
      const parsed: Patient = JSON.parse(stored);
      setPatient(parsed);
      loadPatientData(parsed);
    } catch {
      navigate('/portal');
    }
  }, [navigate]);

  const loadPatientData = async (p: Patient) => {
    try {
      const [invs, apts] = await Promise.all([
        billingService.getInvoices(),
        appointmentService.getAppointments(),
      ]);

      // Filter for this patient
      const myInvoices = invs.filter(i => i.patientMrn === p.mrn || i.patientName.toLowerCase().includes(p.firstName.toLowerCase()));
      const myAppointments = apts.filter(a => a.patientMrn === p.mrn || a.patientName.toLowerCase().includes(p.firstName.toLowerCase()));

      setInvoices(myInvoices.length > 0 ? myInvoices : invs.slice(0, 2));
      setAppointments(myAppointments.length > 0 ? myAppointments : apts.slice(0, 2));
    } catch {
      // Fallback
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(PORTAL_STORAGE_KEY);
    navigate('/portal');
  };

  const handleAppointmentBooked = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
    setSelectedAptForSlip(newApt);
    setIsPrintSlipOpen(true);
    setActiveTab('appointments');
    setPatientAlerts(prev => [
      {
        id: `p-notif-${Date.now()}`,
        title: 'Appointment Confirmed',
        message: `Token ${newApt.tokenNumber || 'T-24'} reserved with ${newApt.doctorName} for ${newApt.date} at ${newApt.time}.`,
        time: 'Just now',
        tab: 'appointments' as const,
        read: false,
      },
      ...prev,
    ]);
  };

  if (!patient) return null;

  // Sample patient prescriptions
  const patientPrescriptions = [
    {
      name: 'Atorvastatin (Lipitor)',
      dosage: '20mg Tablet',
      frequency: 'Once daily at bedtime (0 - 0 - 1)',
      duration: '30 Days',
      doctor: 'Dr. Sarah Jenkins (Cardiology)',
      instructions: 'Take after dinner. Monitor lipid panel.',
      status: 'Active',
    },
    {
      name: 'Metoprolol Tartrate',
      dosage: '50mg Tablet',
      frequency: 'Twice daily (1 - 0 - 1)',
      duration: '15 Days',
      doctor: 'Dr. Sarah Jenkins (Cardiology)',
      instructions: 'Take with food. Do not skip doses.',
      status: 'Active',
    },
    {
      name: 'Aspirin (Ecosprin)',
      dosage: '75mg Gastro-resistant',
      frequency: 'Once daily (1 - 0 - 0)',
      duration: '30 Days',
      doctor: 'Dr. Sarah Jenkins (Cardiology)',
      instructions: 'Take immediately after breakfast.',
      status: 'Active',
    },
  ];

  // Sample lab reports
  const labReports = [
    {
      id: 'LAB-2026-881',
      testName: 'Complete Blood Count (CBC with Automated Differential)',
      department: 'Pathology & Hematology',
      date: '2026-09-30',
      status: 'Verified',
      resultSummary: 'Hemoglobin: 13.8 g/dL (Normal) • WBC: 6,800/μL • Platelets: 245K',
      flag: 'Normal',
    },
    {
      id: 'LAB-2026-882',
      testName: 'Comprehensive Lipid Profile Panel',
      department: 'Clinical Biochemistry',
      date: '2026-09-28',
      status: 'Verified',
      resultSummary: 'Total Cholesterol: 198 mg/dL • LDL: 110 mg/dL • HDL: 48 mg/dL • Triglycerides: 145 mg/dL',
      flag: 'Review Recommended',
    },
    {
      id: 'RAD-2026-402',
      testName: '12-Lead Electrocardiogram (ECG) with Rhythm Strip',
      department: 'Diagnostic Cardiology',
      date: '2026-09-25',
      status: 'Verified',
      resultSummary: 'Normal sinus rhythm, heart rate 68 bpm. No acute ST-elevation or ischemic changes.',
      flag: 'Normal',
    },
  ];

  const tabs = [
    { id: 'prescriptions', label: 'My Prescriptions', icon: <Pill className="w-4 h-4" /> },
    { id: 'lab', label: 'Diagnostic & Lab Reports', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'discharge', label: 'Discharge Summaries', icon: <FileText className="w-4 h-4" /> },
    { id: 'billing', label: 'Invoices & Receipts', icon: <Receipt className="w-4 h-4" /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#05070A] bg-ambient-radial text-text-primary p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Portal Navbar */}
        <header className="flex items-center justify-between p-4 rounded-2xl bg-[#0F131A]/80 backdrop-blur-xl border border-white/[0.08]">
          <div className="flex items-center gap-3">
            <MediCoreLogo />
            <div className="border-l border-white/[0.12] pl-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Patient Digital Health Portal
              </span>
              <p className="text-[11px] text-text-muted">MediCore Health Network</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Patient Notifications Bell & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPatientNotifs(!showPatientNotifs)}
                className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/[0.06] transition-colors"
                aria-label="View patient alerts"
              >
                <Bell className="w-4 h-4 text-blue-400" />
                {patientAlerts.filter(a => !a.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-[#0F131A] animate-pulse" />
                )}
              </button>

              {showPatientNotifs && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0F131A] border border-white/[0.12] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between px-2 py-1.5 border-b border-white/[0.08] mb-2">
                    <span className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                      Health Alerts & Updates
                    </span>
                    <button
                      onClick={() => setPatientAlerts(prev => prev.map(a => ({ ...a, read: true })))}
                      className="text-[11px] text-blue-400 hover:underline font-medium"
                    >
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-1.5">
                    {patientAlerts.map(a => (
                      <div
                        key={a.id}
                        onClick={() => {
                          setPatientAlerts(prev => prev.map(item => item.id === a.id ? { ...item, read: true } : item));
                          setActiveTab(a.tab);
                          setShowPatientNotifs(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          a.read
                            ? 'bg-transparent hover:bg-white/[0.03]'
                            : 'bg-blue-500/[0.08] border border-blue-500/25 hover:bg-blue-500/[0.12]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] text-text-muted mb-0.5">
                          <span className="font-semibold text-text-primary">{a.title}</span>
                          <span className="text-[10px]">{a.time}</span>
                        </div>
                        <p className="text-xs text-text-secondary">{a.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="text-xs text-text-muted hover:text-text-primary transition-colors hidden sm:inline"
            >
              Hospital Staff Portal
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Sign Out
            </Button>
          </div>
        </header>

        {/* Patient Identity Banner */}
        <GlassCard className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar name={patient.fullName} size="lg" />
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-2xl font-bold text-text-primary">{patient.fullName}</h1>
                  <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-semibold">
                    {patient.mrn}
                  </span>
                  <StatusBadge status={patient.status} size="sm" />
                </div>

                <div className="flex items-center gap-4 text-xs text-text-muted mt-2 flex-wrap">
                  <span>Age: <strong className="text-text-primary">{patient.age} Yrs</strong></span>
                  <span>Gender: <strong className="text-text-primary">{patient.gender}</strong></span>
                  <span>Blood Group: <strong className="text-accent-secondary font-bold">{patient.bloodGroup}</strong></span>
                  <span>Phone: <strong className="text-text-primary">{patient.phone}</strong></span>
                  <span>Registered: <strong className="text-text-primary">{patient.registeredDate}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsBookAptModalOpen(true)}
                leftIcon={<CalendarPlus className="w-4 h-4" />}
              >
                Book Doctor Appointment
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPrintRxOpen(true)}
                leftIcon={<Printer className="w-4 h-4" />}
              >
                Print Prescription
              </Button>
            </div>
          </div>

          {/* Allergies Warning Banner if present */}
          {patient.allergies && patient.allergies.length > 0 && (
            <div className="mt-5 p-3 rounded-xl bg-status-danger/10 border border-status-danger/25 text-status-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                <strong>Documented Drug Allergies:</strong> {patient.allergies.join(', ')}
              </span>
            </div>
          )}
        </GlassCard>

        {/* Health Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Active Prescriptions"
            value="3 Rx"
            icon={<Pill className="w-5 h-5 text-accent-primary" />}
            comparisonText="Current medications"
            indicatorColor="primary"
          />
          <StatCard
            label="Verified Lab Reports"
            value="3 Reports"
            icon={<FlaskConical className="w-5 h-5 text-status-success" />}
            comparisonText="All results signed"
            indicatorColor="success"
          />
          <StatCard
            label="Upcoming Appointments"
            value={`${appointments.length} Scheduled`}
            icon={<Calendar className="w-5 h-5 text-blue-400" />}
            comparisonText="Next review scheduled"
            indicatorColor="primary"
          />
          <StatCard
            label="Billing Account Balance"
            value={invoices.length > 0 ? `₹${invoices[0].balanceDue}` : '₹0.00'}
            icon={<Receipt className="w-5 h-5 text-status-warning" />}
            comparisonText="Total balance due"
            indicatorColor="warning"
          />
        </div>

        {/* Portal Navigation Tabs */}
        <Tabs tabs={tabs} activeTab={activeTab} onChange={(id) => setActiveTab(id as any)} />

        {/* TAB 1: My Prescriptions */}
        {activeTab === 'prescriptions' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-text-primary">Current Prescribed Medications</h2>
                <p className="text-xs text-text-muted">Take medicines strictly according to clinical instructions</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPrintRxOpen(true)}
                leftIcon={<Printer className="w-3.5 h-3.5 text-blue-400" />}
              >
                Print / Download Rx PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {patientPrescriptions.map((rx, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-text-primary">{rx.name}</h3>
                      <p className="text-xs text-accent-primary font-mono">{rx.dosage}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                      {rx.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-text-secondary">
                    <p><span className="text-text-muted">Dosage Schedule:</span> <strong className="text-text-primary">{rx.frequency}</strong></p>
                    <p><span className="text-text-muted">Duration:</span> {rx.duration}</p>
                    <p><span className="text-text-muted">Prescribed By:</span> {rx.doctor}</p>
                  </div>

                  <p className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-text-muted italic">
                    "{rx.instructions}"
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* TAB 2: Diagnostic & Lab Reports */}
        {activeTab === 'lab' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-text-primary">Pathology & Radiology Test Results</h2>
                <p className="text-xs text-text-muted">Verified biological analyzers and clinical radiologist reports</p>
              </div>
            </div>

            <div className="space-y-3">
              {labReports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-accent-primary font-bold">{report.id}</span>
                      <h3 className="font-bold text-sm text-text-primary">{report.testName}</h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary font-mono">{report.resultSummary}</p>
                    <p className="text-[11px] text-text-muted">{report.department} • Authorized on {report.date}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLabData({
                        orderId: report.id,
                        testName: report.testName,
                        specimenType: report.testName.includes('Lipid') ? 'Serum / Plasma' : 'Whole Blood (EDTA)',
                        patientName: patient.fullName,
                        patientMrn: patient.mrn,
                        patientAge: patient.age,
                        patientGender: patient.gender,
                        orderedBy: 'Dr. Sarah Jenkins, MD',
                        verifiedBy: 'Dr. Rajesh Mehta, MD (Pathology)',
                        verifiedAt: report.date,
                        parameters: report.testName.includes('Lipid')
                          ? [
                              { name: 'Total Cholesterol', value: '198', unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'NORMAL' },
                              { name: 'Triglycerides', value: '145', unit: 'mg/dL', referenceRange: '< 150 mg/dL', status: 'NORMAL' },
                              { name: 'HDL Cholesterol', value: '48', unit: 'mg/dL', referenceRange: '> 40 mg/dL', status: 'NORMAL' },
                              { name: 'LDL Cholesterol', value: '110', unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: 'HIGH' },
                            ]
                          : [
                              { name: 'Hemoglobin (Hb)', value: '13.8', unit: 'g/dL', referenceRange: '13.0 - 17.0 g/dL', status: 'NORMAL' },
                              { name: 'Total Leukocyte Count (WBC)', value: '6,800', unit: '/μL', referenceRange: '4,000 - 11,000 /μL', status: 'NORMAL' },
                              { name: 'Platelet Count', value: '245,000', unit: '/μL', referenceRange: '150,000 - 450,000 /μL', status: 'NORMAL' },
                              { name: 'Packed Cell Volume (PCV)', value: '42.1', unit: '%', referenceRange: '40.0 - 50.0 %', status: 'NORMAL' },
                            ],
                        clinicalRemarks: 'Analyzer specimen verified. Biological parameters in physiological reference range. Digital NABL signature applied.'
                      });
                      setIsPrintLabOpen(true);
                    }}
                    leftIcon={<Download className="w-3.5 h-3.5 text-emerald-400" />}
                  >
                    Download PDF
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* TAB: Inpatient Discharge Summaries */}
        {activeTab === 'discharge' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-text-primary">Inpatient Hospital Stays & Discharge Summaries</h2>
                <p className="text-xs text-text-muted">Certified hospital course records, surgical procedures, and discharge medications</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      ADM-2026-9021
                    </span>
                    <h3 className="font-bold text-sm text-text-primary">
                      Acute Coronary Syndrome (Unstable Angina) — Medical Management
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Discharged Stable
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary">
                    Stay Duration: <span className="text-text-primary font-medium">Sep 12, 2026 – Sep 18, 2026 (6 Days)</span> • Ward: <strong className="text-text-primary">Cardiology Ward 4B (Bed 402)</strong>
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Attending Physician: <strong className="text-text-secondary">Dr. Sarah Jenkins, MD (Cardiology)</strong> • Medical Council Reg: #MCI-2018-84920
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsPrintDischargeOpen(true)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download Summary PDF
                </Button>
              </div>
            </div>
          </GlassCard>
        )}

        {/* TAB 3: Invoices & Receipts */}
        {activeTab === 'billing' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <h2 className="text-base font-bold text-text-primary">Hospital Bills & Payment Receipts</h2>
                <p className="text-xs text-text-muted">Official GST tax invoices, consultation fees, and receipts</p>
              </div>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-accent-primary">{inv.invoiceNumber}</span>
                      <StatusBadge status={inv.status} size="sm" />
                    </div>
                    <p className="text-xs text-text-secondary">
                      Date: <span className="font-mono text-text-primary">{inv.date}</span> • Total Bill: <strong className="text-text-primary font-mono">₹{inv.totalAmount.toLocaleString()}</strong> • Paid: <strong className="text-status-success font-mono">₹{inv.amountPaid.toLocaleString()}</strong> • Due: <strong className="text-status-danger font-mono">₹{inv.balanceDue.toLocaleString()}</strong>
                    </p>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setIsPrintInvoiceOpen(true);
                    }}
                    leftIcon={<Printer className="w-3.5 h-3.5 text-blue-400" />}
                  >
                    Print Tax Invoice PDF
                  </Button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* TAB 4: Appointments */}
        {activeTab === 'appointments' && (
          <GlassCard className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
              <div>
                <h2 className="text-base font-bold text-text-primary">My Scheduled Doctor Consultations</h2>
                <p className="text-xs text-text-muted">Clinic appointment slots, entry tokens, and chamber locations</p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsBookAptModalOpen(true)}
                leftIcon={<CalendarPlus className="w-4 h-4" />}
              >
                Book New Appointment
              </Button>
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl bg-white/[0.02] border border-dashed border-white/[0.1] space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary text-base">No Scheduled Consultations</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  You currently have no scheduled doctor visits. Choose a specialist physician, date, and time slot to book your appointment online.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsBookAptModalOpen(true)}
                  leftIcon={<CalendarPlus className="w-4 h-4" />}
                >
                  Book Appointment Now
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-500/30 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">
                          {apt.tokenNumber || `T-${apt.id}`}
                        </span>
                        <h3 className="font-bold text-sm text-text-primary">{apt.doctorName}</h3>
                        <span className="text-xs text-accent-primary">({apt.department})</span>
                        <StatusBadge status={apt.status} size="sm" />
                      </div>
                      <p className="text-xs text-text-secondary flex items-center gap-3 flex-wrap">
                        <span>Date: <strong className="text-text-primary font-mono">{apt.date}</strong></span>
                        <span>Time: <strong className="text-text-primary font-mono">{apt.time}</strong></span>
                        <span>Chamber: <strong className="text-text-primary">{apt.roomNumber || 'Room 201'}</strong></span>
                        <span>Type: <strong className="text-accent-secondary">{apt.type}</strong></span>
                      </p>
                      {apt.reason && (
                        <p className="text-[11px] text-text-muted">Reason: {apt.reason}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedAptForSlip(apt);
                          setIsPrintSlipOpen(true);
                        }}
                        leftIcon={<Printer className="w-3.5 h-3.5 text-blue-400" />}
                      >
                        Print Pass
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={async () => {
                          const token = apt.tokenNumber || `OPD-${apt.id}`;
                          await communicationService.sendAppointmentConfirmation({
                            patientName: patient.fullName,
                            phone: patient.phone,
                            doctorName: apt.doctorName,
                            department: apt.department,
                            date: apt.date,
                            time: apt.time,
                            token: token,
                            autoOpenWhatsApp: true
                          });
                          showToast(`Token Pass #${token} dispatched & opened in WhatsApp!`, 'success', 'WhatsApp Pass Launched');
                        }}
                        leftIcon={<MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                      >
                        Send to WhatsApp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

      </div>

      {/* Print Modals */}
      <PrintInvoiceModal
        isOpen={isPrintInvoiceOpen}
        onClose={() => setIsPrintInvoiceOpen(false)}
        invoice={selectedInvoice}
      />

      <PrintPrescriptionModal
        isOpen={isPrintRxOpen}
        onClose={() => setIsPrintRxOpen(false)}
        data={{
          doctorName: 'Dr. Sarah Jenkins, MD',
          doctorSpecialty: 'Senior Consultant Physician',
          doctorLicense: 'CA-MD-98231',
          doctorChamber: 'OPD Chamber 201',
          patientName: patient.fullName,
          patientMrn: patient.mrn,
          patientAge: patient.age,
          patientGender: patient.gender,
          vitals: {
            bp: '120/80 mmHg',
            pulse: 72,
            temp: 98.4,
            spo2: 99,
            weight: 68,
          },
          chiefComplaint: 'Follow-up consultation',
          diagnosis: 'Cardiovascular assessment and lipid review',
          medications: patientPrescriptions.map(p => ({
            name: p.name,
            dosage: p.dosage,
            frequency: p.frequency,
            duration: p.duration,
            instructions: p.instructions,
          })),
          advice: 'Continue current medications, maintain low-sodium diet, and exercise 30 minutes daily.',
          followUpDate: 'After 30 Days',
        }}
      />

      {/* Official Diagnostic Lab Report Modal */}
      <PrintLabReportModal
        isOpen={isPrintLabOpen}
        onClose={() => setIsPrintLabOpen(false)}
        data={selectedLabData}
      />

      {/* Official Inpatient Discharge Summary Modal */}
      <PrintDischargeSummaryModal
        isOpen={isPrintDischargeOpen}
        onClose={() => setIsPrintDischargeOpen(false)}
        data={{
          admissionId: 'ADM-2026-9021',
          patientName: patient.fullName,
          patientMrn: patient.mrn,
          patientAge: patient.age,
          patientGender: patient.gender,
          admissionDate: 'Sep 12, 2026 at 10:15 AM',
          dischargeDate: 'Sep 18, 2026 at 02:30 PM',
          department: 'Department of Cardiology & Critical Care',
          attendingDoctor: 'Dr. Sarah Jenkins, MD (Cardiology)',
          doctorLicense: 'MCI-2018-84920',
          wardBed: 'Cardiology Ward 4B (Bed 402)',
          diagnosis: 'Acute Coronary Syndrome (Unstable Angina) - Successfully Stabilized',
          secondaryDiagnoses: ['Primary Essential Hypertension (Stage 2)', 'Mild Dyslipidemia'],
          clinicalCourse: 'Patient presented with acute retrosternal chest tightness radiating to the left arm. Serial troponin-I and ECG confirmed unstable angina. Managed with dual antiplatelet therapy, high-intensity statin, beta-blocker, and ACE inhibitor. Coronary CT angiography revealed non-obstructive coronary plaques. Vitals stabilized nicely over 6-day stay.',
          dischargeVitals: {
            bp: '122/80 mmHg',
            pulse: 72,
            temp: '98.4 °F',
            spo2: '99% on Room Air',
          },
          dischargeMedications: [
            { name: 'Atorvastatin (Lipitor)', dosage: '40mg', frequency: '0 - 0 - 1 (Night)', duration: '90 Days', instructions: 'Take after dinner. Monitor lipid profile.' },
            { name: 'Metoprolol Tartrate', dosage: '50mg', frequency: '1 - 0 - 1 (B/D)', duration: '30 Days', instructions: 'Take with or after breakfast and dinner.' },
            { name: 'Aspirin (Ecosprin)', dosage: '75mg', frequency: '1 - 0 - 0 (Morning)', duration: '90 Days', instructions: 'Take immediately after morning meal.' },
          ],
          dietAdvice: 'Strict low-sodium (<2g/day) cardiac diet. Abstain from smoking, alcohol, and excessive caffeine. Regular aerobic walking 30 minutes daily after 2 weeks of rest.',
          followUpDate: 'Oct 15, 2026 at 10:30 AM (OPD Chamber 204)',
        }}
      />

      {/* Self-Service Patient Appointment Booking Modal */}
      <BookPatientAppointmentModal
        isOpen={isBookAptModalOpen}
        onClose={() => setIsBookAptModalOpen(false)}
        patient={patient}
        onAppointmentBooked={handleAppointmentBooked}
      />

      {/* Official Printable Appointment Confirmation Pass */}
      <PrintAppointmentSlipModal
        isOpen={isPrintSlipOpen}
        onClose={() => setIsPrintSlipOpen(false)}
        appointment={selectedAptForSlip}
        patient={patient}
      />
    </div>
  );
};
