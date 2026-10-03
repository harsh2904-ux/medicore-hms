import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Siren, AlertTriangle, Flame, ShieldAlert, Baby, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useEmergencyAlert, EmergencyCodeType } from '../../context/EmergencyAlertContext';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

interface TriggerEmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TriggerEmergencyModal: React.FC<TriggerEmergencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { triggerEmergency } = useEmergencyAlert();
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [codeType, setCodeType] = useState<EmergencyCodeType>('CODE_BLUE');
  const [location, setLocation] = useState('ICU Bay 3 (Tower A, 3rd Floor)');
  const [notes, setNotes] = useState('Unresponsive adult patient, CPR in progress');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim()) return;

    triggerEmergency({
      type: codeType,
      title: codeType === 'CODE_BLUE' ? 'Cardiac Arrest Resuscitation' : codeType === 'CODE_RED' ? 'Fire Emergency' : 'Hospital Disaster',
      location: location.trim(),
      reportedBy: user?.name ? `${user.name} (${user.role})` : 'ER Control Desk',
      notes: notes.trim(),
    });

    showToast(`Emergency Broadcast Initiated: ${codeType}`, 'warning', 'Emergency Protocol Active');
    onClose();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-lg bg-[#0F131A] text-text-primary rounded-2xl border border-status-danger/50 shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-status-danger/20 border-b border-status-danger/30 text-status-danger">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-danger/30 text-white animate-pulse">
              <Siren className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white tracking-tight">Hospital-Wide Emergency Broadcast</h3>
              <p className="text-xs text-status-danger/90">Instant alert notification across all clinical staff terminals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBroadcast} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              Select Emergency Code Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setCodeType('CODE_BLUE');
                  setNotes('Unresponsive patient, CPR initiated');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  codeType === 'CODE_BLUE'
                    ? 'bg-blue-600/20 border-blue-500 text-blue-400 ring-2 ring-blue-500/30 font-bold'
                    : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <ShieldAlert className="w-4 h-4 text-blue-400" />
                  <span className="text-xs">CODE BLUE</span>
                </div>
                <div className="text-[11px] text-text-muted">Cardiac Arrest / Resuscitation</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCodeType('CODE_RED');
                  setNotes('Smoke detected, assemble fire response team');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  codeType === 'CODE_RED'
                    ? 'bg-red-600/20 border-red-500 text-red-400 ring-2 ring-red-500/30 font-bold'
                    : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-xs">CODE RED</span>
                </div>
                <div className="text-[11px] text-text-muted">Fire & Evacuation</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCodeType('CODE_YELLOW');
                  setNotes('Highway multi-vehicle accident trauma incoming');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  codeType === 'CODE_YELLOW'
                    ? 'bg-amber-600/20 border-amber-500 text-amber-400 ring-2 ring-amber-500/30 font-bold'
                    : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span className="text-xs">CODE YELLOW</span>
                </div>
                <div className="text-[11px] text-text-muted">Mass Casualty / Disaster</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCodeType('CODE_PINK');
                  setNotes('Pediatric ward perimeter lockdown protocol');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  codeType === 'CODE_PINK'
                    ? 'bg-pink-600/20 border-pink-500 text-pink-400 ring-2 ring-pink-500/30 font-bold'
                    : 'bg-white/[0.03] border-white/[0.08] text-text-secondary hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Baby className="w-4 h-4 text-pink-400" />
                  <span className="text-xs">CODE PINK</span>
                </div>
                <div className="text-[11px] text-text-muted">Pediatric Security</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Exact Location / Room / Bay <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. ICU Bed 04 (Tower A, 3rd Floor)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white text-xs placeholder-text-muted focus:border-status-danger focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Clinical Context / Specific Directives
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide briefing notes for responding doctors, crash cart team, or security..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white text-xs placeholder-text-muted focus:border-status-danger focus:outline-none transition-colors"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="sm"
              leftIcon={<Siren className="w-4 h-4 animate-spin" />}
            >
              Broadcast Immediate Alert
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
