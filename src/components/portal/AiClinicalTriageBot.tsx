import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Bot, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  User, 
  Building, 
  PhoneCall, 
  RotateCcw,
  Stethoscope,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Patient } from '../../types/patient';
import { Appointment } from '../../types/appointment';
import { appointmentService } from '../../services/appointmentService';
import { triageBotService, TriageMessage, TriageAssessment, TriageQuestion } from '../../services/triageBotService';
import { useNotification } from '../../context/NotificationContext';

interface AiClinicalTriageBotProps {
  patient: Patient | null;
  onAppointmentBooked?: (appointment: Appointment) => void;
  onOpenAppointmentSlip?: (appointment: Appointment) => void;
}

export const AiClinicalTriageBot: React.FC<AiClinicalTriageBotProps> = ({
  patient,
  onAppointmentBooked,
  onOpenAppointmentSlip,
}) => {
  const { showToast } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<TriageMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Triage state machine
  const [pendingComplaint, setPendingComplaint] = useState('');
  const [pendingQuestions, setPendingQuestions] = useState<TriageQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [collectedAnswers, setCollectedAnswers] = useState<Record<string, string>>({});
  const [latestAssessment, setLatestAssessment] = useState<TriageAssessment | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookedAppointment, setBookedAppointment] = useState<Appointment | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const patientFirstName = patient?.firstName || 'there';
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: `Hello ${patientFirstName}! 👋 I'm your 24/7 MediCore AI Clinical Triage Assistant. If you are feeling unwell or unsure which doctor to consult, describe your symptoms below.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: [
            "Severe burning stomach pain and feel dizzy",
            "Chest tightness with shortness of breath",
            "High fever and sore throat for 3 days",
            "Severe throbbing migraine with nausea",
          ],
        },
      ]);
    }
  }, [patient]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    // Add patient message
    const userMsg: TriageMessage = {
      id: `msg-${Date.now()}`,
      sender: 'patient',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // If we are waiting for an initial complaint
    if (!pendingComplaint) {
      setPendingComplaint(text);
      const { questions } = triageBotService.generateInitialClarifications(text);
      setPendingQuestions(questions);
      setCurrentQuestionIndex(0);

      setTimeout(() => {
        setIsTyping(false);
        const firstQ = questions[0];
        setMessages(prev => [
          ...prev,
          {
            id: `q-0-${Date.now()}`,
            sender: 'ai',
            text: `I understand you are experiencing: "${text}". To accurately assess the urgency and recommend the right specialist, please answer a few quick clinical questions.\n\n${firstQ.question}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            quickReplies: firstQ.options,
          },
        ]);
      }, 750);
      return;
    }

    // If answering clarification questions
    if (pendingQuestions.length > 0 && currentQuestionIndex < pendingQuestions.length) {
      const currentQ = pendingQuestions[currentQuestionIndex];
      const updatedAnswers = { ...collectedAnswers, [currentQ.id]: text };
      setCollectedAnswers(updatedAnswers);

      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      if (nextIndex < pendingQuestions.length) {
        // Show next question
        const nextQ = pendingQuestions[nextIndex];
        setTimeout(() => {
          setIsTyping(false);
          setMessages(prev => [
            ...prev,
            {
              id: `q-${nextIndex}-${Date.now()}`,
              sender: 'ai',
              text: nextQ.question,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              quickReplies: nextQ.options,
            },
          ]);
        }, 600);
      } else {
        // All questions answered -> Evaluate Triage!
        setTimeout(() => {
          const assessment = triageBotService.evaluateTriage(pendingComplaint, updatedAnswers);
          setLatestAssessment(assessment);
          setIsTyping(false);

          setMessages(prev => [
            ...prev,
            {
              id: `assessment-${Date.now()}`,
              sender: 'ai',
              text: `Clinical assessment complete. Based on your symptoms and clinical criteria, your triage urgency is classified as:`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              assessment,
            },
          ]);
        }, 900);
      }
    }
  };

  const handleBookOneClick = async () => {
    if (!latestAssessment || !patient) return;
    setIsBooking(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }).substring(0, 5);

      const newApt = await appointmentService.createAppointment({
        patientId: patient.id,
        patientName: patient.fullName,
        patientMrn: patient.mrn,
        patientPhone: patient.phone || '9876543210',
        doctorId: latestAssessment.triageBand === 'RED' ? 'doc-er-1' : 'doc-1',
        doctorName: latestAssessment.recommendedDoctorName,
        doctorSpecialty: latestAssessment.recommendedDoctorSpecialty || latestAssessment.recommendedDepartment,
        department: latestAssessment.recommendedDepartment,
        date: today,
        time: nowTime,
        durationMinutes: latestAssessment.triageBand === 'RED' ? 15 : 20,
        type: latestAssessment.appointmentType,
        status: 'Waiting',
        reason: pendingComplaint,
        roomNumber: latestAssessment.suggestedChamber,
        notes: `AI Triage Grade: [${latestAssessment.triageBand}] ${latestAssessment.bandLabel}. Symptoms: ${pendingComplaint}`,
      });

      setBookedAppointment(newApt);
      setIsBooking(false);

      showToast(`Token #${newApt.tokenNumber} generated for ${newApt.department}`, 'success', 'Appointment Confirmed');

      if (onAppointmentBooked) {
        onAppointmentBooked(newApt);
      }

      // Add confirmation message in chat
      setMessages(prev => [
        ...prev,
        {
          id: `confirmed-${Date.now()}`,
          sender: 'ai',
          text: `🎉 Your consultation slot has been reserved! Your token number is #${newApt.tokenNumber}. You can proceed directly to ${latestAssessment.suggestedChamber} at ${latestAssessment.recommendedDepartment}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBookingConfirmed: true,
          confirmedToken: newApt.tokenNumber,
        },
      ]);
    } catch {
      showToast('Booking failed. Please try again or visit reception.', 'error');
      setIsBooking(false);
    }
  };

  const handleResetChat = () => {
    setPendingComplaint('');
    setPendingQuestions([]);
    setCurrentQuestionIndex(0);
    setCollectedAnswers({});
    setLatestAssessment(null);
    setBookedAppointment(null);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'ai',
        text: `Chat reset. How can I assist you with your health concerns today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: [
          "Severe burning stomach pain and feel dizzy",
          "Chest tightness with shortness of breath",
          "High fever and sore throat for 3 days",
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Bottom-Right Launcher Widget */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-r from-accent-primary via-indigo-600 to-purple-600 text-white shadow-2xl hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all hover:scale-105 flex items-center gap-3 border border-white/20 group"
          title="Open MediCore 24/7 AI Clinical Triage"
          aria-label="Open AI Triage Bot"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-status-success ring-2 ring-[#0B0F17]" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-tight flex items-center gap-1.5">
              <span>24/7 AI Clinical Triage</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </div>
            <div className="text-[10px] text-white/80 font-medium">Symptom Checker & Instant Booking</div>
          </div>
        </button>
      )}

      {/* Expanded Chat Window Card */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[620px] max-h-[90vh] bg-[#0A0E17]/95 backdrop-blur-xl text-text-primary rounded-3xl border border-white/[0.14] shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-accent-primary/20 via-indigo-600/15 to-purple-600/10 border-b border-white/[0.08] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-accent-primary/20 text-accent-primary border border-accent-primary/30">
                <Brain className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-status-success" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  MediCore AI Clinical Triage
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-accent-primary/20 text-accent-primary font-bold">
                    24/7 Live
                  </span>
                </h3>
                <p className="text-[11px] text-text-muted">Instant triage urgency & doctor matching</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Restart consultation conversation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
                title="Minimize chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs font-sans">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                    msg.sender === 'patient'
                      ? 'bg-accent-primary text-white rounded-tr-none shadow-md shadow-accent-primary/20'
                      : 'bg-white/[0.04] text-text-primary rounded-tl-none border border-white/[0.08]'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-[13px]">{msg.text}</p>

                  {/* Render Assessment Card inside AI message */}
                  {msg.assessment && (
                    <div className="mt-3 pt-3 border-t border-white/[0.1] space-y-3">
                      {/* Triage Band Badge */}
                      <div
                        className={`p-3 rounded-xl border flex items-center gap-3 ${
                          msg.assessment.triageBand === 'RED'
                            ? 'bg-status-danger/20 border-status-danger/40 text-status-danger'
                            : msg.assessment.triageBand === 'YELLOW'
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                            : 'bg-status-success/20 border-status-success/40 text-status-success'
                        }`}
                      >
                        {msg.assessment.triageBand === 'RED' ? (
                          <ShieldAlert className="w-6 h-6 shrink-0 animate-bounce" />
                        ) : msg.assessment.triageBand === 'YELLOW' ? (
                          <AlertTriangle className="w-6 h-6 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 shrink-0" />
                        )}
                        <div>
                          <span className="font-mono text-[10px] font-black uppercase tracking-wider block">
                            TRIAGE CATEGORY: {msg.assessment.triageBand}
                          </span>
                          <span className="font-bold text-xs sm:text-sm text-white block">
                            {msg.assessment.bandLabel}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed">
                        {msg.assessment.urgencyDescription}
                      </p>

                      {/* Recommended Routing */}
                      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <Building className="w-3.5 h-3.5 text-accent-primary" />
                          <span className="font-semibold text-white">{msg.assessment.recommendedDepartment}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-text-muted">
                          <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-text-primary">{msg.assessment.recommendedDoctorName}</span>
                          <span className="text-[10px] text-text-muted font-mono">({msg.assessment.suggestedChamber})</span>
                        </div>
                      </div>

                      {/* Possible Clinical Causes */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider block">
                          Differential Considerations:
                        </span>
                        <ul className="text-[11px] text-text-secondary space-y-0.5 list-disc list-inside">
                          {msg.assessment.possibleCauses.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Immediate Self-Care */}
                      <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[11px] text-text-muted">
                        <strong className="text-white">Guidance:</strong> {msg.assessment.selfCareAdvice}
                      </div>

                      {/* 1-Click Action Buttons */}
                      <div className="pt-2">
                        {msg.assessment.isEmergency ? (
                          <div className="space-y-2">
                            <a
                              href="tel:108"
                              className="w-full py-2.5 px-3 rounded-xl bg-status-danger hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-status-danger/30 transition-all text-center"
                            >
                              <PhoneCall className="w-4 h-4 animate-bounce" /> Call Emergency Ambulance (108)
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full text-xs"
                              onClick={handleBookOneClick}
                              isLoading={isBooking}
                            >
                              Register ER Trauma Priority Bay
                            </Button>
                          </div>
                        ) : !bookedAppointment ? (
                          <Button
                            variant="primary"
                            size="sm"
                            className="w-full text-xs py-2.5"
                            onClick={handleBookOneClick}
                            isLoading={isBooking}
                            leftIcon={<Calendar className="w-4 h-4" />}
                          >
                            1-Click Book with {msg.assessment.recommendedDoctorName.split(',')[0]}
                          </Button>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-status-success/20 border border-status-success/40 text-status-success text-center font-bold text-xs">
                            ✓ Appointment Confirmed (Token #{bookedAppointment.tokenNumber})
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Confirmed Slip Action Button */}
                  {msg.isBookingConfirmed && bookedAppointment && onOpenAppointmentSlip && (
                    <div className="mt-3 pt-2 border-t border-white/[0.08]">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        onClick={() => onOpenAppointmentSlip(bookedAppointment)}
                      >
                        View & Print Appointment Pass
                      </Button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-text-muted font-mono px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Reply Option Chips */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-accent-primary/20 text-text-secondary hover:text-white border border-white/[0.08] hover:border-accent-primary/40 text-[11px] font-medium transition-all text-left"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-text-muted p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] w-24">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse delay-75" />
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse delay-150" />
                <span className="text-[10px] font-mono">Thinking...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-[#0B0F17] border-t border-white/[0.08]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your symptoms in natural words..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder-text-muted focus:border-accent-primary focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-accent-primary hover:bg-blue-600 disabled:opacity-40 text-white shadow-md shadow-accent-primary/25 transition-all"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-text-muted font-mono px-1">
              <span>Medical AI Advisory Model</span>
              <span className="text-amber-400">Not a substitute for emergency 911/108</span>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
