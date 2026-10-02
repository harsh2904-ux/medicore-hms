export type AppointmentStatus = 
  | 'Scheduled'
  | 'Confirmed'
  | 'Checked-in'
  | 'Waiting'
  | 'In Consultation'
  | 'Completed'
  | 'Cancelled'
  | 'No-show';

export type AppointmentType = 'First Visit' | 'Follow-up' | 'Routine Checkup' | 'Emergency' | 'Teleconsult';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  department: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  tokenNumber: string;
  roomNumber: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  qualification: string;
  experienceYears: number;
  phone: string;
  email: string;
  roomNumber: string;
  todayAppointmentsCount: number;
  availability: 'Available' | 'In Consultation' | 'In Surgery' | 'On Leave';
  avatarUrl?: string;
  schedule: {
    days: string[];
    startTime: string;
    endTime: string;
    slotDurationMinutes: number;
  };
}

export interface QueueItem {
  id: string;
  token: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  category: 'OPD' | 'Emergency' | 'Lab' | 'Radiology';
  waitingTimeMinutes: number;
  priority: 'Normal' | 'Urgent' | 'Emergency';
  status: 'Waiting' | 'In Consultation' | 'In Progress' | 'Completed' | 'Skipped';
  roomNumber: string;
}
