export type BedStatus = 'Available' | 'Occupied' | 'Reserved' | 'Cleaning' | 'Maintenance';

export interface Bed {
  id: string; // BED-ICU-04
  bedNumber: string;
  roomNumber: string;
  wardName: string;
  floor: string; // e.g. "3rd Floor"
  building: string; // "Tower A" | "Tower B"
  category: 'ICU' | 'General' | 'Private' | 'Emergency' | 'Pediatric' | 'Maternity';
  status: BedStatus;
  currentPatientId?: string;
  currentPatientName?: string;
  currentPatientMrn?: string;
  admittedDate?: string;
  attendingDoctor?: string;
  dailyRate: number;
}

export interface InpatientAdmission {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: string;
  admissionDate: string;
  expectedDischargeDate?: string;
  department: string;
  admittingDoctor: string;
  building: string;
  ward: string;
  roomBed: string;
  bedId: string;
  diagnosis: string;
  status: 'Active' | 'Discharge Pending' | 'Discharged' | 'Transferred';
  dailyProgressNotesCount: number;
}

export interface BloodStockItem {
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  unitsAvailable: number;
  reservedUnits: number;
  criticalThreshold: number;
  lastUpdated: string;
}

export interface AmbulanceVehicle {
  id: string;
  vehicleNumber: string; // MH 12 AB 9901
  type: 'Advanced Life Support (ALS)' | 'Basic Life Support (BLS)' | 'Patient Transport';
  driverName: string;
  driverPhone: string;
  paramedicName: string;
  status: 'Available' | 'On Trip' | 'Maintenance';
  currentLocation: string;
  fuelLevelPercent: number;
  lastMaintenanceDate: string;
}

export interface StaffMember {
  id: string;
  employeeId: string; // EMP-2026-081
  name: string;
  role: 'Doctor' | 'Head Nurse' | 'Staff Nurse' | 'Pharmacist' | 'Lab Technician' | 'Radiologist' | 'Billing Executive' | 'Receptionist' | 'Administrator';
  department: string;
  phone: string;
  email: string;
  shift: 'Morning (08:00 - 16:00)' | 'Evening (16:00 - 00:00)' | 'Night (00:00 - 08:00)' | 'General (09:00 - 18:00)';
  status: 'On Duty' | 'Off Duty' | 'On Leave';
  joiningDate: string;
}
