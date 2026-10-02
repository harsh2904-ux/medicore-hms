import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Smartphone, 
  Sparkles, 
  CreditCard, 
  Lock, 
  X, 
  ArrowRight, 
  RefreshCw,
  Award
} from 'lucide-react';

export interface AbhaVerificationResult {
  abhaNumber: string;
  abhaAddress: string;
  isVerified: boolean;
  linkedAadhaarLast4: string;
}

interface AbhaVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientPhone?: string;
  onSuccess: (result: AbhaVerificationResult) => void;
}

export const AbhaVerificationModal: React.FC<AbhaVerificationModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientPhone = '',
  onSuccess
}) => {
  const [step, setStep] = useState<'INPUT' | 'OTP' | 'VERIFIED'>('INPUT');
  const [aadhaarNumber, setAadhaarNumber] = useState('5482 9182 4012');
  const [otp, setOtp] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedAbhaNumber, setGeneratedAbhaNumber] = useState('');
  const [generatedAbhaAddress, setGeneratedAbhaAddress] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNumber.replace(/\s/g, '').length !== 12) {
      alert('Please enter a valid 12-digit Aadhaar number');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('OTP');
      setOtp('782910'); // Pre-fill mock OTP for smooth testing
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      // Generate standard Indian 14-digit ABHA ID format: XX-XXXX-XXXX-XXXX
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const abhaNum = `91-4820-9182-${randomSuffix}`;
      const slug = patientName ? patientName.toLowerCase().replace(/[^a-z0-9]/g, '.') : 'patient';
      const abhaAddr = `${slug}@abdm`;

      setGeneratedAbhaNumber(abhaNum);
      setGeneratedAbhaAddress(abhaAddr);
      setStep('VERIFIED');
    }, 1000);
  };

  const handleComplete = () => {
    onSuccess({
      abhaNumber: generatedAbhaNumber,
      abhaAddress: generatedAbhaAddress,
      isVerified: true,
      linkedAadhaarLast4: aadhaarNumber.replace(/\s/g, '').slice(-4)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-[#0D121F] border border-orange-500/20 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top Header with ABDM Trilateral Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500/20 via-white/10 to-emerald-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    ABHA Digital Health ID
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    ABDM M1
                  </span>
                </div>
                <p className="text-xs text-white/50">
                  Ayushman Bharat Digital Mission (National Health Authority)
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* STEP 1: AADHAAR INPUT */}
          {step === 'INPUT' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-xs text-orange-200/90 leading-relaxed flex items-start gap-3">
                <Award className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-orange-300">Instant Government Health Identity</strong>
                  <p className="text-[11px] text-orange-200/70 mt-0.5">
                    Generate or link patient's 14-digit ABHA Number via Aadhaar OTP to enable cashless PM-JAY and national health record exchange.
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 mb-1.5 flex items-center justify-between">
                  <span>Patient 12-Digit Aadhaar Number</span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> UIDAI Encrypted
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={e => setAadhaarNumber(e.target.value)}
                    required
                    maxLength={14}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-base text-white font-mono tracking-widest placeholder-white/20 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                  <CreditCard className="w-4 h-4 text-white/30 absolute right-4 top-3.5" />
                </div>
                <p className="text-[11px] text-white/40 mt-1">
                  Linking for: <strong className="text-white/80">{patientName || 'Current Patient'}</strong>
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Connecting to NHA Gateway...
                    </>
                  ) : (
                    <>
                      <span>Send 6-Digit Aadhaar OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 'OTP' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-xs text-blue-200/90 leading-relaxed flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300">OTP Sent Successfully</strong>
                  <p className="text-[11px] text-blue-200/70 mt-0.5">
                    Enter the 6-digit Aadhaar verification OTP dispatched to registered mobile number ending in **4012.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-white/70">Aadhaar 6-Digit OTP</label>
                  <span className="text-[10px] text-accent-primary font-mono">(Simulation Code: 782910)</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-lg text-center tracking-[0.5em] font-mono text-white placeholder-white/20 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-white/40">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => setOtp('782910')}
                  className="text-orange-400 hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing || otp.length < 6}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Verifying with UIDAI & NHA...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Verify & Generate ABHA ID
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: VERIFIED ABHA CARD DISPLAY */}
          {step === 'VERIFIED' && (
            <div className="space-y-5 animate-in fade-in zoom-in-95">
              {/* Digital Holographic Card */}
              <div className="relative rounded-2xl p-5 bg-gradient-to-br from-[#121927] via-[#1a2336] to-[#0f172a] border border-orange-500/30 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-500/20 to-transparent rounded-full blur-2xl" />

                <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-white tracking-widest uppercase">
                      National Health Authority
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    ABHA CARD
                  </span>
                </div>

                <div className="relative z-10 space-y-3">
                  <div>
                    <span className="text-[10px] text-white/50 uppercase tracking-wider block">Patient Name</span>
                    <h4 className="text-base font-bold text-white">{patientName}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block">ABHA Number</span>
                      <span className="text-sm font-bold font-mono text-orange-300">{generatedAbhaNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block">ABHA Address</span>
                      <span className="text-xs font-mono text-emerald-300">{generatedAbhaAddress}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[10px] text-white/60 border-t border-white/5">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      ABDM Milestone 1 Verified
                    </span>
                    <span>UIDAI: Linked</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleComplete}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>Link Verified ABHA ID to Patient Registration</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
