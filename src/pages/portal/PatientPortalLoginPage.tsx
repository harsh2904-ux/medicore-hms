import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Patient } from '../../types/patient';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';
import { useNotification } from '../../context/NotificationContext';
import {
  Heart,
  FileText,
  Phone,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Sparkles,
  AlertCircle,
  Hash,
  BadgeCheck,
  Users
} from 'lucide-react';

const PORTAL_STORAGE_KEY = 'medicore_portal_patient';

interface DemoPatientOption {
  id: string;
  mrn: string;
  name: string;
  phone: string;
  dept: string;
  initials: string;
  avatarBg: string;
  source: string;
}

const DEMO_PATIENTS: DemoPatientOption[] = [
  {
    id: '1',
    mrn: 'MC-2026-001',
    name: 'Eleanor Vance',
    phone: '+1 (555) 234-5678',
    dept: 'Cardiology',
    initials: 'EV',
    avatarBg: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    source: 'PostgreSQL DB',
  },
  {
    id: '2',
    mrn: 'MC-2026-002',
    name: 'David Kim',
    phone: '+1 (555) 345-6789',
    dept: 'Neurology',
    initials: 'DK',
    avatarBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    source: 'PostgreSQL DB',
  },
  {
    id: '3',
    mrn: 'MC-2026-003',
    name: 'Maria Rodriguez',
    phone: '+1 (555) 456-7890',
    dept: 'Pediatrics',
    initials: 'MR',
    avatarBg: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    source: 'PostgreSQL DB',
  },
  {
    id: '4',
    mrn: 'MC-2026-004',
    name: 'James Wilson',
    phone: '+1 (555) 567-8901',
    dept: 'Orthopedics',
    initials: 'JW',
    avatarBg: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    source: 'PostgreSQL DB',
  },
  {
    id: '5',
    mrn: 'MC-2026-005',
    name: 'Sophia Patel',
    phone: '+1 (555) 678-9012',
    dept: 'General Med',
    initials: 'SP',
    avatarBg: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    source: 'PostgreSQL DB',
  },
  {
    id: 'pat-1',
    mrn: 'MC-2026-001284',
    name: 'Rahul Sharma',
    phone: '+91 98201 44521',
    dept: 'Cardiology',
    initials: 'RS',
    avatarBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    source: 'OPD Clinical',
  },
];

