import { Invoice, PaymentRecord, InsuranceClaim } from '../types/billing';
import { initialInvoices, initialPayments, initialInsuranceClaims } from './mockData';
import { apiClient } from './apiClient';

let invoicesStore: Invoice[] = [...initialInvoices];
const paymentsStore: PaymentRecord[] = [...initialPayments];
const claimsStore: InsuranceClaim[] = [...initialInsuranceClaims];

function normalizeInvoiceStatus(s?: string): Invoice['status'] {
  if (!s) return 'Unpaid';
  const u = s.toUpperCase();
  if (u === 'PAID') return 'Paid';
  if (u === 'PARTIALLY_PAID' || u === 'PARTIAL') return 'Partially Paid';
  if (u === 'OVERDUE') return 'Overdue';
  if (u === 'REFUNDED') return 'Refunded';
  return 'Unpaid';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dtoToInvoice(dto: any): Invoice {
  const subtotal = Number(dto.subtotal ?? dto.totalAmount ?? 0);
  const discount = Number(dto.discount ?? 0);
  const total = Number(dto.totalAmount ?? 0);
  const paid = Number(dto.paidAmount ?? 0);
  const balance = Number(dto.balanceAmount ?? (total - paid));

  return {
    id: String(dto.id),
    invoiceNumber: dto.invoiceNumber || `INV-${dto.id}`,
    patientId: String(dto.patient?.id || dto.patientId || '1'),
    patientName: dto.patient ? `${dto.patient.firstName} ${dto.patient.lastName}` : 'Patient',
    patientMrn: dto.patient?.mrn || 'MC-2026-001',
    patientPhone: dto.patient?.phone || '',
    date: dto.createdAt ? dto.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
    dueDate: dto.dueDate || new Date().toISOString().split('T')[0],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: Array.isArray(dto.items) ? dto.items.map((it: any) => ({
      id: String(it.id || Date.now()),
      description: it.description || 'Medical service',
      category: 'Consultation',
      quantity: Number(it.quantity || 1),
      unitPrice: Number(it.unitPrice || 0),
      totalPrice: Number(it.totalPrice || 0),
    })) : [],
    subtotal,
    discountAmount: discount,
    taxAmount: Number(dto.tax ?? 0),
    totalAmount: total,
    amountPaid: paid,
    balanceDue: balance,
    status: normalizeInvoiceStatus(dto.status),
    notes: dto.notes,
  };
}

export const billingService = {
  async getInvoices(status?: string): Promise<Invoice[]> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/billing/invoices', {
        status: status && status !== 'All' ? status.toUpperCase() : undefined,
      });

      if (res && res.data && Array.isArray(res.data.content)) {
        const backendInvs = res.data.content.map(dtoToInvoice);
        backendInvs.forEach((bi: Invoice) => {
          const idx = invoicesStore.findIndex(i => i.id === bi.id || i.invoiceNumber === bi.invoiceNumber);
          if (idx >= 0) {
            invoicesStore[idx] = bi;
          } else {
            invoicesStore.push(bi);
          }
        });
      }
    } catch (err) {
      console.warn('Backend billing query failed, using local store:', err);
    }

    if (!status || status === 'All') return [...invoicesStore];
    return invoicesStore.filter(i => i.status === status);
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      if (/^\d+$/.test(id)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await apiClient.get<any>(`/billing/invoices/${id}`);
        if (res && res.data) {
          return dtoToInvoice(res.data);
        }
      }
    } catch {
      // Fallback
    }
    return invoicesStore.find(i => i.id === id || i.invoiceNumber === id) || null;
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'invoiceNumber'>): Promise<Invoice> {
    try {
      const payload = {
        patientId: Number(invoice.patientId) || 1,
        discount: invoice.discountAmount || 0,
        notes: invoice.notes,
        items: invoice.items.map(it => ({
          itemType: 'SERVICE',
          description: it.description,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
          totalPrice: it.totalPrice,
        })),
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.post<any>('/billing/invoices', payload);
      if (res && res.data) {
        const saved = dtoToInvoice(res.data);
        saved.patientName = invoice.patientName;
        saved.patientMrn = invoice.patientMrn;
        invoicesStore.unshift(saved);
        return saved;
      }
    } catch (err) {
      console.warn('Failed to persist invoice to backend, using local store:', err);
    }

    const invNum = `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const newInv: Invoice = {
      ...invoice,
      id: `inv-${Date.now()}`,
      invoiceNumber: invNum,
    };
    invoicesStore.unshift(newInv);
    return newInv;
  },

  async getPayments(): Promise<PaymentRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...paymentsStore];
  },

  async recordPayment(payment: Omit<PaymentRecord, 'id' | 'date'>): Promise<PaymentRecord> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPay: PaymentRecord = {
      ...payment,
      id: `pay-${Date.now()}`,
      date: new Date().toLocaleString(),
    };
    paymentsStore.unshift(newPay);

    // Update invoice if found
    const inv = invoicesStore.find(i => i.invoiceNumber === payment.invoiceNumber);
    if (inv) {
      inv.amountPaid += payment.amount;
      inv.balanceDue = Math.max(0, inv.totalAmount - inv.amountPaid);
      if (inv.balanceDue === 0) {
        inv.status = 'Paid';
      } else {
        inv.status = 'Partially Paid';
      }
      inv.paymentMethod = payment.paymentMethod;
    }

    return newPay;
  },

  async getInsuranceClaims(status?: string): Promise<InsuranceClaim[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (!status || status === 'All') return [...claimsStore];
    return claimsStore.filter(c => c.status === status);
  },

  async updateClaimStatus(id: string, status: InsuranceClaim['status'], approvedAmount?: number): Promise<InsuranceClaim> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = claimsStore.findIndex(c => c.id === id);
    if (idx === -1) throw new Error('Claim not found');
    claimsStore[idx].status = status;
    if (approvedAmount !== undefined) {
      claimsStore[idx].approvedAmount = approvedAmount;
    }
    return claimsStore[idx];
  },
};
