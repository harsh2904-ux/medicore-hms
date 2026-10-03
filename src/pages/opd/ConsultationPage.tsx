import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clinicalService } from '../../services/clinicalService';
import { patientService } from '../../services/patientService';
import { Patient } from '../../types/patient';
import { ConsultationRecord, PrescriptionMedicine, Vitals } from '../../types/clinical';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { useNotification } from '../../context/NotificationContext';
import {
  Stethoscope,
  Heart,
  Activity,
  AlertTriangle,
  Pill,
  FlaskConical,
  Scan,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  ArrowLeft,
  CalendarCheck,
  Printer,
  Brain,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { PrintPrescriptionModal } from '../../components/clinical/PrintPrescriptionModal';
import { clinicalSafetyEngine, ClinicalSafetyReport } from '../../utils/clinicalSafetyEngine';
import { ClinicalSafetyAlertModal } from '../../components/clinical/ClinicalSafetyAlertModal';
import { aiMedicalService } from '../../services/aiMedicalService';

export const ConsultationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useNotification();

  const [patient, setPatient] = useState<Patient | null>(null);
  const [consultation, setConsultation] = useState<ConsultationRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPrintRxModalOpen, setIsPrintRxModalOpen] = useState(false);

  // Clinical Safety & AI States
  const [safetyReport, setSafetyReport] = useState<ClinicalSafetyReport | null>(null);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [pendingMedicine, setPendingMedicine] = useState<PrescriptionMedicine | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPresetSelected, setAiPresetSelected] = useState<string | null>(null);

  // Form states
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [historyOfIllness, setHistoryOfIllness] = useState('');
  const [vitals, setVitals] = useState<Vitals>({
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    pulseRate: 72,
    temperature: 98.6,
    respiratoryRate: 16,
    spO2: 99,
    weight: 70,
    height: 172,
    bmi: 23.7,
  });
  const [physicalExam, setPhysicalExam] = useState('');
  const [provisionalDiagnosis, setProvisionalDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescriptions, setPrescriptions] = useState<PrescriptionMedicine[]>([]);
  const [labOrders, setLabOrders] = useState<string[]>([]);
  const [radiologyOrders, setRadiologyOrders] = useState<string[]>([]);
  const [followUpDate, setFollowUpDate] = useState('2026-10-07');
  const [followUpInstructions, setFollowUpInstructions] = useState('Review in OPD with investigation reports');

  // New medicine quick input state
  const [medName, setMedName] = useState('');
  const [medDose, setMedDose] = useState('1 Tablet');
  const [medRoute, setMedRoute] = useState<'Oral' | 'IV' | 'IM' | 'Topical' | 'Inhalation' | 'Sublingual'>('Oral');
  const [medFrequency, setMedFrequency] = useState<'Once daily' | 'Twice daily (BD)' | 'Thrice daily (TDS)' | 'Four times daily (QID)' | 'SOS / As needed' | 'Before bed'>('Once daily');
  const [medDuration, setMedDuration] = useState(14);
  const [medInstructions, setMedInstructions] = useState('After meals with water');

  useEffect(() => {
    const loadData = async () => {
      try {
        const pId = id || 'pat-1';
        let p = await patientService.getPatientById(pId);
        if (!p) {
          p = await patientService.getPatientById('pat-1');
        }
        setPatient(p);

        const con = await clinicalService.getConsultation(pId);
        setConsultation(con);

        // Populate fields
        setChiefComplaint(con.chiefComplaint || 'Chest tightness on brisk walking for 3 days');
        setHistoryOfIllness(con.historyOfPresentIllness || 'Patient reports retrosternal ache, relieving with rest');
        setVitals(con.vitals || vitals);
        setPhysicalExam(con.physicalExamination || 'S1 S2 normal. Chest clear. No pedal edema.');
        setProvisionalDiagnosis(con.provisionalDiagnosis?.join(', ') || 'Angina pectoris, Essential Hypertension');
        setClinicalNotes(con.clinicalNotes || 'Advised resting ECG and cardiac markers. Continue low salt diet.');
        setPrescriptions(con.prescriptions || []);
        setLabOrders(con.labOrdersOrdered || ['Complete Blood Count (CBC)', 'Lipid Profile Comprehensive']);
        setRadiologyOrders(con.radiologyOrdersOrdered || ['Chest X-Ray PA View']);
        if (con.followUpDate) setFollowUpDate(con.followUpDate);
      } catch {
        showToast('Error loading consultation record', 'error');
      }
    };
    loadData();
  }, [id]);

  // Recalculate BMI whenever height or weight changes
  const handleVitalsChange = (key: keyof Vitals, val: number) => {
    setVitals(prev => {
      const updated = { ...prev, [key]: val };
      if (updated.height > 0 && updated.weight > 0) {
        const heightM = updated.height / 100;
        updated.bmi = parseFloat((updated.weight / (heightM * heightM)).toFixed(1));
      }
      return updated;
    });
  };

  const handleAddMedicine = () => {
    if (!medName.trim()) {
      showToast('Please enter a medicine name', 'warning');
      return;
    }
    const newMed: PrescriptionMedicine = {
      id: `rx-${Date.now()}`,
      medicineName: medName,
      genericName: medName,
      dosage: medDose,
      route: medRoute,
      frequency: medFrequency,
      durationDays: medDuration,
      instructions: medInstructions,
    };

    // Clinical Safety Guard Check (Allergies + Drug-Drug Interactions)
    const report = clinicalSafetyEngine.evaluatePrescriptionSafety(
      patient?.allergies,
      prescriptions.map(p => p.medicineName),
      medName
    );

    if (report.hasAlert) {
      setSafetyReport(report);
      setPendingMedicine(newMed);
      setIsSafetyModalOpen(true);
      return;
    }

    setPrescriptions(prev => [...prev, newMed]);
    setMedName('');
    showToast(`Added ${newMed.medicineName} to prescription`, 'info');
  };

  const handleSafetyOverride = (rationale: string) => {
    if (!pendingMedicine) return;
    const overriddenMed: PrescriptionMedicine = {
      ...pendingMedicine,
      instructions: `${pendingMedicine.instructions} [Clinical Override: ${rationale}]`,
    };
    setPrescriptions(prev => [...prev, overriddenMed]);
    setPendingMedicine(null);
    setSafetyReport(null);
    setMedName('');
    showToast(`Added ${overriddenMed.medicineName} with clinical safety override logged.`, 'warning', 'Override Logged');
  };

  const handleApplyAiPreset = async (presetId: string) => {
    setIsAiLoading(true);
    setAiPresetSelected(presetId);
    try {
      const plan = await aiMedicalService.generateClinicalPlan(presetId, chiefComplaint);
      
      // Auto-fill diagnosis with ICD-10
      setProvisionalDiagnosis(`${plan.provisionalDiagnosis} [ICD-10: ${plan.icd10Code}]`);
      
      // Auto-fill SOAP Clinical Notes
      setClinicalNotes(
        `SOAP CLINICAL EVALUATION:\n` +
        `• Subjective: ${plan.soapNotes.subjective}\n` +
        `• Objective: ${plan.soapNotes.objective}\n` +
        `• Assessment: ${plan.soapNotes.assessment}\n` +
        `• Plan: ${plan.soapNotes.plan}`
      );

      // Auto-fill medications
      const newMeds: PrescriptionMedicine[] = plan.recommendedMedications.map((m, idx) => ({
        id: `rx-ai-${Date.now()}-${idx}`,
        medicineName: m.name,
        genericName: m.name,
        dosage: m.dosage,
        route: m.route,
        frequency: m.frequency,
        durationDays: m.duration,
        instructions: m.instructions,
      }));
      setPrescriptions(newMeds);

      // Auto-fill lab & radiology orders
      setLabOrders(plan.recommendedLabs);
      setRadiologyOrders(plan.recommendedRadiology);
      setFollowUpInstructions(plan.lifestyleAdvice);

      showToast(`Applied ${plan.provisionalDiagnosis} AI clinical bundle`, 'success', 'AI Scribe Active');
    } catch {
      showToast('Failed to generate AI plan', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleRemoveMedicine = (medId: string) => {
    setPrescriptions(prev => prev.filter(m => m.id !== medId));
  };

  const handleSave = async (status: 'Draft' | 'Completed') => {
    if (!patient) return;
    setIsSaving(true);
    try {
      const record: ConsultationRecord = {
        id: consultation?.id || `con-${Date.now()}`,
        patientId: patient.id,
        patientName: patient.fullName,
        mrn: patient.mrn,
        doctorId: 'doc-1',
        doctorName: 'Dr. Rajesh Mehta',
        department: 'Cardiology',
        date: '2026-09-30',
        time: '10:00 AM',
        chiefComplaint,
        historyOfPresentIllness: historyOfIllness,
        vitals,
        physicalExamination: physicalExam,
        provisionalDiagnosis: provisionalDiagnosis.split(',').map(s => s.trim()).filter(Boolean),
        finalDiagnosis: provisionalDiagnosis.split(',').map(s => s.trim()).filter(Boolean),
        clinicalNotes,
        prescriptions,
        labOrdersOrdered: labOrders,
        radiologyOrdersOrdered: radiologyOrders,
        followUpDate,
        followUpInstructions,
        status,
      };

      await clinicalService.saveConsultation(record);

      if (status === 'Completed') {
        showToast('Consultation completed and pushed to EMR & Pharmacy!', 'success', 'Encounter Closed');
        navigate(`/patients/${patient.id}`);
      } else {
        showToast('Consultation draft saved successfully', 'info');
      }
    } catch {
      showToast('Failed to save consultation', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!patient) return <div className="py-12 text-center text-text-muted">Loading workspace...</div>;

  return (
    <div className="space-y-4">
      {/* Top Bar with Patient Summary and Action Buttons */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/opd')}
            aria-label="Back to OPD"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <Avatar name={patient.fullName} size="md" />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-text-primary">{patient.fullName}</h1>
              <span className="font-mono text-xs text-accent-primary font-semibold">({patient.mrn})</span>
              <StatusBadge status={patient.status} size="sm" />
            </div>
            <div className="text-xs text-text-muted">
              {patient.age}y • {patient.gender} • Blood: <strong className="text-accent-secondary">{patient.bloodGroup}</strong> • Room: OPD-201
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrintRxModalOpen(true)}
            leftIcon={<Printer className="w-3.5 h-3.5 text-blue-400" />}
            title="Print Official Doctor Prescription Sheet or Save as PDF"
          >
            Print Rx
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleSave('Draft')}
            isLoading={isSaving}
            leftIcon={<Save className="w-3.5 h-3.5" />}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => handleSave('Completed')}
            isLoading={isSaving}
            leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
          >
            Complete Consultation
          </Button>
        </div>
      </GlassCard>

      {/* 3-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Patient Profile (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Allergies Alert */}
          <GlassCard className="p-4 border-status-danger/25">
            <div className="flex items-center gap-1.5 text-status-danger text-xs font-bold uppercase tracking-wider mb-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Drug Allergies</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {patient.allergies.length > 0 ? (
                patient.allergies.map(a => (
                  <span
                    key={a}
                    className="px-2 py-0.5 rounded text-xs font-semibold bg-status-danger/15 text-status-danger border border-status-danger/30"
                  >
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-xs text-text-muted">NKDA (None reported)</span>
              )}
            </div>
          </GlassCard>

          {/* Chronic Conditions */}
          <GlassCard className="p-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
              Existing Conditions
            </h3>
            <div className="flex flex-wrap gap-1">
              {patient.chronicConditions.map(c => (
                <span key={c} className="px-2 py-0.5 rounded text-xs bg-white/[0.06] text-text-primary border border-white/[0.08]">
                  {c}
                </span>
              ))}
            </div>
          </GlassCard>

          {/* Active Drugs */}
          <GlassCard className="p-4">
            <div className="flex items-center gap-1.5 text-text-secondary text-xs font-bold uppercase tracking-wider mb-2">
              <Pill className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Current Regimen</span>
            </div>
            <div className="space-y-1.5 text-xs">
              {patient.currentMedications.map((m, i) => (
                <div key={i} className="p-2 rounded-lg bg-white/[0.025] border border-white/[0.05] text-text-secondary font-medium">
                  {m}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Identity & Insurance */}
          <GlassCard className="p-4 space-y-2 text-xs">
            <div className="text-text-muted">ABHA ID: <span className="font-mono text-text-primary">{patient.abhaId}</span></div>
            <div className="text-text-muted">Insurance: <span className="text-text-primary">{patient.insuranceProvider || 'Cash'}</span></div>
          </GlassCard>
        </div>

        {/* CENTER COLUMN: Clinical Documentation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* MediCore AI Clinical Scribe & Prescription Bundler */}
          <GlassCard className="p-4 bg-gradient-to-r from-accent-primary/10 via-purple-500/10 to-transparent border-accent-primary/30">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-accent-primary/20 text-accent-primary">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    MediCore AI Clinical Scribe
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                      GPT-4o Medical / ICD-10
                    </span>
                  </h3>
                </div>
              </div>
              {isAiLoading && (
                <div className="flex items-center gap-1 text-[11px] text-accent-primary font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" /> Drafting Plan...
                </div>
              )}
            </div>

            <p className="text-[11px] text-text-muted mb-3">
              One-click standard evidence-based treatment bundles & SOAP clinical auto-coding:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'acute-bronchitis', label: 'Acute Bronchitis' },
                { id: 'type-2-diabetes', label: 'Type 2 Diabetes' },
                { id: 'hypertension-stage2', label: 'Stage 2 HTN' },
                { id: 'acute-gastroenteritis', label: 'Gastroenteritis' },
              ].map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  disabled={isAiLoading}
                  onClick={() => handleApplyAiPreset(preset.id)}
                  className={`px-2.5 py-2 rounded-xl text-[11px] font-semibold text-center border transition-all truncate ${
                    aiPresetSelected === preset.id
                      ? 'bg-accent-primary text-white border-accent-primary shadow-md shadow-accent-primary/30'
                      : 'bg-white/[0.04] text-text-secondary hover:text-white border-white/[0.08] hover:bg-white/[0.08]'
                  }`}
                  title={`Apply ${preset.label} Treatment Bundle`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5 space-y-4">
            <h2 className="text-sm font-semibold text-text-primary pb-2 border-b border-white/[0.08] flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-accent-primary" />
              <span>Clinical Evaluation & Vitals</span>
            </h2>

            {/* Vitals Form Grid */}
            <div className="p-3.5 rounded-xl bg-white/[0.025] border border-white/[0.06] space-y-3">
              <div className="text-xs font-semibold text-text-secondary flex items-center justify-between">
                <span>Objective Vitals Charting</span>
                <span className="font-mono text-accent-primary">BMI: {vitals.bmi || '23.7'}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <Input
                  label="BP Systolic"
                  type="number"
                  value={vitals.bloodPressureSystolic}
                  onChange={e => handleVitalsChange('bloodPressureSystolic', Number(e.target.value))}
                  helperText="mmHg"
                />
                <Input
                  label="BP Diastolic"
                  type="number"
                  value={vitals.bloodPressureDiastolic}
                  onChange={e => handleVitalsChange('bloodPressureDiastolic', Number(e.target.value))}
                  helperText="mmHg"
                />
                <Input
                  label="Pulse Rate"
                  type="number"
                  value={vitals.pulseRate}
                  onChange={e => handleVitalsChange('pulseRate', Number(e.target.value))}
                  helperText="bpm"
                />
                <Input
                  label="Temperature"
                  type="number"
                  step="0.1"
                  value={vitals.temperature}
                  onChange={e => handleVitalsChange('temperature', Number(e.target.value))}
                  helperText="°F"
                />
                <Input
                  label="Respiratory Rate"
                  type="number"
                  value={vitals.respiratoryRate}
                  onChange={e => handleVitalsChange('respiratoryRate', Number(e.target.value))}
                  helperText="/min"
                />
                <Input
                  label="SpO2 Saturation"
                  type="number"
                  value={vitals.spO2}
                  onChange={e => handleVitalsChange('spO2', Number(e.target.value))}
                  helperText="%"
                />
                <Input
                  label="Weight"
                  type="number"
                  value={vitals.weight}
                  onChange={e => handleVitalsChange('weight', Number(e.target.value))}
                  helperText="kg"
                />
                <Input
                  label="Height"
                  type="number"
                  value={vitals.height}
                  onChange={e => handleVitalsChange('height', Number(e.target.value))}
                  helperText="cm"
                />
              </div>
            </div>

            {/* Chief Complaint */}
            <Textarea
              label="Chief Complaint"
              value={chiefComplaint}
              onChange={e => setChiefComplaint(e.target.value)}
              placeholder="Presenting symptoms and duration..."
              rows={2}
            />

            {/* History of Present Illness */}
            <Textarea
              label="History of Present Illness (HPI)"
              value={historyOfIllness}
              onChange={e => setHistoryOfIllness(e.target.value)}
              placeholder="Onset, character, relieving and aggravating factors..."
              rows={3}
            />

            {/* Physical Examination */}
            <Textarea
              label="Physical Examination Findings"
              value={physicalExam}
              onChange={e => setPhysicalExam(e.target.value)}
              placeholder="Systemic CVS, RS, PA, CNS findings..."
              rows={2}
            />

            {/* Diagnosis */}
            <Input
              label="Diagnosis (Provisional / ICD-10)"
              value={provisionalDiagnosis}
              onChange={e => setProvisionalDiagnosis(e.target.value)}
              placeholder="e.g. Atypical Angina pectoris (I20.9), Hypertension"
            />

            {/* Clinical Notes */}
            <Textarea
              label="Physician Clinical Notes & Management Plan"
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              placeholder="Management strategy, lifestyle advice, diet restrictions..."
              rows={3}
            />
          </GlassCard>
        </div>

        {/* RIGHT COLUMN: Quick Actions & Orders (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Prescription Builder */}
          <GlassCard className="p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-primary">
                <Pill className="w-3.5 h-3.5 text-accent-secondary" />
                <span>Prescription Builder</span>
              </div>
              <span className="text-[11px] font-mono text-accent-primary">{prescriptions.length} items</span>
            </div>

            {/* Add medicine subform */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <Input
                label="Medicine Name"
                value={medName}
                onChange={e => setMedName(e.target.value)}
                placeholder="e.g. Ecosprin 75mg, Telma 40mg"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Dosage"
                  value={medDose}
                  onChange={e => setMedDose(e.target.value)}
                  placeholder="1 Tab / 5ml"
                />
                <Select
                  label="Route"
                  options={[
                    { value: 'Oral', label: 'Oral' },
                    { value: 'IV', label: 'IV Infusion' },
                    { value: 'IM', label: 'IM Injection' },
                    { value: 'Sublingual', label: 'Sublingual' },
                    { value: 'Topical', label: 'Topical' },
                  ]}
                  value={medRoute}
                  onChange={e => setMedRoute(e.target.value as any)}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  label="Frequency"
                  options={[
                    { value: 'Once daily', label: 'Once daily (OD)' },
                    { value: 'Twice daily (BD)', label: 'Twice daily (BD)' },
                    { value: 'Thrice daily (TDS)', label: 'Thrice daily (TDS)' },
                    { value: 'SOS / As needed', label: 'SOS / PRN' },
                    { value: 'Before bed', label: 'Bedtime (HS)' },
                  ]}
                  value={medFrequency}
                  onChange={e => setMedFrequency(e.target.value as any)}
                />
                <Input
                  label="Days"
                  type="number"
                  value={medDuration}
                  onChange={e => setMedDuration(Number(e.target.value))}
                />
              </div>

              <Input
                label="Instructions"
                value={medInstructions}
                onChange={e => setMedInstructions(e.target.value)}
                placeholder="e.g. After breakfast with water"
              />

              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full mt-1"
                onClick={handleAddMedicine}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                Add to Rx
              </Button>
            </div>

            {/* List of prescribed medicines */}
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {prescriptions.map(med => (
                <div key={med.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-start justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-text-primary">{med.medicineName}</div>
                    <div className="text-[11px] text-accent-primary font-mono">
                      {med.dosage} • {med.frequency} • {med.durationDays}d
                    </div>
                    <div className="text-[11px] text-text-muted mt-0.5">{med.instructions}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveMedicine(med.id)}
                    className="text-text-muted hover:text-status-danger p-1"
                    title="Remove medicine"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Investigation Orders */}
          <GlassCard className="p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 pb-2 border-b border-white/[0.08]">
              <FlaskConical className="w-3.5 h-3.5 text-status-warning" />
              <span>Lab & Radiology Orders</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-text-muted font-medium">Select Diagnostic Panels:</label>
              {[
                'Complete Blood Count (CBC)',
                'Lipid Profile Comprehensive',
                'Cardiac Troponin I (hs-cTnI)',
                'Chest X-Ray PA View',
                '2D Echocardiography',
              ].map(test => {
                const isSelected = labOrders.includes(test) || radiologyOrders.includes(test);
                return (
                  <button
                    type="button"
                    key={test}
                    onClick={() => {
                      if (isSelected) {
                        setLabOrders(prev => prev.filter(t => t !== test));
                        setRadiologyOrders(prev => prev.filter(t => t !== test));
                      } else {
                        if (test.includes('X-Ray') || test.includes('Echo')) {
                          setRadiologyOrders(prev => [...prev, test]);
                        } else {
                          setLabOrders(prev => [...prev, test]);
                        }
                      }
                    }}
                    className={`w-full p-2 rounded-xl text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-accent-primary/15 border-accent-primary/40 text-text-primary font-semibold'
                        : 'bg-white/[0.02] border-white/[0.06] text-text-secondary hover:bg-white/[0.05]'
                    }`}
                  >
                    <span>{test}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-accent-primary" />}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Follow-up Planning */}
          <GlassCard className="p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5 pb-2 border-b border-white/[0.08]">
              <CalendarCheck className="w-3.5 h-3.5 text-status-success" />
              <span>Follow-up & Disposition</span>
            </div>

            <Input
              label="Review Date"
              type="date"
              value={followUpDate}
              onChange={e => setFollowUpDate(e.target.value)}
            />

            <Input
              label="Follow-up Instructions"
              value={followUpInstructions}
              onChange={e => setFollowUpInstructions(e.target.value)}
              placeholder="e.g. Review with lab reports in 1 week"
            />
          </GlassCard>
        </div>
      </div>

      {/* Official Printable Doctor Prescription Modal */}
      <PrintPrescriptionModal
        isOpen={isPrintRxModalOpen}
        onClose={() => setIsPrintRxModalOpen(false)}
        data={{
          doctorName: 'Dr. Sarah Jenkins, MD',
          doctorSpecialty: 'Senior Consultant Physician',
          doctorLicense: 'CA-MD-98231',
          doctorChamber: 'OPD Chamber 201',
          patientName: patient.fullName,
          patientMrn: patient.mrn,
          patientAge: patient.age,
          patientGender: patient.gender,
          vitals: {
            bp: `${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`,
            pulse: vitals.pulseRate,
            temp: vitals.temperature,
            spo2: vitals.spO2,
            weight: vitals.weight,
          },
          chiefComplaint,
          diagnosis: provisionalDiagnosis,
          medications: prescriptions.map(p => ({
            name: `${p.medicineName} (${p.genericName})`,
            dosage: p.dosage,
            frequency: p.frequency,
            duration: `${p.durationDays} Days`,
            instructions: p.instructions,
          })),
          advice: clinicalNotes || 'Follow medication schedule carefully and drink plenty of fluids.',
          followUpDate: followUpDate || 'After 7 Days',
        }}
      />

      {/* Clinical Drug-Drug Interaction & Allergy Safety Guard Modal */}
      <ClinicalSafetyAlertModal
        isOpen={isSafetyModalOpen}
        onClose={() => {
          setIsSafetyModalOpen(false);
          setPendingMedicine(null);
          setSafetyReport(null);
        }}
        report={safetyReport}
        onOverride={handleSafetyOverride}
      />
    </div>
  );
};
