import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { PatientRegistrationInput } from '../../types/patient';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';
import { useNotification } from '../../context/NotificationContext';
import {
  UserPlus,
  Heart,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award
} from 'lucide-react';
import { AbhaVerificationModal, AbhaVerificationResult } from '../../components/common/AbhaVerificationModal';

const PORTAL_STORAGE_KEY = 'medicore_portal_patient';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const PatientPortalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState<PatientRegistrationInput>({
    firstName: '',
    lastName: '',
    gender: 'Male',
    dob: '1995-06-15',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400001',
    emergencyContactName: '',
    emergencyContactRelationship: 'Family',
    emergencyContactPhone: '',
    allergies: '',
    chronicConditions: '',
  });

  const [showAbhaModal, setShowAbhaModal] = useState(false);
  const [abhaResult, setAbhaResult] = useState<AbhaVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please provide your first and last name.');
      return;
    }

    if (!formData.phone.trim()) {
      setError('Please provide a valid contact mobile phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const createdPatient = await patientService.createPatient(formData);

      // Save session so patient is automatically logged into the portal
      localStorage.setItem(PORTAL_STORAGE_KEY, JSON.stringify(createdPatient));

      showToast(
        `Welcome to MediCore Health Network, ${createdPatient.fullName}! Your MRN is ${createdPatient.mrn}.`,
        'success',
        'Patient Registration Successful'
      );

      navigate('/portal/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please check your information.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-[#05070A] bg-ambient-radial relative overflow-hidden selection:bg-accent-primary/30">
      {/* Symmetrical Background Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl relative z-10 my-8">
        <GlassCard className="p-6 sm:p-9 border-white/[0.12] shadow-2xl backdrop-blur-2xl rounded-3xl">
          
          {/* Header & Branding */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex justify-center mb-3">
              <MediCoreLogo />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] font-semibold tracking-wide uppercase mb-2">
              <Heart className="w-3.5 h-3.5 fill-blue-400/20 text-blue-400 shrink-0" />
              <span>Digital Health Record Enrollment</span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-bold text-text-primary tracking-tight font-sans">
              New Patient Registration
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-md mx-auto leading-relaxed">
              Create your official MediCore patient record to book appointments, view diagnostic lab results, and download prescriptions.
            </p>
          </div>

          {/* Error Message Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger text-xs font-medium flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* ABHA Digital Health ID (ABDM) Integration */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-500/10 via-white/[0.02] to-emerald-500/10 border border-orange-500/25 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Ayushman Bharat ABHA ID</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
                      ABDM M1
                    </span>
                  </div>
                  {abhaResult ? (
                    <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Linked: {abhaResult.abhaNumber} ({abhaResult.abhaAddress})
                    </p>
                  ) : (
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Link your 14-digit government health identity via Aadhaar OTP
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAbhaModal(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  abhaResult
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-950/40'
                }`}
              >
                {abhaResult ? 'Verified ✓' : 'Link / Verify ABHA'}
              </button>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="First Name"
                placeholder="e.g. Rahul or Eleanor"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
              <Input
                label="Last Name"
                placeholder="e.g. Sharma or Vance"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>

            {/* Demographics: Gender, DOB, Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Gender
                </label>
                <Select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as 'Male' | 'Female' | 'Other' })}
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                />
              </div>

              <div>
                <Input
                  type="date"
                  label="Date of Birth"
                  value={formData.dob}
                  onChange={e => setFormData({ ...formData, dob: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1.5">
                  Blood Group
                </label>
                <Select
                  value={formData.bloodGroup}
                  onChange={e => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                  options={BLOOD_GROUPS.map(bg => ({ label: bg, value: bg }))}
                />
              </div>
            </div>

            {/* Contact Information: Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Mobile Phone Number"
                placeholder="e.g. +91 98201 44521"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                leftIcon={<Phone className="w-4 h-4 text-blue-400" />}
                required
              />
              <Input
                type="email"
                label="Email Address (Optional)"
                placeholder="patient@example.com"
                value={formData.email || ''}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
              />
            </div>

            {/* Residential Address */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="sm:col-span-2">
                <Input
                  label="Address / Street"
                  placeholder="e.g. Flat 402, Sea Breeze Heights"
                  value={formData.address || ''}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  leftIcon={<MapPin className="w-4 h-4 text-text-muted" />}
                />
              </div>
              <div>
                <Input
                  label="City"
                  placeholder="City"
                  value={formData.city || ''}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
            </div>

            {/* Emergency Contact & Allergies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Emergency Contact (Name & Phone)"
                placeholder="e.g. Sunita Sharma (+91 98201 44522)"
                value={formData.emergencyContactName || ''}
                onChange={e => setFormData({ ...formData, emergencyContactName: e.target.value })}
              />
              <Input
                label="Known Drug Allergies (Optional)"
                placeholder="e.g. Penicillin, Sulfa, Peanuts"
                value={formData.allergies || ''}
                onChange={e => setFormData({ ...formData, allergies: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full py-3 mt-2 font-semibold shadow-glow-primary"
              isLoading={isSubmitting}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Register & Open Patient Portal
            </Button>
          </form>

          {/* Already have an MRN? */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs text-text-muted">
            <span>Already have an MRN or registered phone?</span>
            <Link
              to="/portal/login"
              className="text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Patient Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Security & Regulatory Badges */}
          <div className="mt-5 pt-3 border-t border-white/[0.04] flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-text-muted flex-wrap">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-status-success shrink-0" />
              <span>HIPAA Compliant</span>
            </span>
            <span className="text-white/20">•</span>
            <span>Instant MRN Generation</span>
            <span className="text-white/20">•</span>
            <span>256-Bit Encrypted EHR</span>
          </div>

        </GlassCard>
      </div>

      <AbhaVerificationModal
        isOpen={showAbhaModal}
        onClose={() => setShowAbhaModal(false)}
        patientName={`${formData.firstName} ${formData.lastName}`.trim() || 'Valued Patient'}
        patientPhone={formData.phone}
        onSuccess={(result) => {
          setAbhaResult(result);
          setFormData(prev => ({
            ...prev,
            abhaId: result.abhaNumber
          }));
          showToast(`ABHA ID ${result.abhaNumber} linked successfully!`, 'success', 'ABHA Verified');
        }}
      />
    </div>
  );
};
