import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { initialPatients } from '../../services/mockData';
import { Appointment, Doctor, AppointmentStatus } from '../../types/appointment';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { useNotification } from '../../context/NotificationContext';
import {
  CalendarDays,
  Plus,
  Clock,
  User,
  Filter,
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [doctorFilter, setDoctorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // New appointment form state
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatients[0].id);
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-09-30');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00');
  const [appointmentType, setAppointmentType] = useState<'Routine Checkup' | 'First Visit' | 'Follow-up' | 'Emergency'>('Routine Checkup');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  const availableSlots = [
    '09:00', '09:20', '09:40', '10:00', '10:20', '10:40',
    '11:00', '11:20', '11:40', '12:00', '14:00', '14:30', '15:00', '15:30'
  ];

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const [aptRes, docRes] = await Promise.all([
        appointmentService.getAppointments({
          department: departmentFilter,
          doctorId: doctorFilter,
          status: statusFilter,
        }),
        appointmentService.getDoctors(),
      ]);
      setAppointments(aptRes);
      setDoctors(docRes);
      if (!selectedDoctorId && docRes.length > 0) {
        setSelectedDoctorId(docRes[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [departmentFilter, doctorFilter, statusFilter]);

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const pat = initialPatients.find(p => p.id === selectedPatientId) || initialPatients[0];
    const doc = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

    try {
      await appointmentService.createAppointment({
        patientId: pat.id,
        patientName: pat.fullName,
        patientMrn: pat.mrn,
        patientPhone: pat.phone,
        doctorId: doc.id,
        doctorName: doc.name,
        doctorSpecialty: doc.specialty,
        department: doc.department,
        date: appointmentDate,
        time: selectedTimeSlot,
        durationMinutes: 20,
        type: appointmentType,
        status: 'Scheduled',
        reason: reason || 'General clinical consultation',
        notes,
        roomNumber: doc.roomNumber,
      });

      showToast(`Appointment confirmed for ${pat.fullName} with ${doc.name} at ${selectedTimeSlot}`, 'success', 'Appointment Created');
      setIsModalOpen(false);
      setReason('');
      setNotes('');
      fetchAppointments();
    } catch {
      showToast('Error booking appointment', 'error');
    }
  };

  const handleStatusChange = async (aptId: string, newStatus: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(aptId, newStatus);
      showToast(`Appointment status updated to ${newStatus}`, 'info');
      fetchAppointments();
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Appointments & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Doctor calendar management, slot booking, and check-in tracking
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Calendar View Switcher */}
          <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs">
            {(['day', 'week', 'month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  viewMode === v
                    ? 'bg-accent-primary text-white shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <GlassCard className="p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap flex-1">
          <div className="flex items-center gap-1.5 text-xs text-text-muted mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <Select
            options={[
              { value: 'All', label: 'All Departments' },
              { value: 'Cardiology', label: 'Cardiology' },
              { value: 'Endocrinology', label: 'Endocrinology' },
              { value: 'General Medicine', label: 'General Medicine' },
              { value: 'Neurology', label: 'Neurology' },
              { value: 'Pediatrics', label: 'Pediatrics' },
            ]}
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="py-1 text-xs min-w-[140px]"
          />

          <Select
            options={[
              { value: 'All', label: 'All Doctors' },
              ...doctors.map(d => ({ value: d.id, label: d.name })),
            ]}
            value={doctorFilter}
            onChange={e => setDoctorFilter(e.target.value)}
            className="py-1 text-xs min-w-[160px]"
          />

          <Select
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Waiting', label: 'Waiting' },
              { value: 'In Consultation', label: 'In Consultation' },
              { value: 'Completed', label: 'Completed' },
            ]}
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="py-1 text-xs min-w-[130px]"
          />
        </div>

        <div className="text-xs text-text-muted font-mono">
          Showing {appointments.length} Appointments (2026-09-30)
        </div>
      </GlassCard>

      {/* Appointment Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map(apt => (
          <GlassCard key={apt.id} className="p-5 flex flex-col justify-between hover:border-white/[0.16] space-y-4">
            <div>
              {/* Top row: Token + Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-accent-primary/10 text-accent-primary border border-accent-primary/25">
                  Token: {apt.tokenNumber}
                </span>
                <StatusBadge status={apt.status} />
              </div>

              {/* Patient info */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-text-muted shrink-0">
                  <User className="w-4 h-4 text-text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{apt.patientName}</h3>
                  <div className="text-xs text-text-muted font-mono">{apt.patientMrn}</div>
                  <div className="text-[11px] text-text-secondary mt-0.5">{apt.patientPhone}</div>
                </div>
              </div>

              {/* Consultation details */}
              <div className="mt-4 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] space-y-2 text-xs">
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Consultant:</span>
                  <span className="font-semibold text-text-primary">{apt.doctorName}</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Department:</span>
                  <span className="text-text-muted">{apt.department} ({apt.roomNumber})</span>
                </div>
                <div className="flex items-center justify-between text-text-secondary">
                  <span>Time & Type:</span>
                  <span className="font-mono text-accent-primary font-medium">
                    {apt.time} • {apt.type}
                  </span>
                </div>
                {apt.reason && (
                  <div className="pt-1.5 border-t border-white/[0.04] text-[11px] text-text-muted italic line-clamp-2">
                    &quot;{apt.reason}&quot;
                  </div>
                )}
              </div>
            </div>

            {/* Quick action bar */}
            <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-[11px] text-text-muted font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{apt.durationMinutes} mins</span>
              </span>

              <div className="flex items-center gap-1.5">
                {apt.status === 'Scheduled' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                    className="text-xs py-1"
                  >
                    Confirm
                  </Button>
                )}
                {apt.status === 'Confirmed' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleStatusChange(apt.id, 'Waiting')}
                    className="text-xs py-1"
                  >
                    Check-in
                  </Button>
                )}
                {apt.status === 'Waiting' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => handleStatusChange(apt.id, 'In Consultation')}
                    className="text-xs py-1"
                  >
                    Call In
                  </Button>
                )}
                {apt.status === 'In Consultation' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => handleStatusChange(apt.id, 'Completed')}
                    className="text-xs py-1"
                  >
                    Complete
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Book Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Patient Appointment"
        subtitle="Select patient, doctor, date, and available consultation slot"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Select Patient"
              required
              options={initialPatients.map(p => ({
                value: p.id,
                label: `${p.fullName} (${p.mrn})`,
              }))}
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
            />

            <Select
              label="Select Doctor / Specialty"
              required
              options={doctors.map(d => ({
                value: d.id,
                label: `${d.name} — ${d.specialty}`,
              }))}
              value={selectedDoctorId}
              onChange={e => setSelectedDoctorId(e.target.value)}
            />

            <Input
              label="Appointment Date"
              type="date"
              required
              value={appointmentDate}
              onChange={e => setAppointmentDate(e.target.value)}
            />

            <Select
              label="Appointment Type"
              options={[
                { value: 'Routine Checkup', label: 'Routine Checkup' },
                { value: 'First Visit', label: 'First Visit' },
                { value: 'Follow-up', label: 'Follow-up' },
                { value: 'Emergency', label: 'Emergency' },
              ]}
              value={appointmentType}
              onChange={e => setAppointmentType(e.target.value as any)}
            />
          </div>

          {/* Time Slot Picker */}
          <div>
            <label className="text-xs font-medium text-text-secondary block mb-1.5">
              Available Consultation Slots
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {availableSlots.map(slot => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTimeSlot(slot)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-medium transition-all ${
                    selectedTimeSlot === slot
                      ? 'bg-accent-primary text-white shadow-glow-primary border border-accent-primary'
                      : 'bg-white/[0.04] text-text-secondary hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Chief Complaint / Reason for Visit"
            placeholder="e.g. Follow-up on blood pressure and lipid profile"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />

          <Textarea
            label="Clinical Notes / Instructions"
            placeholder="Any specific instructions for the consultation..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={2}
          />

          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Confirm Appointment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
