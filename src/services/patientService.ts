import { Patient, PatientRegistrationInput, PatientTimelineItem } from '../types/patient';
import { initialPatients, initialPatientTimeline } from './mockData';
import { apiClient } from './apiClient';

let patientsStore: Patient[] = [...initialPatients];
const timelineStore: Record<string, PatientTimelineItem[]> = { ...initialPatientTimeline };

function normalizeGender(g?: string): 'Male' | 'Female' | 'Other' {
  if (!g) return 'Other';
  const lower = g.toLowerCase();
  if (lower.startsWith('m')) return 'Male';
  if (lower.startsWith('f')) return 'Female';
  return 'Other';
}

function normalizeStatus(s?: string): 'Active' | 'Inpatient' | 'Discharged' | 'Critical' {
  if (!s) return 'Active';
  const lower = s.toLowerCase();
  if (lower.includes('inpatient')) return 'Inpatient';
  if (lower.includes('discharge')) return 'Discharged';
  if (lower.includes('crit')) return 'Critical';
  return 'Active';
}

// Convert backend PatientDto to frontend Patient model
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dtoToPatient(dto: any): Patient {
  return {
    id: String(dto.id),
    mrn: dto.mrn,
    firstName: dto.firstName,
    lastName: dto.lastName,
    fullName: dto.name || `${dto.firstName} ${dto.lastName}`.trim(),
    dob: dto.dateOfBirth || '1990-01-01',
    age: dto.age ?? 30,
    gender: normalizeGender(dto.gender),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bloodGroup: (dto.bloodGroup as any) || 'O+',
    phone: dto.phone || '',
    email: dto.email || '',
    address: dto.address || '',
    city: dto.city || 'San Francisco',
    state: 'CA',
    pinCode: '94103',
    emergencyContact: {
      name: dto.emergencyContact?.name || 'Emergency Contact',
      relationship: 'Family',
      phone: dto.emergencyContact?.phone || '',
    },
    allergies: Array.isArray(dto.allergies) ? dto.allergies : [],
    chronicConditions: [],
    currentMedications: [],
    insuranceProvider: dto.insuranceProvider || '',
    policyNumber: dto.insurancePolicyNumber || '',
    status: normalizeStatus(dto.status),
    lastVisit: dto.createdAt ? dto.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    department: 'General Medicine',
    registeredDate: dto.createdAt ? dto.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
  };
}

