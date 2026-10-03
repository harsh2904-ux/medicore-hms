import React, { createContext, useContext, useState, useEffect } from 'react';

export type EmergencyCodeType = 'CODE_BLUE' | 'CODE_RED' | 'CODE_YELLOW' | 'CODE_PINK';

export interface EmergencyAlert {
  id: string;
  type: EmergencyCodeType;
  title: string;
  location: string;
  reportedBy: string;
  timestamp: string;
  notes?: string;
  isActive: boolean;
  acknowledgedBy?: string[];
}

interface EmergencyAlertContextType {
  activeAlert: EmergencyAlert | null;
  triggerEmergency: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'isActive' | 'acknowledgedBy'>) => void;
  resolveEmergency: () => void;
  acknowledgeEmergency: (userName: string) => void;
  isMuted: boolean;
  toggleMute: () => void;
}

const EmergencyAlertContext = createContext<EmergencyAlertContextType | undefined>(undefined);

const EMERGENCY_STORAGE_KEY = 'medicore_active_emergency';

export const EmergencyAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAlert, setActiveAlert] = useState<EmergencyAlert | null>(() => {
    try {
      const stored = localStorage.getItem(EMERGENCY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (activeAlert) {
      localStorage.setItem(EMERGENCY_STORAGE_KEY, JSON.stringify(activeAlert));
      
      // Play emergency siren using Web Audio API if not muted
      if (!isMuted) {
        try {
          playEmergencySiren();
        } catch {
          // ignore autoplay policy blocks
        }
      }
    } else {
      localStorage.removeItem(EMERGENCY_STORAGE_KEY);
    }
  }, [activeAlert, isMuted]);

  const playEmergencySiren = () => {
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';

      const now = ctx.currentTime;
      // High-low alternating frequency siren
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.6);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.9);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // Audio autoplay might be suspended
    }
  };

  const triggerEmergency = (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'isActive' | 'acknowledgedBy'>) => {
    const newAlert: EmergencyAlert = {
      ...alertData,
      id: `ER-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isActive: true,
      acknowledgedBy: [],
    };
    setActiveAlert(newAlert);
  };

  const resolveEmergency = () => {
    setActiveAlert(null);
  };

  const acknowledgeEmergency = (userName: string) => {
    if (!activeAlert) return;
    const currentAck = activeAlert.acknowledgedBy || [];
    if (!currentAck.includes(userName)) {
      setActiveAlert({
        ...activeAlert,
        acknowledgedBy: [...currentAck, userName],
      });
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <EmergencyAlertContext.Provider
      value={{
        activeAlert,
        triggerEmergency,
        resolveEmergency,
        acknowledgeEmergency,
        isMuted,
        toggleMute,
      }}
    >
      {children}
    </EmergencyAlertContext.Provider>
  );
};

export const useEmergencyAlert = () => {
  const context = useContext(EmergencyAlertContext);
  if (!context) {
    throw new Error('useEmergencyAlert must be used within an EmergencyAlertProvider');
  }
  return context;
};