export const PatientPortalLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [authMethod, setAuthMethod] = useState<'mrn' | 'phone'>('mrn');
  const [mrnInput, setMrnInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authenticatePatient = (matchedPatient: Patient) => {
    localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(matchedPatient));
    showToast(
      `Welcome to your Patient Portal, ${matchedPatient.fullName}!`,
      'success',
      'Portal Access Granted'
    );
    navigate('/portal/dashboard');
  };

  const handlePatientLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const query = (authMethod === 'mrn' ? mrnInput : phoneInput).trim();
    if (!query) {
      setError(
        authMethod === 'mrn'
          ? 'Please enter your Medical Record Number (MRN) or click a sample patient below.'
          : 'Please enter your registered mobile phone number or click a sample patient below.'
      );
      return;
    }

    setIsLoading(true);
    try {
      // 1. Try finding patient by MRN or ID
      let matchedPatient = await patientService.getPatientById(query);

      // 2. If not found by direct ID/MRN, search across patients list
      if (!matchedPatient) {
        const patients = await patientService.getPatients({ search: query });
        if (patients.length > 0) {
          matchedPatient = patients[0];
        }
      }

      // 3. Fallback resolution for demo IDs
      if (!matchedPatient) {
        if (query.includes('001') || query.toLowerCase().includes('eleanor') || query.toLowerCase().includes('rahul')) {
          matchedPatient = (await patientService.getPatientById('1')) || (await patientService.getPatientById('pat-1'));
        } else if (query.includes('002') || query.toLowerCase().includes('david')) {
          matchedPatient = (await patientService.getPatientById('2')) || (await patientService.getPatientById('pat-2'));
        } else if (query.includes('003') || query.toLowerCase().includes('maria')) {
          matchedPatient = (await patientService.getPatientById('3')) || (await patientService.getPatientById('pat-3'));
        }
      }

      if (matchedPatient) {
        authenticatePatient(matchedPatient);
      } else {
        setError(
          authMethod === 'mrn'
            ? 'No medical record found matching MRN: "' + query + '". Please check your card, click Register Online, or pick a sample record below.'
            : 'No medical record found matching phone: "' + query + '". Please check your number or register as a new patient.'
        );
      }
    } catch {
      setError('Unable to verify patient record right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPatient = async (demo: DemoPatientOption) => {
    setError(null);
    setIsLoading(true);
    try {
      let p = await patientService.getPatientById(demo.id);
      if (!p) {
        p = await patientService.getPatientById(demo.mrn);
      }
      if (p) {
        authenticatePatient(p);
      } else {
        setMrnInput(demo.mrn);
        setPhoneInput(demo.phone);
        showToast(`Loaded ${demo.name}'s MRN. Click 'Access My Health Records'`, 'info');
      }
    } catch {
      setMrnInput(demo.mrn);
      setPhoneInput(demo.phone);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#05070A] bg-ambient-radial relative overflow-hidden selection:bg-accent-primary/30">
      {/* Symmetrical Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[520px] relative z-10 my-auto">
        <GlassCard className="p-6 sm:p-8 border-white/[0.12] shadow-2xl backdrop-blur-2xl rounded-3xl">
          
          {/* Header & Branding */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="flex justify-center mb-3">
              <MediCoreLogo />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-semibold tracking-wide uppercase mb-2">
              <Heart className="w-3.5 h-3.5 fill-blue-400/20 text-blue-400 shrink-0" />
              <span>Patient Digital Health Portal</span>
            </div>

            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
              Patient Sign In
            </h1>
            <p className="text-xs text-text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
              Access your verified lab results, doctor prescriptions, appointment schedule, and medical invoices.
            </p>
          </div>

          {/* New Patient Registration Banner */}
          <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/30 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary">First Time Patient?</p>
                <p className="text-[11px] text-text-muted truncate">Register online to get your new digital MRN</p>
              </div>
            </div>
            <Link
              to="/portal/register"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shrink-0 whitespace-nowrap shadow-glow-primary"
            >
              Register Online →
            </Link>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger text-xs font-medium flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePatientLogin} className="space-y-4">
            
            {/* Segmented Auth Method Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                Sign In Using
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setAuthMethod('mrn')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    authMethod === 'mrn'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.02]'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span>Medical Record (MRN)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    authMethod === 'phone'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-sm font-semibold'
                      : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.02]'
                  }`}
                >
                  <Phone className="w-3.5 h-3.5 shrink-0" />
                  <span>Mobile Phone</span>
                </button>
              </div>
            </div>

            {/* Input by Auth Method */}
            {authMethod === 'mrn' ? (
              <div>
                <Input
                  label="Medical Record Number (MRN)"
                  placeholder="e.g. MC-2026-001 or MC-2026-001284"
                  value={mrnInput}
                  onChange={e => setMrnInput(e.target.value)}
                  leftIcon={<Hash className="w-4 h-4 text-blue-400" />}
                />
                <p className="text-[11px] text-text-muted mt-1.5 px-0.5">
                  Type your MRN, or click any patient from the list below.
                </p>
              </div>
            ) : (
              <div>
                <Input
                  label="Registered Mobile Phone"
                  placeholder="e.g. +1 (555) 234-5678 or +91 98201 44521"
                  value={phoneInput}
                  onChange={e => setPhoneInput(e.target.value)}
                  leftIcon={<Phone className="w-4 h-4 text-blue-400" />}
                />
                <p className="text-[11px] text-text-muted mt-1.5 px-0.5">
                  The mobile phone number registered during your hospital check-in.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 mt-1 font-semibold shadow-glow-primary"
              isLoading={isLoading}
              leftIcon={<UserCheck className="w-4 h-4" />}
            >
              Access My Health Records
            </Button>
          </form>

          {/* Quick Select Demo Records - 6 Real Patients */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Existing Patients (Click any to Sign In)</span>
              </div>
              <span className="text-[10px] text-blue-400 font-medium">1-Click Access</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DEMO_PATIENTS.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickPatient(p)}
                  className="flex flex-col p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-blue-500/50 hover:bg-white/[0.06] text-left transition-all group"
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold border shrink-0 ${p.avatarBg}`}
                    >
                      {p.initials}
                    </span>
                    <span className="font-semibold text-text-primary text-xs truncate group-hover:text-blue-400 transition-colors">
                      {p.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-text-muted font-mono">
                    <span className="truncate">{p.mrn}</span>
                    <span className="text-text-secondary font-sans text-[9px] px-1 py-0.2 rounded bg-white/[0.05]">
                      {p.dept}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Hospital Staff Portal Link & Register Option */}
          <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-text-muted">
            <Link
              to="/portal/register"
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" /> Register New Patient
            </Link>

            <Link
              to="/login"
              className="text-accent-primary hover:text-accent-primary/80 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Hospital Staff Portal <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Compliance & Security Badges */}
          <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-text-muted flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success shrink-0" />
              <span>HIPAA Compliant</span>
            </span>
            <span className="text-white/20">•</span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>ABDM Connected</span>
            </span>
            <span className="text-white/20">•</span>
            <span>256-Bit SSL</span>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};
