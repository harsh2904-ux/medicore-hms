import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Patient } from '../../types/patient';
import { Doctor, Appointment } from '../../types/appointment';
import { appointmentService } from '../../services/appointmentService';
import { communicationService } from '../../services/communicationService';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle2,
  Stethoscope,
  Sparkles,
  MapPin,
  CalendarCheck,
  ShieldCheck,
  FileText
} from 'lucide-react';

interface BookPatientAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  onAppointmentBooked: (appointment: Appointment) => void;
}

const DEPARTMENTS = [
  'All Departments',
  'Cardiology',
  'General Medicine',
  'Endocrinology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
];

const TIME_SLOTS = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
];

export const BookPatientAppointmentModal: React.FC<BookPatientAppointmentModalProps> = ({
  isOpen,
  onClose,
  patient,
  onAppointmentBooked,
}) => {
  const { showToast } = useNotification();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  
  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [timeSlot, setTimeSlot] = useState('10:00');
  const [visitType, setVisitType] = useState<'Routine Checkup' | 'First Visit' | 'Follow-up' | 'Teleconsult'>('Follow-up');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [autoWhatsApp, setAutoWhatsApp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      appointmentService.getDoctors().then(docs => {
        setDoctors(docs);
        if (docs.length > 0 && !selectedDoctorId) {
          setSelectedDoctorId(docs[0].id);
        }
      });
    }
  }, [isOpen, selectedDoctorId]);

  const filteredDoctors = selectedDept === 'All Departments'
    ? doctors
    : doctors.filter(d => d.department.toLowerCase() === selectedDept.toLowerCase());

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || filteredDoctors[0] || doctors[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      showToast('Please select a doctor for your consultation', 'error');
      return;
    }

    if (!reason.trim()) {
      showToast('Please enter the reason or symptoms for your consultation', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newApt = await appointmentService.createAppointment({
        patientId: patient.id,
        patientName: patient.fullName,
        patientMrn: patient.mrn,
        patientPhone: patient.phone,
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.name,
        doctorSpecialty: selectedDoctor.specialty,
        department: selectedDoctor.department,
        date: date,
        time: timeSlot,
        durationMinutes: 30,
        type: visitType,
        status: 'Scheduled',
        reason: reason.trim(),
        notes: notes.trim() || `Booked via Patient Digital Portal by patient on ${new Date().toLocaleDateString()}`,
        roomNumber: selectedDoctor.roomNumber || 'Room 201',
      });

      // Automatically dispatch WhatsApp and SMS booking confirmation with Token Pass
      await communicationService.sendAppointmentConfirmation({
        patientName: patient.fullName,
        phone: patient.phone,
        doctorName: selectedDoctor.name,
        department: selectedDoctor.department,
        date: date,
        time: timeSlot,
        token: newApt.tokenNumber || 'OPD-01',
        autoOpenWhatsApp: autoWhatsApp,
      });

      showToast(
        `Appointment confirmed! Token: #${newApt.tokenNumber}. WhatsApp & SMS dispatched to ${patient.phone}`,
        'success',
        'Appointment Confirmed'
      );

      onAppointmentBooked(newApt);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to book appointment';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Appointment"
      subtitle="Select your preferred specialist doctor, date, and consultation time slot"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Patient Identity Confirmation Card */}
        <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-text-primary">{patient.fullName}</span>
                <span className="font-mono text-xs px-2 py-0.2 rounded bg-blue-500/20 text-blue-400 font-semibold">
                  {patient.mrn}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {patient.gender} • {patient.age} yrs • Blood Group: <strong className="text-accent-secondary">{patient.bloodGroup}</strong>
              </p>
            </div>
          </div>
          <div className="text-xs text-text-secondary sm:text-right">
            <p className="font-medium text-text-primary">{patient.phone}</p>
            <p className="text-[11px] text-text-muted">Registered Phone</p>
          </div>
        </div>

        {/* Step 1: Department & Doctor Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-accent-primary" />
              <span>Select Department</span>
            </label>
            <Select
              value={selectedDept}
              onChange={e => {
                setSelectedDept(e.target.value);
                const match = e.target.value === 'All Departments' 
                  ? doctors[0] 
                  : doctors.find(d => d.department.toLowerCase() === e.target.value.toLowerCase());
                if (match) setSelectedDoctorId(match.id);
              }}
              options={DEPARTMENTS.map(d => ({ label: d, value: d }))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Select Specialist Doctor</span>
            </label>
            <select
              value={selectedDoctor?.id || ''}
              onChange={e => setSelectedDoctorId(e.target.value)}
              className="w-full bg-[#0F131A] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-text-primary focus:border-accent-primary focus:outline-none"
              required
            >
              {filteredDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>
                  {doc.name} — {doc.specialty} ({doc.roomNumber})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Doctor Summary Card */}
        {selectedDoctor && (
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-accent-primary/10 text-accent-primary">
                <Stethoscope className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-text-primary">{selectedDoctor.name}</p>
                <p className="text-[11px] text-text-muted">{selectedDoctor.qualification} • {selectedDoctor.experienceYears} Years Exp.</p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-white/[0.06] text-accent-primary font-semibold">
                {selectedDoctor.roomNumber || 'Room 201'}
              </span>
              <p className="text-[10px] text-text-muted mt-1">{selectedDoctor.department} OPD</p>
            </div>
          </div>
        )}

        {/* Step 2: Date & Consultation Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input
              type="date"
              label="Consultation Date"
              value={date}
              min={todayStr}
              onChange={e => setDate(e.target.value)}
              required
              leftIcon={<Calendar className="w-4 h-4 text-accent-primary" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Visit Type</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['Routine Checkup', 'Follow-up', 'First Visit', 'Teleconsult'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setVisitType(type)}
                  className={`py-1.5 px-2.5 rounded-lg text-xs font-medium transition-all text-center ${
                    visitType === type
                      ? 'bg-accent-primary/20 text-accent-primary border border-accent-primary/40 font-semibold'
                      : 'bg-white/[0.03] text-text-muted hover:text-text-secondary border border-white/[0.06]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Available Time Slots */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-accent-primary" />
              <span>Available Time Slots ({date})</span>
            </span>
            <span className="text-[11px] text-accent-primary font-normal">Slot duration: 20-30 mins</span>
          </label>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map(slot => {
              const isSelected = timeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-medium transition-all ${
                    isSelected
                      ? 'bg-accent-primary text-white font-bold shadow-glow-primary scale-[1.02]'
                      : 'bg-white/[0.03] border border-white/[0.08] text-text-secondary hover:border-accent-primary/40 hover:bg-white/[0.06]'
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Reason for Visit */}
        <div>
          <Textarea
            label="Chief Complaint / Reason for Visit"
            placeholder="Describe your current symptoms or purpose of consultation (e.g. Follow-up blood pressure review, ongoing chest discomfort, medication review...)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={2}
            required
          />
        </div>

        {/* Step 5: Optional Notes */}
        <div>
          <Input
            label="Special Instructions / Allergies / Notes (Optional)"
            placeholder="Any specific requests or mobility assistance needed"
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* WhatsApp Dispatch Option */}
        <label className="flex items-center gap-2.5 cursor-pointer text-xs select-none p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/15 transition-colors">
          <input
            type="checkbox"
            checked={autoWhatsApp}
            onChange={e => setAutoWhatsApp(e.target.checked)}
            className="w-4 h-4 rounded text-emerald-600 bg-white/10 border-white/20 focus:ring-0 shrink-0"
          />
          <div className="flex-1">
            <span className="font-semibold block text-emerald-200">
              Open Token Pass on WhatsApp (wa.me)
            </span>
            <span className="text-[11px] text-emerald-200/70 block">
              Instantly transmits queue token & doctor chamber to {patient.phone}
            </span>
          </div>
        </label>

        {/* Booking Summary Box */}
        <div className="p-3.5 rounded-xl bg-accent-primary/[0.06] border border-accent-primary/20 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-text-primary flex items-center gap-1.5">
              <CalendarCheck className="w-4 h-4 text-accent-primary" />
              <span>Summary: {date} at {timeSlot}</span>
            </span>
            <p className="text-[11px] text-text-muted">
              {selectedDoctor ? `${selectedDoctor.name} • ${selectedDoctor.roomNumber}` : 'Specialist Doctor'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-accent-secondary">Instant Confirmation</span>
            <p className="text-[11px] text-text-secondary">Token generated upon booking</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<CalendarCheck className="w-4 h-4" />}
          >
            Confirm & Book Appointment
          </Button>
        </div>

      </form>
    </Modal>
  );
};