export const patientService = {
  async getPatients(params?: {
    search?: string;
    department?: string;
    status?: string;
    gender?: string;
  }): Promise<Patient[]> {
    // Try fetching from Spring Boot PostgreSQL backend
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<any>('/patients', {
        query: params?.search,
        size: 50,
      });

      if (response && response.data && Array.isArray(response.data.content)) {
        const backendPatients = response.data.content.map(dtoToPatient);
        // Merge into local cache
        backendPatients.forEach((bp: Patient) => {
          const idx = patientsStore.findIndex(p => p.id === bp.id || p.mrn === bp.mrn);
          if (idx >= 0) {
            patientsStore[idx] = bp;
          } else {
            patientsStore.push(bp);
          }
        });

        let result = [...patientsStore];
        if (params?.department && params.department !== 'All') {
          result = result.filter(p => p.department === params.department);
        }
        if (params?.status && params.status !== 'All') {
          result = result.filter(p => p.status === params.status);
        }
        if (params?.gender && params.gender !== 'All') {
          result = result.filter(p => p.gender === params.gender);
        }
        return result;
      }
    } catch (err) {
      console.warn('Backend unavailable, using local patient store:', err);
    }

    // Local fallback
    await new Promise(resolve => setTimeout(resolve, 200));
    let result = [...patientsStore];

    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        p =>
          p.fullName.toLowerCase().includes(q) ||
          p.mrn.toLowerCase().includes(q) ||
          p.phone.includes(q) ||
          (p.abhaId && p.abhaId.toLowerCase().includes(q))
      );
    }

    if (params?.department && params.department !== 'All') {
      result = result.filter(p => p.department === params.department);
    }

    if (params?.status && params.status !== 'All') {
      result = result.filter(p => p.status === params.status);
    }

    if (params?.gender && params.gender !== 'All') {
      result = result.filter(p => p.gender === params.gender);
    }

    return result;
  },

  async getPatientById(id: string): Promise<Patient | null> {
    // Try backend by ID or MRN
    try {
      const endpoint = /^\d+$/.test(id) ? `/patients/${id}` : `/patients/mrn/${id}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>(endpoint);
      if (res && res.data) {
        return dtoToPatient(res.data);
      }
    } catch {
      // Fallback to local
    }

    const patient = patientsStore.find(p => p.id === id || p.mrn === id);
    return patient || null;
  },

  async createPatient(input: PatientRegistrationInput): Promise<Patient> {
    // 1. Try persisting directly to PostgreSQL via Spring Boot backend
    try {
      const payload = {
        firstName: input.firstName,
        lastName: input.lastName,
        gender: input.gender.toUpperCase(),
        dateOfBirth: input.dob,
        bloodGroup: input.bloodGroup,
        phone: input.phone,
        email: input.email || undefined,
        address: input.address || undefined,
        city: input.city || undefined,
        emergencyContactName: input.emergencyContactName || undefined,
        emergencyContactPhone: input.emergencyContactPhone || undefined,
        insuranceProvider: input.insuranceProvider || undefined,
        insurancePolicyNumber: input.policyNumber || undefined,
        allergies: input.allergies ? input.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
        status: 'Active',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.post<any>('/patients', payload);

      if (response && response.data) {
        const savedPatient = dtoToPatient(response.data);
        // Retain client-only extra details
        savedPatient.middleName = input.middleName;
        savedPatient.state = input.state || 'CA';
        savedPatient.pinCode = input.pinCode || '94103';
        savedPatient.abhaId = input.abhaId;
        savedPatient.chronicConditions = input.chronicConditions
          ? input.chronicConditions.split(',').map(s => s.trim()).filter(Boolean)
          : [];
        savedPatient.currentMedications = input.currentMedications
          ? input.currentMedications.split(',').map(s => s.trim()).filter(Boolean)
          : [];

        patientsStore.unshift(savedPatient);

        timelineStore[savedPatient.id] = [
          {
            id: `tl-${Date.now()}`,
            patientId: savedPatient.id,
            date: savedPatient.registeredDate,
            time: 'Just now',
            title: 'Patient Registered in MediCore & PostgreSQL Database',
            description: `Electronic health record initialized and saved to PostgreSQL with MRN ${savedPatient.mrn}.`,
            category: 'admission',
            doctorOrUser: 'Admissions Desk',
            badge: 'Persisted to DB',
          },
        ];

        return savedPatient;
      }
    } catch (err) {
      console.warn('Failed to persist to Spring Boot backend, falling back to local store:', err);
    }

    // 2. Fallback to client-side creation if backend is offline
    await new Promise(resolve => setTimeout(resolve, 300));
    const birthYear = new Date(input.dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const calculatedAge = Math.max(1, currentYear - birthYear);
    const newSeq = (patientsStore.length + 1).toString().padStart(6, '0');
    const newMrn = `MC-2026-${newSeq}`;

    const newPatient: Patient = {
      id: `pat-${Date.now()}`,
      mrn: newMrn,
      firstName: input.firstName,
      middleName: input.middleName,
      lastName: input.lastName,
      fullName: [input.firstName, input.middleName, input.lastName].filter(Boolean).join(' '),
      dob: input.dob,
      age: calculatedAge,
      gender: input.gender,
      bloodGroup: input.bloodGroup,
      phone: input.phone,
      email: input.email || `${input.firstName.toLowerCase()}@medicore-demo.health`,
      address: input.address,
      city: input.city,
      state: input.state,
      pinCode: input.pinCode,
      abhaId: input.abhaId || `91-0000-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)} (Demo ABHA)`,
      emergencyContact: {
        name: input.emergencyContactName,
        relationship: input.emergencyContactRelationship,
        phone: input.emergencyContactPhone,
      },
      allergies: input.allergies ? input.allergies.split(',').map(s => s.trim()).filter(Boolean) : [],
      chronicConditions: input.chronicConditions ? input.chronicConditions.split(',').map(s => s.trim()).filter(Boolean) : [],
      currentMedications: input.currentMedications ? input.currentMedications.split(',').map(s => s.trim()).filter(Boolean) : [],
      insuranceProvider: input.insuranceProvider,
      policyNumber: input.policyNumber,
      status: 'Active',
      lastVisit: new Date().toISOString().split('T')[0],
      department: 'General Medicine',
      registeredDate: new Date().toISOString().split('T')[0],
    };

    patientsStore.unshift(newPatient);

    timelineStore[newPatient.id] = [
      {
        id: `tl-${Date.now()}`,
        patientId: newPatient.id,
        date: newPatient.registeredDate,
        time: 'Just now',
        title: 'Patient Registered in MediCore',
        description: `Electronic health record initialized with MRN ${newPatient.mrn}.`,
        category: 'admission',
        doctorOrUser: 'Admissions Desk',
        badge: 'Registered',
      },
    ];

    return newPatient;
  },

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const idx = patientsStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Patient not found');
    patientsStore[idx] = { ...patientsStore[idx], ...updates };
    return patientsStore[idx];
  },

  async getPatientTimeline(patientId: string): Promise<PatientTimelineItem[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return timelineStore[patientId] || timelineStore['pat-1'] || [];
  },

  async addTimelineItem(item: Omit<PatientTimelineItem, 'id'>): Promise<PatientTimelineItem> {
    const newItem: PatientTimelineItem = { ...item, id: `tl-${Date.now()}` };
    if (!timelineStore[item.patientId]) {
      timelineStore[item.patientId] = [];
    }
    timelineStore[item.patientId].unshift(newItem);
    return newItem;
  },
};
