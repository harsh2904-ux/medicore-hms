import { Appointment, AppointmentStatus, AppointmentType, Doctor, QueueItem } from '../types/appointment';
import { initialAppointments, initialDoctors, initialQueue } from './mockData';
import { apiClient } from './apiClient';

let appointmentsStore: Appointment[] = [...initialAppointments];
let queueStore: QueueItem[] = [...initialQueue];
let doctorsStore: Doctor[] = [...initialDoctors];

function normalizeAptStatus(s?: string): AppointmentStatus {
  if (!s) return 'Scheduled';
  const u = s.toUpperCase();
  if (u === 'COMPLETED') return 'Completed';
  if (u === 'CANCELLED') return 'Cancelled';
  if (u === 'IN_PROGRESS' || u === 'IN_CONSULTATION') return 'In Consultation';
  if (u === 'CHECKED_IN') return 'Checked-in';
  if (u === 'WAITING') return 'Waiting';
  if (u === 'NO_SHOW') return 'No-show';
  return 'Scheduled';
}

function normalizeAptType(t?: string): AppointmentType {
  if (!t) return 'Routine Checkup';
  const u = t.toUpperCase();
  if (u.includes('FOLLOW')) return 'Follow-up';
  if (u.includes('EMERG')) return 'Emergency';
  if (u.includes('TELE')) return 'Teleconsult';
  if (u.includes('FIRST')) return 'First Visit';
  return 'Routine Checkup';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dtoToDoctor(dto: any): Doctor {
  return {
    id: String(dto.id),
    name: dto.name,
    specialty: dto.specialization || 'General Physician',
    department: dto.departmentName || 'General Medicine',
    qualification: dto.licenseNumber ? `MD (${dto.licenseNumber})` : 'MD, FACC',
    experienceYears: 12,
    phone: dto.phone || '+1 (555) 010-0000',
    email: dto.email || 'doctor@medicore.com',
    roomNumber: dto.roomNumber || '301-A',
    todayAppointmentsCount: 4,
    availability: 'Available',
    schedule: {
      days: dto.availableDays ? dto.availableDays.split(',') : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      startTime: dto.shiftStart || '09:00',
      endTime: dto.shiftEnd || '17:00',
      slotDurationMinutes: 30,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dtoToAppointment(dto: any): Appointment {
  return {
    id: String(dto.id),
    patientId: String(dto.patientId),
    patientName: dto.patientName || 'Unknown Patient',
    patientMrn: dto.patientMrn || `MC-2026-${dto.patientId}`,
    patientPhone: dto.patientPhone || '',
    doctorId: String(dto.doctorId),
    doctorName: dto.doctorName || 'Assigned Physician',
    doctorSpecialty: 'Specialist',
    department: dto.department || 'General Medicine',
    date: dto.date || new Date().toISOString().split('T')[0],
    time: dto.time ? dto.time.slice(0, 5) : '10:00',
    durationMinutes: 30,
    type: normalizeAptType(dto.type),
    status: normalizeAptStatus(dto.status),
    reason: dto.reason || 'General Consultation',
    notes: dto.notes,
    tokenNumber: dto.appointmentNumber || `T-${dto.id}`,
    roomNumber: '301-A',
  };
}

export const appointmentService = {
  async getAppointments(params?: {
    date?: string;
    doctorId?: string;
    department?: string;
    status?: string;
  }): Promise<Appointment[]> {
    // Attempt backend query
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/appointments', {
        date: params?.date,
        doctorId: params?.doctorId && params.doctorId !== 'All' ? params.doctorId : undefined,
        status: params?.status && params.status !== 'All' ? params.status.toUpperCase() : undefined,
        size: 50,
      });

      if (res && res.data && Array.isArray(res.data.content)) {
        const backendApts = res.data.content.map(dtoToAppointment);
        backendApts.forEach((ba: Appointment) => {
          const idx = appointmentsStore.findIndex(a => a.id === ba.id);
          if (idx >= 0) {
            appointmentsStore[idx] = ba;
          } else {
            appointmentsStore.push(ba);
          }
        });
      }
    } catch (err) {
      console.warn('Backend appointments query failed, using local store:', err);
    }

    let result = [...appointmentsStore];

    if (params?.date) {
      result = result.filter(a => a.date === params.date);
    }
    if (params?.doctorId && params.doctorId !== 'All') {
      result = result.filter(a => a.doctorId === params.doctorId);
    }
    if (params?.department && params.department !== 'All') {
      result = result.filter(a => a.department === params.department);
    }
    if (params?.status && params.status !== 'All') {
      result = result.filter(a => a.status === params.status);
    }

    return result;
  },

  async createAppointment(input: Omit<Appointment, 'id' | 'tokenNumber'>): Promise<Appointment> {
    const token = `T-${Math.floor(10 + Math.random() * 90)}`;

    // Attempt backend persistence
    try {
      const payload = {
        patientId: Number(input.patientId) || 1,
        doctorId: Number(input.doctorId) || 1,
        departmentId: 1,
        appointmentDate: input.date,
        startTime: input.time ? (input.time.length === 5 ? `${input.time}:00` : input.time) : '10:00:00',
        type: input.type.toUpperCase().replace(/\s+/g, '_'),
        status: 'SCHEDULED',
        reason: input.reason,
        notes: input.notes,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.post<any>('/appointments', payload);
      if (res && res.data) {
        const saved = dtoToAppointment(res.data);
        saved.patientName = input.patientName;
        saved.doctorName = input.doctorName;
        saved.department = input.department;
        appointmentsStore.unshift(saved);
        return saved;
      }
    } catch (err) {
      console.warn('Failed to persist appointment to backend, falling back to local store:', err);
    }

    const newAppointment: Appointment = {
      ...input,
      id: `apt-${Date.now()}`,
      tokenNumber: token,
    };
    appointmentsStore.unshift(newAppointment);

    // Also push to queue if scheduled today
    queueStore.unshift({
      id: `q-${Date.now()}`,
      token,
      patientId: newAppointment.patientId,
      patientName: newAppointment.patientName,
      patientMrn: newAppointment.patientMrn,
      doctorId: newAppointment.doctorId,
      doctorName: newAppointment.doctorName,
      department: newAppointment.department,
      category: 'OPD',
      waitingTimeMinutes: 0,
      priority: 'Normal',
      status: 'Waiting',
      roomNumber: newAppointment.roomNumber,
    });

    return newAppointment;
  },

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    try {
      if (/^\d+$/.test(id)) {
        await apiClient.request(`/appointments/${id}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: status.toUpperCase().replace(/\s+/g, '_') }),
        });
      }
    } catch {
      // Fallback
    }

    const idx = appointmentsStore.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Appointment not found');
    appointmentsStore[idx].status = status;
    return appointmentsStore[idx];
  },

  async getDoctors(): Promise<Doctor[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/doctors');
      if (res && res.data && Array.isArray(res.data)) {
        const backendDoctors = res.data.map(dtoToDoctor);
        doctorsStore = backendDoctors;
        return doctorsStore;
      }
    } catch {
      // Fallback
    }
    return [...doctorsStore];
  },

  async getDoctorById(id: string): Promise<Doctor | null> {
    try {
      if (/^\d+$/.test(id)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/doctors/${id}`);
        if (res && res.data) {
          return dtoToDoctor(res.data);
        }
      }
    } catch {
      // Fallback
    }
    return doctorsStore.find(d => d.id === id) || null;
  },

  async getQueue(category?: string): Promise<QueueItem[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    if (!category || category === 'All') return [...queueStore];
    return queueStore.filter(q => q.category.toLowerCase() === category.toLowerCase());
  },

  async updateQueueStatus(id: string, status: QueueItem['status']): Promise<QueueItem> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = queueStore.findIndex(q => q.id === id);
    if (idx === -1) throw new Error('Queue item not found');
    queueStore[idx].status = status;
    return queueStore[idx];
  },

  async callNextPatient(queueId: string): Promise<QueueItem> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = queueStore.findIndex(q => q.id === queueId);
    if (idx === -1) throw new Error('Queue item not found');
    queueStore[idx].status = 'In Consultation';
    return queueStore[idx];
  },
};
