import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  User, 
  Clock, 
  CheckSquare, 
  Square,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Bed } from '../../types/operations';

interface BedSanitizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bed: Bed | null;
  onCompleteSanitization: (bedId: string, housekeeperName: string, notes: string) => void;
}

export const BedSanitizationModal: React.FC<BedSanitizationModalProps> = ({
  isOpen,
  onClose,
  bed,
  onCompleteSanitization,
}) => {
  const [housekeeperName, setHousekeeperName] = useState('Sunil Verma (Ward Housekeeper #04)');
  const [checklist, setChecklist] = useState({
    linenReplaced: true,
    railsDisinfected: true,
    uvcCycleDone: true,
    biohazardCleared: true,
    freshLinenFitted: true,
  });
  const [notes, setNotes] = useState('Terminal disinfection verified. Sterile package sealed.');

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

  if (!isOpen || !bed) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    if (!allChecked) return;
    onCompleteSanitization(bed.id, housekeeperName, notes);
    onClose();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-lg bg-[#0F131A] text-text-primary rounded-3xl border border-status-warning/40 shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-status-warning/15 border-b border-status-warning/30 text-status-warning">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-warning/20 text-status-warning border border-status-warning/30">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Bed Terminal Sanitization & Sterilization
              </h3>
              <p className="text-xs text-status-warning/90">
                {bed.bedNumber} ({bed.wardName} • {bed.floor})
              </p>
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
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
              Assigned Housekeeping Lead
            </label>
            <input
              type="text"
              value={housekeeperName}
              onChange={(e) => setHousekeeperName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs"
            />
          </div>

          {/* NABH Sterilization Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Infection Control Checklist (NABH Protocol)
              </span>
              <span className="text-[10px] font-mono text-status-warning">Mandatory All Check</span>
            </div>

            <div className="space-y-2">
              <div 
                onClick={() => toggleCheck('linenReplaced')}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer flex items-center gap-3 transition-colors"
              >
                {checklist.linenReplaced ? (
                  <CheckSquare className="w-4 h-4 text-status-success shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-secondary">
                  Strip & isolate used bed linens into biohazard laundry bags
                </span>
              </div>

              <div 
                onClick={() => toggleCheck('railsDisinfected')}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer flex items-center gap-3 transition-colors"
              >
                {checklist.railsDisinfected ? (
                  <CheckSquare className="w-4 h-4 text-status-success shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-secondary">
                  Chemical wipe-down of bed rails, IV stand, call bell, and mattress
                </span>
              </div>

              <div 
                onClick={() => toggleCheck('uvcCycleDone')}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer flex items-center gap-3 transition-colors"
              >
                {checklist.uvcCycleDone ? (
                  <CheckSquare className="w-4 h-4 text-status-success shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-secondary">
                  15-Minute Terminal UV-C room air and surface sterilizer executed
                </span>
              </div>

              <div 
                onClick={() => toggleCheck('biohazardCleared')}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer flex items-center gap-3 transition-colors"
              >
                {checklist.biohazardCleared ? (
                  <CheckSquare className="w-4 h-4 text-status-success shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-secondary">
                  Biomedical waste and disposable sharps containers emptied
                </span>
              </div>

              <div 
                onClick={() => toggleCheck('freshLinenFitted')}
                className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] cursor-pointer flex items-center gap-3 transition-colors"
              >
                {checklist.freshLinenFitted ? (
                  <CheckSquare className="w-4 h-4 text-status-success shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-text-muted shrink-0" />
                )}
                <span className="text-xs text-text-secondary">
                  Fitted fresh sanitized linen, pillows, and sterile blanket
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1">
              Sanitization Notes & Verification
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs"
            />
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/[0.08]">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>

            <Button
              variant="primary"
              size="sm"
              disabled={!allChecked}
              onClick={handleFinish}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Sign-Off Sanitization & Mark Ready
            </Button>
          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
