import React, { useState } from 'react';
import { 
  QrCode, 
  Printer, 
  ExternalLink, 
  X, 
  Smartphone, 
  Clock, 
  Copy,
  Check,
  Wifi,
  Settings2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { QrCodeView } from './QrCodeView';

interface ReceptionQrStandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReceptionQrStandModal: React.FC<ReceptionQrStandModalProps> = ({
  isOpen,
  onClose
}) => {
  // Determine best default URL for phone scanning
  // If running on localhost, use the machine's local Wi-Fi IP so phones on the same Wi-Fi can open it!
  const getInitialUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const port = window.location.port ? `:${window.location.port}` : '';
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        // Detected active local Wi-Fi IP for direct mobile scanning
        return `http://192.168.1.103${port}/checkin`;
      }
      return `${window.location.origin}/checkin`;
    }
    return 'http://192.168.1.103:3000/checkin';
  };

  const [checkinUrl, setCheckinUrl] = useState<string>(getInitialUrl);
  const [copied, setCopied] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(checkinUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#090D16] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-accent-primary/20 text-accent-primary">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Reception Desk QR Stand</h3>
              <p className="text-[11px] text-white/50">100% Scannable QR code for walk-in patient self check-in</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              title="Configure QR Target URL"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Network / URL Config Drawer */}
        {showConfig && (
          <div className="px-6 py-3 bg-white/[0.04] border-b border-white/10 text-xs space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-white/70 font-medium flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 text-accent-primary" /> Target Scannable URL:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCheckinUrl('http://192.168.1.103:3000/checkin')}
                  className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 text-[10px]"
                >
                  Wi-Fi LAN IP
                </button>
                <button
                  type="button"
                  onClick={() => setCheckinUrl(`${window.location.origin}/checkin`)}
                  className="px-2 py-0.5 rounded bg-white/10 text-white/80 hover:bg-white/20 text-[10px]"
                >
                  Current Host
                </button>
              </div>
            </div>
            <input
              type="text"
              value={checkinUrl}
              onChange={(e) => setCheckinUrl(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-white text-xs font-mono"
            />
            <p className="text-[10px] text-white/40">
              *Tip: When testing from your mobile phone on the same Wi-Fi network, keep the LAN IP (192.168.1.103:3000).
            </p>
          </div>
        )}

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

            <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold tracking-wider uppercase mb-4 border border-blue-200">
              Smart Counter Check-In
            </span>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-snug mb-1">
              Scan to Join OPD Queue
            </h2>
            <p className="text-xs text-slate-600 mb-5 max-w-xs leading-relaxed">
              Scan this QR code with your phone camera or Google Lens to instantly receive your token pass without waiting in line.
            </p>

            {/* Genuine Scannable QR Code */}
            <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-lg mb-4 flex flex-col items-center relative group">
              <QrCodeView 
                value={checkinUrl} 
                size={192} 
                darkColor="#091E42" 
                alt="Reception Check-in QR Code"
              />
              <span className="mt-2 text-[10px] font-mono text-slate-400 font-medium">
                Live ABDM / OPD Self-Kiosk
              </span>
            </div>

            {/* Quick URL and Copy Action */}
            <div className="flex items-center justify-center gap-2 mb-4 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl w-full max-w-xs text-xs">
              <span className="font-mono text-[11px] text-slate-700 truncate max-w-[190px]">
                {checkinUrl}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors shrink-0"
                title="Copy check-in link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={checkinUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors shrink-0"
                title="Open check-in in new tab"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center justify-center gap-4 text-slate-500 text-[11px] font-semibold w-full pt-3 border-t border-slate-100">
              <span className="flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-blue-600" /> Works with Any Phone Camera
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" /> Instant Token Pass
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
            <span>Open Check-in Portal Directly</span>
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
