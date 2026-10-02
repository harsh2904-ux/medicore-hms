export interface Patient {
  id: string;
  mrn: string; // Medical Record Number, e.g. MC-2026-001284
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  abhaId?: string; // Demo ABHA identifier
  govtIdType?: 'Aadhaar' | 'PAN' | 'Passport' | 'Voter ID';
  govtIdNumber?: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  insuranceProvider?: string;
  policyNumber?: string;
  status: 'Active' | 'Inpatient' | 'Discharged' | 'Critical';
  lastVisit: string;
  department: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  registeredDate: string;
  avatarUrl?: string;
}

export interface PatientRegistrationInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  abhaId?: string;
  govtIdType?: string;
  govtIdNumber?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export interface PatientTimelineItem {
  id: string;
  patientId: string;
  date: string;
  time: string;
  title: string;
  description: string;
  category: 'consultation' | 'lab' | 'radiology' | 'prescription' | 'billing' | 'admission' | 'discharge';
  doctorOrUser: string;
  badge?: string;
}
