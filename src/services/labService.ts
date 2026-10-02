import { LabOrder, LabResultReport, RadiologyScan } from '../types/diagnostics';
import { initialLabOrders, initialLabResultReports, initialRadiologyScans } from './mockData';
import { apiClient } from './apiClient';

let labOrdersStore: LabOrder[] = [...initialLabOrders];
let labReportsStore: Record<string, LabResultReport> = { ...initialLabResultReports };
let radiologyScansStore: RadiologyScan[] = [...initialRadiologyScans];

export const labService = {
  async getLabOrders(params?: { category?: string; status?: string }): Promise<LabOrder[]> {
    // Attempt backend query
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/laboratory/orders');
      if (res && res.data && Array.isArray(res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendOrders: LabOrder[] = res.data.map((o: any) => ({
          id: String(o.id),
          orderNumber: o.orderNumber || `LAB-2026-0${o.id}`,
          patientId: String(o.patient?.id || o.patientId || 1),
          patientName: o.patient ? `${o.patient.firstName || ''} ${o.patient.lastName || ''}`.trim() : 'Eleanor Vance',
          patientMrn: o.patient?.mrn || 'MC-2026-001',
          patientAge: o.patient?.age || 35,
          patientGender: o.patient?.gender === 'FEMALE' ? 'Female' : 'Male',
          testId: String(o.test?.id || o.testId || 1),
          testName: o.test?.name || 'Diagnostic Panel',
          category: o.test?.category || 'Hematology',
          specimenType: o.specimenType || 'Blood',
          doctorId: String(o.doctor?.id || o.doctorId || 1),
          doctorName: o.doctor?.name || 'Dr. Rajesh Mehta',
          orderedDate: o.orderedAt ? o.orderedAt.split('T')[0] : new Date().toISOString().split('T')[0],
          orderedTime: o.orderedAt ? o.orderedAt.split('T')[1].slice(0, 5) : '09:30',
          priority: o.priority === 'STAT' ? 'STAT' : (o.priority === 'URGENT' ? 'Urgent' : 'Routine'),
          status: o.status === 'VERIFIED' ? 'Verified' : (o.status === 'COMPLETED' ? 'Completed' : (o.status === 'IN_PROGRESS' ? 'In Progress' : 'Pending')),
          sampleStatus: o.status === 'VERIFIED' ? 'Completed' : 'Collected',
          clinicalNotes: o.clinicalNotes || 'Routine diagnostic evaluation',
        }));

        backendOrders.forEach(bo => {
          const idx = labOrdersStore.findIndex(lo => lo.id === bo.id);
          if (idx >= 0) labOrdersStore[idx] = bo;
          else labOrdersStore.unshift(bo);
        });
      }
    } catch (err) {
      console.warn('Backend lab orders query failed, using local store:', err);
    }

    let result = [...labOrdersStore];
    if (params?.category && params.category !== 'All') {
      result = result.filter(o => o.category === params.category);
    }
    if (params?.status && params.status !== 'All') {
      result = result.filter(o => o.status === params.status);
    }
    return result;
  },

  async getLabResultReport(orderId: string): Promise<LabResultReport | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return labReportsStore[orderId] || labReportsStore['LAB-2026-0891'] || null;
  },

  async verifyLabResult(orderId: string, verifiedBy: string): Promise<LabResultReport> {
    const numOrderId = Number(orderId.replace(/\D/g, '')) || 1;

    // Attempt backend lab result record
    try {
      await apiClient.post(`/laboratory/orders/${numOrderId}/results`, {
        testId: 1,
        resultValue: 'Verified Normal',
        flag: 'NORMAL',
        notes: 'Values within biological reference intervals.',
        verifiedBy: verifiedBy || 'Chief Medical Technologist',
      });
    } catch (err) {
      console.warn('Backend lab result verification failed, saving in local store:', err);
    }

    const report = labReportsStore[orderId] || labReportsStore['LAB-2026-0891'];
    if (report) {
      report.status = 'Verified';
      report.verifiedBy = verifiedBy;
      report.reportedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const orderIdx = labOrdersStore.findIndex(o => o.id === orderId);
    if (orderIdx !== -1) {
      labOrdersStore[orderIdx].status = 'Verified';
      labOrdersStore[orderIdx].sampleStatus = 'Completed';
    }
    return report;
  },

  async updateParameterValue(orderId: string, paramId: string, newValue: string): Promise<LabResultReport> {
    const report = labReportsStore[orderId] || labReportsStore['LAB-2026-0891'];
    if (report) {
      const pIdx = report.parameters.findIndex(p => p.id === paramId);
      if (pIdx !== -1) {
        report.parameters[pIdx].value = newValue;
      }
    }
    return report;
  },

  async getRadiologyScans(params?: { modality?: string; status?: string }): Promise<RadiologyScan[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    let result = [...radiologyScansStore];
    if (params?.modality && params.modality !== 'All') {
      result = result.filter(s => s.modality === params.modality);
    }
    if (params?.status && params.status !== 'All') {
      result = result.filter(s => s.status === params.status);
    }
    return result;
  },

  async saveRadiologyReport(id: string, findings: string, impression: string, radiologist: string): Promise<RadiologyScan> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = radiologyScansStore.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Scan not found');
    radiologyScansStore[idx] = {
      ...radiologyScansStore[idx],
      findings,
      impression,
      radiologist,
      status: 'Verified',
    };
    return radiologyScansStore[idx];
  }
};
