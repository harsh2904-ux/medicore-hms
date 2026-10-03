import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, ShieldAlert, X, Check, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { ClinicalSafetyReport } from '../../utils/clinicalSafetyEngine';

interface ClinicalSafetyAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ClinicalSafetyReport | null;
  onOverride: (rationale: string) => void;
}

export const ClinicalSafetyAlertModal: React.FC<ClinicalSafetyAlertModalProps> = ({
  isOpen,
  onClose,
  report,
  onOverride,
}) => {
  const [rationale, setRationale] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setRationale('');
      setError('');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !report || !report.hasAlert) return null;

  const handleConfirmOverride = () => {
    if (rationale.trim().length < 8) {
      setError('Please provide a valid clinical rationale (minimum 8 characters) to override this safety alert.');
      return;
    }
    onOverride(rationale.trim());
    onClose();
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-2xl bg-[#0F131A] text-text-primary rounded-2xl border border-status-danger/40 shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95">
        {/* Header Banner */}
        <div className="flex items-center justify-between px-6 py-4 bg-status-danger/15 border-b border-status-danger/30 text-status-danger">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-status-danger/20 text-status-danger border border-status-danger/30">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                Clinical Safety Guard Triggered
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-danger text-white uppercase font-mono font-bold tracking-wider">
                  High Risk
                </span>
              </h3>
              <p className="text-xs text-status-danger/90">
                Potential Adverse Drug Event (ADE) or Contraindication detected
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

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Allergy Alerts */}
          {report.allergyAlerts.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-status-danger flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Patient Allergy Conflict
              </span>
              {report.allergyAlerts.map((alert, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-status-danger/10 border border-status-danger/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {alert.matchedMedication} ⚡ Documented Allergy: {alert.substance.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-status-danger/20 text-status-danger">
                      {alert.severity}
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <strong className="text-white">Reaction Risk:</strong> {alert.reaction}
                  </div>
                  <div className="text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/20">
                    <strong>Suggested Alternatives:</strong> {alert.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DDI Alerts */}
          {report.ddiAlerts.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Drug-Drug Interaction (DDI)
              </span>
              {report.ddiAlerts.map((ddi, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">
                      {ddi.drugA} ⟷ {ddi.drugB}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {ddi.severity} INTERACTION
                    </span>
                  </div>
                  <div className="text-xs text-text-secondary leading-relaxed">
                    <strong className="text-white">Mechanism:</strong> {ddi.mechanism}
                  </div>
                  <div className="text-xs text-amber-200">
                    <strong className="text-amber-400">Clinical Consequence:</strong> {ddi.clinicalConsequence}
                  </div>
                  <div className="text-xs text-text-muted bg-white/[0.04] p-2.5 rounded-lg border border-white/[0.06]">
                    <strong className="text-white">Guidance:</strong> {ddi.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mandatory Clinical Override Section */}
          <div className="pt-3 border-t border-white/[0.08] space-y-2">
            <label className="block text-xs font-medium text-text-secondary">
              Physician Override Rationale <span className="text-status-danger">*</span> (Required if proceeding)
            </label>
            <input
              type="text"
              value={rationale}
              onChange={(e) => {
                setRationale(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Benefits outweigh risk; patient under continuous telemetry observation; co-prescribing PPI"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.12] text-white text-xs placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
            />
            {error && (
              <p className="text-[11px] text-status-danger font-medium">{error}</p>
            )}
            <p className="text-[10px] text-text-muted">
              Note: Clinical overrides are cryptographically logged in the NABH/HIPAA immutable clinical audit trail with your timestamp and practitioner ID.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/[0.08]">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel / Select Alternative
          </Button>

          <Button
            variant="danger"
            size="sm"
            onClick={handleConfirmOverride}
            leftIcon={<Check className="w-4 h-4" />}
          >
            Override & Add to Prescription
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
