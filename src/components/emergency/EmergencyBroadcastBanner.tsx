import React from 'react';
import { Siren, Volume2, VolumeX, CheckCircle, ShieldAlert } from 'lucide-react';
import { useEmergencyAlert } from '../../context/EmergencyAlertContext';
import { useAuth } from '../../context/AuthContext';

export const EmergencyBroadcastBanner: React.FC = () => {
  const { activeAlert, resolveEmergency, acknowledgeEmergency, isMuted, toggleMute } = useEmergencyAlert();
  const { user } = useAuth();

  if (!activeAlert || !activeAlert.isActive) return null;

  const isCodeBlue = activeAlert.type === 'CODE_BLUE';
  const isCodeRed = activeAlert.type === 'CODE_RED';
  const isCodeYellow = activeAlert.type === 'CODE_YELLOW';

  const hasAcknowledged = user?.name ? activeAlert.acknowledgedBy?.includes(user.name) : false;

  const bgGradient = isCodeBlue
    ? 'from-blue-700 via-indigo-700 to-blue-900 border-blue-400'
    : isCodeRed
    ? 'from-red-700 via-rose-700 to-red-900 border-red-400'
    : 'from-amber-600 via-orange-600 to-amber-800 border-amber-400';

  const codeLabel = isCodeBlue
    ? 'CODE BLUE — CARDIAC ARREST / MEDICAL RESUSCITATION'
    : isCodeRed
    ? 'CODE RED — FIRE / RAPID EVACUATION PROTOCOL'
    : isCodeYellow
    ? 'CODE YELLOW — MASS CASUALTY / TRAUMA DISASTER'
    : 'CODE PINK — INFANT/PEDIATRIC SECURITY EMERGENCY';

  return (
    <aside 
      aria-label="Emergency System Broadcast"
      className={`relative z-50 px-4 py-2.5 bg-gradient-to-r ${bgGradient} text-white border-b-2 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-pulse`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md shrink-0">
          <Siren className="w-5 h-5 text-white animate-spin" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-black tracking-wider uppercase bg-white/25 px-2 py-0.5 rounded">
              {codeLabel}
            </span>
            <span className="text-xs font-semibold underline decoration-white/50">
              📍 {activeAlert.location}
            </span>
            <span className="text-[11px] opacity-80">
              Logged at {activeAlert.timestamp} by {activeAlert.reportedBy}
            </span>
          </div>
          {activeAlert.notes && (
            <p className="text-xs text-white/90 truncate mt-0.5 font-medium">
              Note: {activeAlert.notes}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={toggleMute}
          className="p-1.5 rounded-lg bg-black/25 hover:bg-black/40 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1"
          title={isMuted ? 'Unmute alert siren' : 'Mute siren sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-red-200" /> : <Volume2 className="w-4 h-4" />}
          <span className="text-[11px]">{isMuted ? 'Muted' : 'Siren'}</span>
        </button>

        {!hasAcknowledged && (
          <button
            onClick={() => acknowledgeEmergency(user?.name || 'Staff')}
            className="px-3 py-1 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-white/90 shadow-md transition-all flex items-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            Acknowledge & Responding
          </button>
        )}

        <button
          onClick={resolveEmergency}
          className="px-3 py-1 rounded-xl bg-black/35 hover:bg-black/50 text-white font-semibold text-xs border border-white/20 transition-all"
        >
          Stand Down / Clear Code
        </button>
      </div>
    </aside>
  );
};
