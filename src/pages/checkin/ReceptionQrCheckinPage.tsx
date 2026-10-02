import React, { useState } from 'react';
import { 
  QrCode, 
  Smartphone, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Building, 
  Stethoscope, 
  Sparkles, 
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Printer
} from 'lucide-react';
import { communicationService } from '../../services/communicationService';
import { Link } from 'react-router-dom';

export const ReceptionQrCheckinPage: React.FC = () => {
  const [step, setStep] = useState<'FORM' | 'CONFIRMED'>('FORM');
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [department, setDepartment] = useState('General Medicine (OPD)');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Jenkins');
  const [chiefComplaint, setChiefComplaint] = useState('Fever and persistent headache for 2 days');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tokenNumber, setTokenNumber] = useState('');
  const [estimatedWait, setEstimatedWait] = useState(12);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate queue token allocation
    await new Promise(r => setTimeout(r, 900));

    const randomNum = Math.floor(10 + Math.random() * 89);
    const assignedToken = `OPD-${randomNum}`;
    setTokenNumber(assignedToken);
    setEstimatedWait(15);

    // Automatically send WhatsApp & SMS confirmation
    await communicationService.sendAppointmentConfirmation({
      patientName,
      phone,
      doctorName,
      department,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      token: assignedToken
    });

    setIsProcessing(false);
    setStep('CONFIRMED');
  };

  return (
    <div className="min-h-screen bg-[#060911] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Mobile Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between py-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-accent-primary flex items-center justify-center font-bold text-white shadow-lg shadow-accent-primary/30">
            +
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">MediCore Hospital</h1>
            <p className="text-[10px] text-white/50">Reception Smart Check-In</p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Queue Active
        </span>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto w-full my-auto py-6">
        {step === 'FORM' ? (
          <div className="bg-[#0D1322] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent-primary">
                Skip The Reception Desk Line
              </span>
              <h2 className="text-xl font-bold text-white">Express Self Check-in</h2>
              <p className="text-xs text-white/60 leading-relaxed">
                Enter your details to generate your immediate OPD queue token and doctor chamber assignment.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-white/70 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-white/40" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  required
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div>
                <label className="text-xs text-white/70 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-white/40" />
                  Mobile Number (For WhatsApp / SMS Token)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/15 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-white/30 focus:outline-none focus:border-accent-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/70 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-white/40" />
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={e => {
                      setDepartment(e.target.value);
                      if (e.target.value.includes('Cardiology')) setDoctorName('Dr. Sarah Jenkins');
                      else if (e.target.value.includes('Orthopedics')) setDoctorName('Dr. Rajesh Kumar');
                      else setDoctorName('Dr. Sarah Jenkins');
                    }}
                    className="w-full bg-[#121A2F] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-accent-primary"
                  >
                    <option value="General Medicine (OPD)">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/70 mb-1 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-white/40" />
                    Doctor
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    readOnly
                    className="w-full bg-white/5 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white/80 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/70 mb-1 block">Chief Symptoms / Reason</label>
                <textarea
                  value={chiefComplaint}
                  onChange={e => setChiefComplaint(e.target.value)}
                  rows={2}
                  placeholder="Describe what you are feeling..."
                  className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent-primary resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-primary to-blue-600 hover:from-accent-primary/90 hover:to-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xl shadow-accent-primary/30 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Generating Digital Queue Token...</span>
                ) : (
                  <>
                    <span>Confirm & Get Queue Token</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* CONFIRMED TOKEN PASS */
          <div className="space-y-4 animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-br from-[#0E1626] to-[#0A0F1D] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold tracking-wider uppercase inline-block mb-2">
                Check-in Confirmed
              </span>

              <h2 className="text-lg font-bold text-white mb-1">You Are In The Queue!</h2>
              <p className="text-xs text-white/60 mb-5">
                Take a seat in the 1st Floor OPD waiting lounge.
              </p>

              {/* Big Token Display */}
              <div className="bg-black/40 border border-white/10 rounded-2xl p-5 mb-5 shadow-inner">
                <span className="text-[11px] text-white/50 uppercase tracking-widest font-semibold block mb-1">
                  Your Live Queue Token
                </span>
                <span className="text-4xl font-extrabold tracking-tight font-mono text-accent-primary">
                  #{tokenNumber}
                </span>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10 text-left text-xs">
                  <div>
                    <span className="text-white/40 text-[10px] block">Doctor & Chamber</span>
                    <strong className="text-white text-xs">{doctorName}</strong>
                    <span className="text-white/60 text-[10px] block">Room 204</span>
                  </div>
                  <div>
                    <span className="text-white/40 text-[10px] block">Est. Waiting Time</span>
                    <strong className="text-emerald-400 text-xs">~{estimatedWait} Minutes</strong>
                    <span className="text-white/60 text-[10px] block">2 Patients Ahead</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp / SMS confirmation banner */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-left flex items-start gap-2.5 text-xs text-emerald-300">
                <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-200">WhatsApp & SMS Dispatched</strong>
                  <p className="text-[11px] text-emerald-200/70 mt-0.5">
                    We've sent token pass #{tokenNumber} to <span className="font-mono text-white">{phone}</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Token Pass</span>
              </button>

              <Link
                to="/portal/dashboard"
                className="flex-1 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Patient Portal</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center py-3 border-t border-white/10 text-[11px] text-white/40 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>MediCore Digital Hospital Systems • NABH & ABDM Compliant</span>
      </footer>
    </div>
  );
};
