import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Tv, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  ArrowLeft, 
  Stethoscope, 
  Clock, 
  UserCheck, 
  Building2, 
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';

interface DisplayQueueItem {
  id: string;
  token: string;
  patientName: string;
  doctorName: string;
  department: string;
  roomNumber: string;
  estimatedWaitMins: number;
}

const INITIAL_NOW_SERVING: DisplayQueueItem = {
  id: 'q-now',
  token: 'OPD-04',
  patientName: 'Rahul S.',
  doctorName: 'Dr. Sarah Jenkins, MD',
  department: 'Cardiology Care',
  roomNumber: 'Room 204',
  estimatedWaitMins: 0,
};

const INITIAL_UPCOMING: DisplayQueueItem[] = [
  { id: 'q-1', token: 'OPD-05', patientName: 'Priya M.', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology Care', roomNumber: 'Room 204', estimatedWaitMins: 5 },
  { id: 'q-2', token: 'OPD-06', patientName: 'Amit K.', doctorName: 'Dr. James Wilson', department: 'General Medicine', roomNumber: 'Room 101', estimatedWaitMins: 12 },
  { id: 'q-3', token: 'OPD-07', patientName: 'Ananya D.', doctorName: 'Dr. Robert Chen', department: 'Orthopedics', roomNumber: 'Room 302', estimatedWaitMins: 18 },
  { id: 'q-4', token: 'OPD-08', patientName: 'Vikram J.', doctorName: 'Dr. Maria Garcia', department: 'Pediatrics', roomNumber: 'Room 105', estimatedWaitMins: 25 },
  { id: 'q-5', token: 'OPD-09', patientName: 'Sunita P.', doctorName: 'Dr. Sarah Jenkins', department: 'Cardiology Care', roomNumber: 'Room 204', estimatedWaitMins: 32 },
  { id: 'q-6', token: 'OPD-10', patientName: 'Rohan B.', doctorName: 'Dr. James Wilson', department: 'General Medicine', roomNumber: 'Room 101', estimatedWaitMins: 40 },
];

export const OpdDisplayBoardPage: React.FC = () => {
  const [nowServing, setNowServing] = useState<DisplayQueueItem>(INITIAL_NOW_SERVING);
  const [upcoming, setUpcoming] = useState<DisplayQueueItem[]>(INITIAL_UPCOMING);
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Live clock tick
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const playChimeAndVoice = (item: DisplayQueueItem) => {
    if (!soundEnabled) return;

    try {
      // 1. Play dual-frequency hospital tone (Web Audio API)
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        const now = ctx.currentTime;
        
        // Tone 1: High bell chime
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now); // D5 note
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.8);

        // Tone 2: Harmonious chime
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.3); // A5 note
        gain2.gain.setValueAtTime(0.25, now + 0.3);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.3);
        osc2.stop(now + 1.2);
      }

      // 2. Play speech synthesis announcement after the chime
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const text = `Token ${item.token.replace('-', ' ')}. Please proceed to ${item.roomNumber}. ${item.doctorName}.`;
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1.05;
          window.speechSynthesis.speak(utterance);
        }, 1100);
      }
    } catch {
      // Sound suppressed by browser policy
    }
  };

  const handleCallNext = () => {
    if (upcoming.length === 0) return;
    setIsCalling(true);
    const nextPatient = upcoming[0];
    const remaining = upcoming.slice(1);

    setNowServing(nextPatient);
    setUpcoming(remaining);
    playChimeAndVoice(nextPatient);

    setTimeout(() => {
      setIsCalling(false);
    }, 2500);
  };

  const handleResetQueue = () => {
    setNowServing(INITIAL_NOW_SERVING);
    setUpcoming(INITIAL_UPCOMING);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const departments = ['All', 'Cardiology Care', 'General Medicine', 'Orthopedics', 'Pediatrics'];

  const filteredUpcoming = selectedDept === 'All'
    ? upcoming
    : upcoming.filter(i => i.department === selectedDept);

  return (
    <div className="min-h-screen bg-[#06090F] text-white flex flex-col justify-between selection:bg-accent-primary select-none overflow-x-hidden font-sans">
      {/* Top Header Bar */}
      <header className="px-6 py-4 bg-[#0B0F17]/90 border-b border-white/[0.08] backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/queue"
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-colors"
            title="Return to Staff Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-3">
            <MediCoreLogo />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider uppercase text-white font-mono">
                  Outpatient Department
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-status-success"></span>
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-status-success/20 text-status-success font-semibold">
                  Live Public Display
                </span>
              </div>
              <p className="text-xs text-text-muted">High-Contrast Waiting Lounge Digital Board</p>
            </div>
          </div>
        </div>

        {/* Center: Department Selection */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 bg-white/[0.04] rounded-xl border border-white/[0.08]">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedDept === dept
                  ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/25'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Right: Sound, Fullscreen & Real-time Clock */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border transition-colors ${
              soundEnabled
                ? 'bg-accent-primary/20 text-accent-primary border-accent-primary/40'
                : 'bg-white/[0.04] text-text-muted border-white/[0.08]'
            }`}
            title={soundEnabled ? 'Audio Chime & Speech Active' : 'Sound Muted'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white border border-white/[0.08] transition-colors"
            title="Toggle Fullscreen Mode"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>

          <div className="text-right border-l border-white/[0.08] pl-4">
            <div className="font-mono text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[11px] text-text-muted font-medium">
              {currentTime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Big "NOW SERVING" Hero Card (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col">
          <div className={`flex-1 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#050811] border-2 ${
            isCalling ? 'border-accent-primary shadow-[0_0_60px_rgba(59,130,246,0.5)] animate-pulse' : 'border-accent-primary/30 shadow-2xl'
          } p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}>
            
            {/* Ambient Background Aura */}
            <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-accent-primary/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {/* Hero Top Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-status-success animate-ping" />
                <span className="text-sm font-bold tracking-widest uppercase font-mono text-emerald-400">
                  CURRENTLY CONSULTING
                </span>
              </div>
              <span className="px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.1] text-xs font-mono font-semibold text-text-secondary">
                {nowServing.department}
              </span>
            </div>

            {/* Token Big Display */}
            <div className="my-8 text-center relative z-10">
              <div className="text-xs uppercase tracking-widest text-text-muted font-mono mb-2">
                TOKEN NUMBER
              </div>
              <div className="font-mono text-7xl sm:text-9xl font-black tracking-tight text-white drop-shadow-[0_4px_30px_rgba(59,130,246,0.35)]">
                {nowServing.token}
              </div>
              <div className="mt-3 text-lg sm:text-2xl font-semibold text-accent-primary">
                Patient: <span className="text-white font-bold">{nowServing.patientName}</span>
              </div>
            </div>

            {/* Consultation Room & Attending Doctor Bottom Bar */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.08] relative z-10">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
                  <Building2 className="w-4 h-4 text-emerald-400" /> PROCEED TO
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                  {nowServing.roomNumber}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="text-xs text-text-muted flex items-center gap-1.5 mb-1">
                  <Stethoscope className="w-4 h-4 text-accent-primary" /> ATTENDING PHYSICIAN
                </div>
                <div className="text-lg sm:text-xl font-bold text-white truncate">
                  {nowServing.doctorName}
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Right Column: Upcoming Queue List (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col">
          <div className="flex-1 rounded-3xl bg-[#0B0F17] border border-white/[0.08] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent-primary" />
                  <span className="font-bold text-sm tracking-wider uppercase font-mono text-white">
                    NEXT IN QUEUE ({filteredUpcoming.length})
                  </span>
                </div>
                <span className="text-xs text-text-muted font-mono">Please be seated in lounge</span>
              </div>

              {/* Upcoming Token Cards */}
              <div className="space-y-3 overflow-y-auto max-h-[55vh] pr-1">
                {filteredUpcoming.length === 0 ? (
                  <div className="py-12 text-center text-text-muted text-sm font-mono">
                    All queued patients have been attended to.
                  </div>
                ) : (
                  filteredUpcoming.map((item, index) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        index === 0
                          ? 'bg-accent-primary/10 border-accent-primary/40 ring-1 ring-accent-primary/25'
                          : 'bg-white/[0.025] border-white/[0.06] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
                          index === 0 ? 'bg-accent-primary text-white shadow-md shadow-accent-primary/30' : 'bg-white/[0.06] text-text-muted'
                        }`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-mono text-base font-bold text-white flex items-center gap-2">
                            <span>{item.token}</span>
                            <span className="text-xs font-sans text-text-secondary font-medium">({item.patientName})</span>
                          </div>
                          <div className="text-xs text-text-muted truncate">
                            {item.doctorName} • {item.roomNumber}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <span className="text-xs text-amber-400 font-semibold block">
                          ~{item.estimatedWaitMins} min
                        </span>
                        <span className="text-[10px] text-text-muted uppercase">Est. Wait</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bottom Demonstration / Reception Staff Controls */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
              <button
                onClick={handleCallNext}
                disabled={upcoming.length === 0}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-accent-primary to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-primary/20 transition-all disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                Call Next Token (Simulate)
              </button>

              <button
                onClick={handleResetQueue}
                className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white border border-white/[0.08] transition-colors"
                title="Reset Demonstration Queue"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Ticker */}
      <footer className="px-6 py-3 bg-[#080C14] border-t border-white/[0.08] flex items-center justify-between text-xs text-text-muted font-mono">
        <div className="flex items-center gap-2 truncate">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-accent-primary font-bold text-[10px]">NOTICE</span>
          <span className="truncate">
            Please keep your physical appointment pass or mobile QR token ready. Wheelchair and priority assistance available at Desk 1.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <span>Emergency Helpline: +91 (22) 8000-9999</span>
          <span className="text-emerald-400">NABH Accredited</span>
        </div>
      </footer>
    </div>
  );
};
