import { PrescriptionMedicine } from './clinical';

export interface MedicineItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Analgesic' | 'Cardiovascular' | 'Antidiabetic' | 'Respiratory' | 'GI' | 'CNS';
  manufacturer: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  stockQuantity: number;
  reorderLevel: number;
  unit: string; // e.g. "Tablets", "Vials", "Syrup (ml)"
  mrp: number; // in INR ₹
  purchasePrice: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expiring';
  locationRack: string;
}

export interface PharmacyPrescriptionOrder {
  id: string; // RX-2026-9021
  patientId: string;
  patientName: string;
  mrn: string;
  prescribedBy: string;
  prescribedDate: string;
  items: PrescriptionMedicine[];
  status: 'Pending' | 'Partially Dispensed' | 'Dispensed' | 'Cancelled';
  totalAmount: number;
  dispensedBy?: string;
  dispensedAt?: string;
}

export interface InventoryItem {
  id: string;
  code: string;
  name: string;
  category: 'Surgical Supplies' | 'Medical Equipment' | 'PPE & Consumables' | 'Diagnostics & Reagents' | 'General';
  supplier: string;
  quantityOnHand: number;
  minReorderThreshold: number;
  unit: string;
  unitCost: number;
  lastRestockedDate: string;
  status: 'Optimal' | 'Low Stock' | 'Critical';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierName: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: number;
  itemCount: number;
  status: 'Draft' | 'Sent' | 'Partially Received' | 'Fulfilled' | 'Cancelled';
}
