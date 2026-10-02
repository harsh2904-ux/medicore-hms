export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Laboratory' | 'Radiology' | 'Pharmacy' | 'Room & Nursing' | 'Surgery' | 'Consumables';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Invoice {
  id: string; // INV-2026-00431
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'Insurance / TPA' | 'Bank Transfer';
  status: 'Paid' | 'Partially Paid' | 'Unpaid' | 'Overdue' | 'Refunded';
  insuranceClaimId?: string;
  notes?: string;
}

export interface PaymentRecord {
  id: string; // PAY-2026-8812
  invoiceNumber: string;
  patientName: string;
  amount: number;
  paymentMethod: 'Cash' | 'Card' | 'UPI' | 'Insurance / TPA';
  transactionReference: string;
  date: string;
  receivedBy: string;
  status: 'Successful' | 'Pending' | 'Failed' | 'Refunded';
}

export interface InsuranceClaim {
  id: string; // CLM-2026-102
  patientId: string;
  patientName: string;
  mrn: string;
  insuranceProvider: string;
  tpaName: string;
  policyNumber: string;
  claimAmount: number;
  approvedAmount?: number;
  submittedDate: string;
  settledDate?: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'Settled';
  preAuthStatus: 'Approved' | 'Pending' | 'Not Required';
  denialReason?: string;
}
