export interface LabTestParameter {
  id: string;
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: 'Normal' | 'Low' | 'High' | 'Critical';
}

export interface LabOrder {
  id: string; // e.g. LAB-2026-0891
  patientId: string;
  patientName: string;
  mrn: string;
  testName: string;
  category: 'Hematology' | 'Biochemistry' | 'Microbiology' | 'Pathology' | 'Serology';
  orderedBy: string;
  orderedDate: string;
  sampleStatus: 'Pending Collection' | 'Sample Collected' | 'In Processing' | 'Completed';
  urgency: 'Routine' | 'Urgent' | 'Stat';
  resultsAvailable: boolean;
  status: 'Pending' | 'In Progress' | 'Awaiting Verification' | 'Verified';
}

export interface LabResultReport {
  id: string;
  orderId: string;
  patientId: string;
  patientName: string;
  mrn: string;
  age: number;
  gender: string;
  testName: string;
  category: string;
  collectedAt: string;
  reportedAt: string;
  verifiedBy: string;
  parameters: LabTestParameter[];
  clinicalInterpretation?: string;
  status: 'Draft' | 'Verified';
}

export interface RadiologyScan {
  id: string; // RAD-2026-4412
  patientId: string;
  patientName: string;
  mrn: string;
  modality: 'X-Ray' | 'CT' | 'MRI' | 'Ultrasound';
  bodyPart: string;
  orderedBy: string;
  orderedDate: string;
  scheduledTime: string;
  radiologist: string;
  status: 'Scheduled' | 'In Scan' | 'Images Uploaded' | 'Reported' | 'Verified';
  findings?: string;
  impression?: string;
}
