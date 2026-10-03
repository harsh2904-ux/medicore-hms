import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Brain, CheckCircle2, AlertCircle, X, Volume2, ShieldCheck, Heart, Apple } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiMedicalService, AiLabExplanation } from '../../services/aiMedicalService';

interface AiLabExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
  testDate?: string;
  patientName?: string;
}

export const AiLabExplainerModal: React.FC<AiLabExplainerModalProps> = ({
  isOpen,
  onClose,
  reportName,
  testDate,
  patientName,
}) => {
  const [explanation, setExplanation] = useState<AiLabExplanation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLoading(true);
      aiMedicalService.explainLabReport(reportName).then((res) => {
        setExplanation(res);
        setLoading(false);
      });
    } else {
      document.body.style.overflow = 'unset';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, reportName]);

  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window) || !explanation) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToRead = `${explanation.overallSummary}. Key findings: ${explanation.keyFindings.map(k => `${k.parameter} is ${k.patientValue}, which means ${k.plainEnglishMeaning}`).join('. ')}. Dietary advice: ${explanation.dietaryRecommendations.join('. ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  if (!isOpen) return null;

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-200"
      />

      <div className="relative w-full max-w-2xl bg-[#0B0F17] text-text-primary rounded-2xl border border-accent-primary/30 shadow-2xl overflow-hidden my-8 z-10 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-accent-primary/20 via-purple-500/15 to-transparent border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent-primary/20 text-accent-primary border border-accent-primary/30 shadow-lg shadow-accent-primary/20">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">MediCore AI Health Summary</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent-primary/25 text-accent-primary font-bold">
                  Patient Friendly
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {reportName} {testDate && `• ${testDate}`} {patientName && `• ${patientName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {'speechSynthesis' in window && (
              <button
                onClick={handleToggleSpeech}
                className={`p-2 rounded-xl border transition-colors ${
                  isSpeaking
                    ? 'bg-accent-primary text-white border-accent-primary shadow-lg shadow-accent-primary/30'
                    : 'bg-white/[0.04] text-text-muted hover:text-white border-white/[0.08]'
                }`}
                title={isSpeaking ? 'Stop reading' : 'Read aloud with AI voice'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-text-muted hover:text-white hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
              <p className="text-xs text-text-muted animate-pulse font-mono">
                MediCore AI is translating medical terminology into plain English...
              </p>
            </div>
          ) : explanation ? (
            <>
              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-accent-primary/10 border border-accent-primary/25 space-y-2">
                <div className="flex items-center gap-2 text-accent-primary text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" /> Doctor's Perspective in Plain Terms
                </div>
                <p className="text-sm text-text-primary leading-relaxed">
                  {explanation.overallSummary}
                </p>
              </div>

              {/* Key Test Parameters Breakdown */}
              <div className="space-y-2.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
                  Detailed Metric Breakdown
                </span>
                <div className="grid grid-cols-1 gap-2.5">
                  {explanation.keyFindings.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="font-semibold text-white text-xs sm:text-sm">
                          {item.parameter}
                        </span>
                        <div className="flex items-center gap-2 font-mono text-xs">
                          <span className="font-bold text-text-primary">{item.patientValue}</span>
                          <span className="text-[10px] text-text-muted">({item.referenceRange})</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                              item.status === 'NORMAL'
                                ? 'bg-status-success/20 text-status-success border border-status-success/30'
                                : 'bg-status-warning/20 text-status-warning border border-status-warning/30'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        💡 {item.plainEnglishMeaning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dietary and Lifestyle Guidance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <Apple className="w-4 h-4" /> Recommended Nutrition
                  </div>
                  <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                    {explanation.dietaryRecommendations.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-purple-300 text-xs font-semibold">
                    <Heart className="w-4 h-4" /> Recommended Habits
                  </div>
                  <ul className="text-xs text-text-secondary space-y-1.5 list-disc list-inside">
                    {explanation.lifestyleTips.map((l, i) => (
                      <li key={i}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Follow-up advisory */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between text-xs text-text-muted">
                <span>Next Step: {explanation.followUpAdvice}</span>
                <span className="font-mono text-[10px] text-accent-primary">AI Clinical Model v3.4</span>
              </div>
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white/[0.02] border-t border-white/[0.08]">
          <span className="text-[11px] text-text-muted flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-primary" /> Verified by MediCore Clinical Board
          </span>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
};
