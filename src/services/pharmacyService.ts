import { MedicineItem, PharmacyPrescriptionOrder, InventoryItem } from '../types/pharmacy';
import { initialMedicines, initialPrescriptionOrders, initialInventoryItems } from './mockData';
import { apiClient } from './apiClient';

let medicinesStore: MedicineItem[] = [...initialMedicines];
let prescriptionOrdersStore: PharmacyPrescriptionOrder[] = [...initialPrescriptionOrders];
let inventoryItemsStore: InventoryItem[] = [...initialInventoryItems];

export const pharmacyService = {
  async getMedicines(params?: { search?: string; status?: string; category?: string }): Promise<MedicineItem[]> {
    // Attempt backend query
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/pharmacy/medicines');
      if (res && res.data && Array.isArray(res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendMeds: MedicineItem[] = res.data.map((m: any) => ({
          id: String(m.id),
          name: m.name,
          genericName: m.genericName || m.name,
          category: m.category || 'Cardiovascular',
          dosageForm: m.dosageForm || 'Tablet',
          strength: m.strength || 'Standard',
          stockQuantity: m.stockQuantity ?? 120,
          reorderLevel: m.reorderLevel ?? 25,
          unitPrice: Number(m.unitPrice) || 15.00,
          mrp: Number(m.mrp || m.unitPrice * 1.15) || 18.00,
          manufacturer: m.manufacturer || 'Apex Health Pharma',
          batchNumber: m.batchNumber || `BAT-2026-${m.id}09`,
          expiryDate: m.expiryDate || '2027-10-31',
          prescriptionRequired: m.prescriptionRequired ?? true,
          status: m.stockQuantity === 0 ? 'Out of Stock' : (m.stockQuantity <= 25 ? 'Low Stock' : 'In Stock'),
          location: m.rackLocation || 'Rack B-04',
        }));

        backendMeds.forEach(bm => {
          const idx = medicinesStore.findIndex(m => m.id === bm.id || m.name.toLowerCase() === bm.name.toLowerCase());
          if (idx >= 0) medicinesStore[idx] = bm;
          else medicinesStore.push(bm);
        });
      }
    } catch (err) {
      console.warn('Backend medicines query failed, using local store:', err);
    }

    let result = [...medicinesStore];
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        m => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q) || m.batchNumber.toLowerCase().includes(q)
      );
    }
    if (params?.status && params.status !== 'All') {
      result = result.filter(m => m.status === params.status);
    }
    if (params?.category && params.category !== 'All') {
      result = result.filter(m => m.category === params.category);
    }
    return result;
  },

  async addMedicine(medicine: Omit<MedicineItem, 'id'>): Promise<MedicineItem> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const newMed: MedicineItem = {
      ...medicine,
      id: `med-${Date.now()}`,
    };
    medicinesStore.unshift(newMed);
    return newMed;
  },

  async updateStock(id: string, newStock: number): Promise<MedicineItem> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idx = medicinesStore.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('Medicine not found');
    const item = medicinesStore[idx];
    item.stockQuantity = newStock;
    if (newStock === 0) item.status = 'Out of Stock';
    else if (newStock <= item.reorderLevel) item.status = 'Low Stock';
    else item.status = 'In Stock';
    return item;
  },

  async getPrescriptions(status?: string): Promise<PharmacyPrescriptionOrder[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (!status || status === 'All') return [...prescriptionOrdersStore];
    return prescriptionOrdersStore.filter(p => p.status === status);
  },

  async dispensePrescription(orderId: string, dispensedBy: string): Promise<PharmacyPrescriptionOrder> {
    const numId = Number(orderId.replace(/\D/g, '')) || 1;

    // Attempt backend dispensation persistence
    try {
      await apiClient.post('/pharmacy/dispense', {
        patientId: 1,
        prescriptionId: numId,
        dispensedBy: dispensedBy || 'Clinical Pharmacist',
        totalAmount: 38.50,
      });
    } catch (err) {
      console.warn('Backend dispense call failed, recording in local store:', err);
    }

    const idx = prescriptionOrdersStore.findIndex(p => p.id === orderId);
    if (idx === -1) throw new Error('Prescription order not found');
    prescriptionOrdersStore[idx].status = 'Dispensed';
    prescriptionOrdersStore[idx].dispensedBy = dispensedBy;
    prescriptionOrdersStore[idx].dispensedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return prescriptionOrdersStore[idx];
  },

  async getGeneralInventory(): Promise<InventoryItem[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...inventoryItemsStore];
  },

  async updateInventoryStock(id: string, qty: number): Promise<InventoryItem> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idx = inventoryItemsStore.findIndex(i => i.id === id);
    if (idx === -1) throw new Error('Item not found');
    inventoryItemsStore[idx].quantityOnHand = qty;
    return inventoryItemsStore[idx];
  }
};
