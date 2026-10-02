import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MessageSquare, 
  Send, 
  CheckCheck, 
  Smartphone, 
  Radio, 
  Clock, 
  ShieldCheck, 
  X,
  Phone,
  User,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  communicationService, 
  MessageLog, 
  openWhatsAppDirect 
} from '../../services/communicationService';

interface SmsWhatsAppDispatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPhone?: string;
  defaultRecipientName?: string;
}

export const SmsWhatsAppDispatchModal: React.FC<SmsWhatsAppDispatchModalProps> = ({
  isOpen,
  onClose,
  defaultPhone = '',
  defaultRecipientName = ''
}) => {
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [channel, setChannel] = useState<'WHATSAPP' | 'SMS'>('WHATSAPP');
  const [recipientPhone, setRecipientPhone] = useState(defaultPhone || '+91 98765 43210');
  const [recipientName, setRecipientName] = useState(defaultRecipientName || 'Rahul Sharma');
  const [messageText, setMessageText] = useState(
    '🏥 MediCore Hospital: Your appointment is scheduled for today at 11:30 AM with Dr. Sarah Jenkins (Cardiology). Queue Token #OPD-04. Please arrive 10 minutes prior.'
  );
  const [autoOpenWa, setAutoOpenWa] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLogs(communicationService.getLogs());
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientPhone || !messageText) return;

    setIsSending(true);
    await new Promise(r => setTimeout(r, 400)); // simulate gateway roundtrip

    const newLog = await communicationService.sendCustomAlert(
      channel,
      recipientPhone,
      recipientName,
      messageText,
      channel === 'WHATSAPP' ? 'WhatsApp Clinical Notification' : 'SMS Priority Alert',
      channel === 'WHATSAPP' && autoOpenWa
    );

    setLogs(communicationService.getLogs());
    setIsSending(false);
    setSuccessToast(
      `Dispatched to ${newLog.recipient}! ${channel === 'WHATSAPP' && autoOpenWa ? '(WhatsApp opened in new tab)' : ''}`
    );
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleOpenDirectChat = () => {
    if (!recipientPhone || !messageText) return;
    openWhatsAppDirect(recipientPhone, messageText);
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Screen-Wide High-Opacity Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-4xl bg-[#0B0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10 my-auto animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-transparent to-blue-500/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-white">SMS & WhatsApp Gateway</h3>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                  Live Gateways & wa.me Ready
                </span>
              </div>
              <p className="text-xs text-white/50">
                Gupshup WhatsApp Business API, Instant wa.me Web Chat & Fast2SMS Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successToast && (
          <div className="mx-6 mt-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in shrink-0">
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Dispatch Message Form (Left 5 Cols) */}
          <form onSubmit={handleSend} className="md:col-span-5 p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-4 bg-white/[0.01] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setChannel('WHATSAPP')}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  channel === 'WHATSAPP'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                WhatsApp (wa.me)
              </button>
              <button
                type="button"
                onClick={() => setChannel('SMS')}
                className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all ${
                  channel === 'SMS'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30 font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                SMS (Fast2SMS)
              </button>
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                <User className="w-3 h-3 text-white/40" />
                Patient Name
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-primary"
                placeholder="e.g. Rahul Sharma"
              />
            </div>

            <div>
              <label className="text-xs text-white/60 mb-1 flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-white/40" />
                Mobile Number (e.g. +91 98765 43210)
              </label>
              <input
                type="text"
                value={recipientPhone}
                onChange={e => setRecipientPhone(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-accent-primary font-mono"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="flex-1 flex flex-col min-h-[140px]">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-white/60">Message Template / Body</label>
                <button
                  type="button"
                  onClick={() =>
                    setMessageText(
                      `🏥 MediCore Hospital: Dear ${recipientName}, your Appointment is confirmed for today at 11:30 AM with Dr. Sarah Jenkins (Cardiology). Your Queue Token is #OPD-05.`
                    )
                  }
                  className="text-[10px] text-accent-primary hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Load Token Template
                </button>
              </div>
              <textarea
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                rows={4}
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent-primary resize-none flex-1 leading-relaxed"
                placeholder="Enter alert text..."
              />
            </div>

            {channel === 'WHATSAPP' && (
              <label className="flex items-center gap-2 cursor-pointer text-xs text-white/80 select-none">
                <input
                  type="checkbox"
                  checked={autoOpenWa}
                  onChange={e => setAutoOpenWa(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 bg-white/10 border-white/20 focus:ring-0"
                />
                <span>Automatically open WhatsApp Web / App on send</span>
              </label>
            )}

            <div className="flex gap-2 pt-1">
              <button
                type="submit"
                disabled={isSending}
                className={`flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                  channel === 'WHATSAPP'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                } disabled:opacity-50 cursor-pointer`}
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? 'Transmitting...' : `Send ${channel === 'WHATSAPP' ? 'WhatsApp' : 'SMS'} Alert`}
              </button>

              {channel === 'WHATSAPP' && (
                <button
                  type="button"
                  onClick={handleOpenDirectChat}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-400 font-medium text-xs flex items-center justify-center gap-1.5 border border-emerald-500/30 transition-all cursor-pointer"
                  title="Directly launch WhatsApp Web with this message"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open wa.me</span>
                </button>
              )}
            </div>
          </form>

          {/* Outgoing Message Logs (Right 7 Cols) */}
          <div className="md:col-span-7 p-6 flex flex-col gap-4 overflow-y-auto bg-black/20">
            <div className="flex items-center justify-between shrink-0">
              <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-white/40" />
                Gateway Message Logs ({logs.length})
              </h4>
              <span className="text-[11px] text-white/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                TRAI DLT & Meta Compliant
              </span>
            </div>

            <div className="space-y-3 overflow-y-auto pr-1">
              {logs.map(log => (
                <div
                  key={log.id}
                  className="p-3.5 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-all flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md uppercase tracking-wider ${
                          log.channel === 'WHATSAPP'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {log.channel}
                      </span>
                      <span className="text-xs font-medium text-white">{log.recipientName}</span>
                      <span className="text-xs text-white/40 font-mono">({log.recipient})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {log.channel === 'WHATSAPP' && (
                        <button
                          type="button"
                          onClick={() => openWhatsAppDirect(log.recipient, log.body)}
                          className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium flex items-center gap-1 transition-colors"
                          title="Open this conversation in WhatsApp"
                        >
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>Chat (wa.me)</span>
                        </button>
                      )}
                      <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>{log.status}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-white/75 bg-black/40 p-2.5 rounded-lg border border-white/5 font-sans leading-relaxed whitespace-pre-line">
                    {log.body}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-white/40 pt-1 border-t border-white/5">
                    <span>Provider: <strong className="text-white/60">{log.provider}</strong></span>
                    {log.tokenNumber && (
                      <span className="px-1.5 py-0.5 rounded bg-accent-primary/20 text-accent-primary border border-accent-primary/30 font-mono">
                        Token #{log.tokenNumber}
                      </span>
                    )}
                    <span>{new Date(log.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalNode, document.body)
    : modalNode;
};
