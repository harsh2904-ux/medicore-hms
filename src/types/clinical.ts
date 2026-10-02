export interface Vitals {
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulseRate: number; // bpm
  temperature: number; // °F
  respiratoryRate: number; // breaths/min
  spO2: number; // %
  weight: number; // kg
  height: number; // cm
  bmi?: number;
  recordedAt?: string;
  recordedBy?: string;
}

export interface PrescriptionMedicine {
  id: string;
  medicineName: string;
  genericName: string;
  dosage: string; // e.g. "500 mg"
  route: 'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Sublingual';
  frequency: 'Once daily' | 'Twice daily (BD)' | 'Thrice daily (TDS)' | 'Four times daily (QID)' | 'SOS / As needed' | 'Before bed';
  durationDays: number;
  instructions: string; // e.g. "After meals with water"
}

export interface ConsultationRecord {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  vitals: Vitals;
  physicalExamination: string;
  provisionalDiagnosis: string[];
  finalDiagnosis: string[];
  clinicalNotes: string;
  prescriptions: PrescriptionMedicine[];
  labOrdersOrdered: string[];
  radiologyOrdersOrdered: string[];
  followUpDate?: string;
  followUpInstructions?: string;
  status: 'Draft' | 'Completed';
}

export interface NursingTask {
  id: string;
  patientId: string;
  patientName: string;
  roomBed: string;
  taskType: 'Vitals Check' | 'Medication Administration' | 'IV Drip Change' | 'Wound Dressing' | 'Sample Collection';
  dueTime: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'Completed' | 'Overdue';
  instructions: string;
  completedAt?: string;
  nurseName?: string;
}

export interface EmergencyPatient {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: string;
  arrivalTime: string;
  triageLevel: 'Critical' | 'Urgent' | 'Stable';
  vitals: Vitals;
  assignedDoctor: string;
  chiefComplaint: string;
  status: 'Triage' | 'Under Care' | 'Awaiting Orders' | 'Admitted' | 'Discharged';
  bayNumber: string;
}

export interface OperationRecord {
  id: string;
  otNumber: string; // e.g. OT-1
  patientId: string;
  patientName: string;
  mrn: string;
  procedureName: string;
  leadSurgeon: string;
  anesthetist: string;
  scrubNurse: string;
  scheduledDate: string;
  scheduledTime: string;
  durationEstMinutes: number;
  status: 'Scheduled' | 'Pre-Op' | 'In Progress' | 'Post-Op Recovery' | 'Completed';
  preOpChecklistComplete: boolean;
  notes?: string;
}
