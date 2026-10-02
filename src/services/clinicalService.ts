import { ConsultationRecord, NursingTask, EmergencyPatient, OperationRecord } from '../types/clinical';
import { initialConsultation, initialNursingTasks, initialEmergencyPatients, initialOperations } from './mockData';
import { apiClient } from './apiClient';

let consultationsStore: Record<string, ConsultationRecord> = {
  'con-101': { ...initialConsultation },
  'pat-1': { ...initialConsultation },
  '1': { ...initialConsultation },
};

let nursingTasksStore: NursingTask[] = [...initialNursingTasks];
let emergencyPatientsStore: EmergencyPatient[] = [...initialEmergencyPatients];
let operationsStore: OperationRecord[] = [...initialOperations];

export const clinicalService = {
  async getConsultation(idOrPatientId: string): Promise<ConsultationRecord> {
    const numericPatientId = idOrPatientId.replace(/\D/g, '') || '1';

    // Attempt backend EMR query
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>(`/clinical/patients/${numericPatientId}/summary`);
      if (res && res.data) {
        const d = res.data;
        const v = d.vitals && d.vitals.length > 0 ? d.vitals[0] : null;
        const n = d.notes && d.notes.length > 0 ? d.notes[0] : null;
        const diagList = d.diagnoses ? d.diagnoses.map((dg: { description?: string; icd10Code?: string }) => dg.description || dg.icd10Code || '') : [];

        const record: ConsultationRecord = {
          ...initialConsultation,
          id: `con-${numericPatientId}`,
          patientId: idOrPatientId,
          chiefComplaint: n?.subjective || initialConsultation.chiefComplaint,
          physicalExamination: n?.objective || initialConsultation.physicalExamination,
          clinicalNotes: n?.plan || initialConsultation.clinicalNotes,
          provisionalDiagnosis: diagList.length > 0 ? diagList : initialConsultation.provisionalDiagnosis,
          finalDiagnosis: diagList.length > 0 ? diagList : initialConsultation.finalDiagnosis,
          vitals: v ? {
            bloodPressureSystolic: v.systolicBp || 120,
            bloodPressureDiastolic: v.diastolicBp || 80,
            pulseRate: v.heartRate || 72,
            temperature: Number(v.temperature) || 98.6,
            respiratoryRate: v.respiratoryRate || 16,
            spO2: Number(v.oxygenSaturation) || 99,
            weight: Number(v.weight) || 68,
            height: Number(v.height) || 170,
            bmi: Number(v.bmi) || 23.5,
            recordedAt: v.recordedAt,
            recordedBy: v.recordedBy,
          } : initialConsultation.vitals,
        };

        consultationsStore[idOrPatientId] = record;
        return record;
      }
    } catch (err) {
      console.warn('Backend clinical query failed, using local store:', err);
    }

    if (consultationsStore[idOrPatientId]) {
      return consultationsStore[idOrPatientId];
    }

    return {
      ...initialConsultation,
      id: `con-${idOrPatientId}`,
      patientId: idOrPatientId,
    };
  },

  async saveConsultation(consultation: ConsultationRecord): Promise<ConsultationRecord> {
    const numericPatientId = Number(consultation.patientId.replace(/\D/g, '')) || 1;

    // Attempt backend persistence
    try {
      // 1. Post Vitals
      if (consultation.vitals) {
        await apiClient.post(`/clinical/patients/${numericPatientId}/vitals`, {
          systolicBp: consultation.vitals.bloodPressureSystolic,
          diastolicBp: consultation.vitals.bloodPressureDiastolic,
          heartRate: consultation.vitals.pulseRate,
          temperature: consultation.vitals.temperature,
          respiratoryRate: consultation.vitals.respiratoryRate,
          oxygenSaturation: consultation.vitals.spO2,
          weight: consultation.vitals.weight,
          height: consultation.vitals.height,
          recordedBy: consultation.doctorName || 'Attending Physician',
        });
      }

      // 2. Post Clinical SOAP Note
      await apiClient.post(`/clinical/patients/${numericPatientId}/notes`, {
        noteType: 'SOAP',
        subjective: consultation.chiefComplaint,
        objective: consultation.physicalExamination,
        assessment: consultation.provisionalDiagnosis.join(', ') || 'Clinical Evaluation',
        plan: consultation.clinicalNotes || consultation.followUpInstructions || 'Continue advised regimen',
        summary: `${consultation.chiefComplaint} - ${consultation.doctorName}`,
      });

      // 3. Post Diagnosis
      if (consultation.provisionalDiagnosis.length > 0) {
        await apiClient.post(`/clinical/patients/${numericPatientId}/diagnoses`, {
          icd10Code: 'Z00.0',
          description: consultation.provisionalDiagnosis[0],
          type: 'PRIMARY',
          status: 'CONFIRMED',
          diagnosedDate: new Date().toISOString().split('T')[0],
        });
      }

      // 4. Post Prescriptions
      if (consultation.prescriptions && consultation.prescriptions.length > 0) {
        await apiClient.post(`/clinical/patients/${numericPatientId}/prescriptions`, {
          instructions: consultation.prescriptions
            .map(p => `${p.medicineName} (${p.dosage}) ${p.frequency} x ${p.durationDays}d`)
            .join('; '),
          status: 'ACTIVE',
        });
      }
    } catch (err) {
      console.warn('Backend clinical save failed, caching in local store:', err);
    }

    consultationsStore[consultation.id] = consultation;
    consultationsStore[consultation.patientId] = consultation;
    return consultation;
  },

  async getNursingTasks(): Promise<NursingTask[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...nursingTasksStore];
  },

  async completeNursingTask(id: string, nurseName: string): Promise<NursingTask> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idx = nursingTasksStore.findIndex(t => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    nursingTasksStore[idx] = {
      ...nursingTasksStore[idx],
      status: 'Completed',
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      nurseName,
    };
    return nursingTasksStore[idx];
  },

  async getEmergencyPatients(): Promise<EmergencyPatient[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...emergencyPatientsStore];
  },

  async updateEmergencyTriage(id: string, triageLevel: EmergencyPatient['triageLevel']): Promise<EmergencyPatient> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idx = emergencyPatientsStore.findIndex(e => e.id === id);
    if (idx === -1) throw new Error('Emergency record not found');
    emergencyPatientsStore[idx].triageLevel = triageLevel;
    return emergencyPatientsStore[idx];
  },

  async getOperations(): Promise<OperationRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [...operationsStore];
  },

  async updateOperationStatus(id: string, status: OperationRecord['status']): Promise<OperationRecord> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const idx = operationsStore.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('Operation record not found');
    operationsStore[idx].status = status;
    return operationsStore[idx];
  }
};
