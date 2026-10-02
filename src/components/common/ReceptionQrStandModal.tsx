import React from 'react';
import { 
  QrCode, 
  Printer, 
  ExternalLink, 
  X, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  Building2,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ReceptionQrStandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceptionQrStandModal: React.FC<ReceptionQrStandModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#090D16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-primary/20 text-accent-primary">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reception Desk QR Stand</h3>
              <p className="text-[11px] text-white/50">Print or display this counter stand for walk-in patient self check-in</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Counter Stand */}
        <div className="p-6 flex flex-col items-center">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border-4 border-slate-900/10 flex flex-col items-center text-center relative overflow-hidden print:border-none print:shadow-none print:p-0">
            {/* Top hospital banner */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                +
              </div>
              <span className="font-extrabold tracking-tight text-slate-900 text-lg">
                MEDICORE <span className="text-blue-600 font-normal">HOSPITAL</span>
              </span>
            </div>

            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase mb-5 border border-blue-200">
              Smart Counter Check-In
            </span>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mb-2">
              Scan to Join OPD Queue
            </h2>
            <p className="text-xs text-slate-600 mb-6 max-w-xs leading-relaxed">
              Point your smartphone camera at the QR code below to receive your instant digital token and avoid standing in line.
            </p>

            {/* High-Contrast SVG QR Code Representation */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-md mb-6 relative group">
              <svg 
                className="w-48 h-48" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* QR Background & Pattern */}
                <rect width="100" height="100" fill="white" />
                
                {/* Position Detection Squares */}
                {/* Top Left */}
                <rect x="5" y="5" width="26" height="26" rx="4" fill="#0F172A" />
                <rect x="9" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="13" width="10" height="10" rx="2" fill="#2563EB" />

                {/* Top Right */}
                <rect x="69" y="5" width="26" height="26" rx="4" fill="#0F172A" />
                <rect x="73" y="9" width="18" height="18" rx="2" fill="white" />
                <rect x="77" y="13" width="10" height="10" rx="2" fill="#2563EB" />

                {/* Bottom Left */}
                <rect x="5" y="69" width="26" height="26" rx="4" fill="#0F172A" />
                <rect x="9" y="73" width="18" height="18" rx="2" fill="white" />
                <rect x="13" y="77" width="10" height="10" rx="2" fill="#2563EB" />

                {/* Data Matrix Dots */}
                <circle cx="42" cy="18" r="3" fill="#0F172A" />
                <circle cx="54" cy="18" r="3" fill="#0F172A" />
                <circle cx="42" cy="30" r="3" fill="#0F172A" />
                <circle cx="58" cy="30" r="3" fill="#2563EB" />
                <circle cx="18" cy="42" r="3" fill="#0F172A" />
                <circle cx="30" cy="42" r="3" fill="#2563EB" />
                <circle cx="42" cy="42" r="3" fill="#0F172A" />
                <circle cx="54" cy="42" r="3" fill="#0F172A" />
                <circle cx="70" cy="42" r="3" fill="#0F172A" />
                <circle cx="82" cy="42" r="3" fill="#0F172A" />
                <circle cx="18" cy="54" r="3" fill="#0F172A" />
                <circle cx="34" cy="54" r="3" fill="#0F172A" />
                <circle cx="50" cy="54" r="3" fill="#2563EB" />
                <circle cx="66" cy="54" r="3" fill="#0F172A" />
                <circle cx="82" cy="54" r="3" fill="#0F172A" />
                <circle cx="42" cy="70" r="3" fill="#0F172A" />
                <circle cx="54" cy="70" r="3" fill="#2563EB" />
                <circle cx="42" cy="82" r="3" fill="#0F172A" />
                <circle cx="54" cy="82" r="3" fill="#0F172A" />
                <circle cx="70" cy="82" r="3" fill="#0F172A" />
                <circle cx="82" cy="82" r="3" fill="#2563EB" />
                <circle cx="70" cy="70" r="3" fill="#0F172A" />
                <circle cx="82" cy="70" r="3" fill="#0F172A" />
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-blue-600/90 rounded-2xl transition-opacity">
                <Link
                  to="/checkin"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-lg bg-white text-blue-700 text-xs font-bold shadow-lg flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Test Check-in
                </Link>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-slate-500 text-[11px] font-semibold w-full pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" /> No App Needed
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> 10-Second Check-in
              </span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 pt-0 flex items-center justify-between gap-3">
          <Link
            to="/checkin"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-accent-primary" />
            <span>Open Mobile Self-Check-in (/checkin)</span>
          </Link>

          <button
            onClick={handlePrint}
            className="py-3 px-5 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Stand</span>
          </button>
        </div>
      </div>
    </div>
  );
};
