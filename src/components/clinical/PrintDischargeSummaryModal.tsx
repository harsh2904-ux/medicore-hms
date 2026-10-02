import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Heart,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/Button';
import { QrCodeView } from '../common/QrCodeView';

export interface PrintableDischargeSummaryData {
  admissionId: string;
  patientName: string;
  patientMrn: string;
  patientAge?: number;
  patientGender?: string;
  admissionDate: string;
  dischargeDate: string;
  department: string;
  attendingDoctor: string;
  doctorLicense?: string;
  wardBed: string;
  diagnosis: string;
  secondaryDiagnoses?: string[];
  clinicalCourse: string;
  dischargeVitals: {
    bp: string;
    pulse: string | number;
    temp: string;
    spo2: string;
  };
  dischargeMedications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  dietAdvice: string;
  followUpDate: string;
}

interface PrintDischargeSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrintableDischargeSummaryData | null;
}

export const PrintDischargeSummaryModal: React.FC<PrintDischargeSummaryModalProps> = ({
  isOpen,
  onClose,
  data
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">
              Official Hospital Discharge Summary — {data.patientName} ({data.patientMrn})
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              leftIcon={<Printer className="w-4 h-4 text-gray-300" />}
            >
              Print
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Discharge Summary Sheet */}
        <div className="printable-document p-8 sm:p-12 bg-white text-gray-900 font-sans">
          
          {/* Hospital Header */}
          <div className="flex justify-between items-start border-b-2 border-indigo-700 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center text-white font-black text-xl shadow">
                +
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  MEDICORE APEX HOSPITAL
                </h1>
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-widest">
                  Department of Inpatient Services & Critical Care
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p className="font-bold text-gray-900">NABH Accredited Multi-Specialty Hospital</p>
              <p>Registration #MH-HOSP-2024-881</p>
              <p>24x7 Emergency: +91 80 4000 5000</p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wider underline underline-offset-4">
              Clinical Inpatient Discharge Summary
            </h2>
          </div>

          {/* Demographics & Admission Record */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-6">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Patient Demographics</span>
              <strong className="text-gray-900 text-sm">{data.patientName}</strong>
              <span className="text-gray-600 block text-[11px]">
                {data.patientAge || 45} Yrs • {data.patientGender || 'Male'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Medical Record (MRN)</span>
              <strong className="text-gray-900 font-mono text-sm">{data.patientMrn}</strong>
              <span className="text-gray-600 block text-[11px]">Admission ID: {data.admissionId}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Admission / Discharge</span>
              <span className="text-gray-800 block text-[11px]">
                Admitted: <strong>{data.admissionDate}</strong>
              </span>
              <span className="text-gray-800 block text-[11px]">
                Discharged: <strong>{data.dischargeDate}</strong>
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Ward & Consultant</span>
              <strong className="text-gray-900 text-xs block">{data.wardBed}</strong>
              <span className="text-indigo-700 font-medium text-[11px] block">{data.attendingDoctor}</span>
            </div>
          </div>

          {/* Final Diagnosis */}
          <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl text-xs mb-6">
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
              Final Primary Discharge Diagnosis
            </span>
            <p className="text-sm font-bold text-gray-900">{data.diagnosis}</p>
            {data.secondaryDiagnoses && data.secondaryDiagnoses.length > 0 && (
              <p className="text-xs text-gray-600 mt-1">
                Secondary Conditions: {data.secondaryDiagnoses.join(', ')}
              </p>
            )}
          </div>

          {/* Discharge Vitals */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Vital Signs at Time of Discharge (Clinically Stable)
            </span>
            <div className="grid grid-cols-4 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-center font-mono">
              <div>
                <span className="text-gray-500 text-[10px] block">Blood Pressure</span>
                <strong className="text-gray-900">{data.dischargeVitals.bp}</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Heart Rate</span>
                <strong className="text-gray-900">{data.dischargeVitals.pulse} bpm</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Temperature</span>
                <strong className="text-gray-900">{data.dischargeVitals.temp}</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Oxygen Sat (SpO2)</span>
                <strong className="text-emerald-700 font-bold">{data.dischargeVitals.spo2}</strong>
              </div>
            </div>
          </div>

          {/* Clinical Course in Hospital */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-1">
              Summary of Hospital Course & Treatment Rendered
            </span>
            <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 leading-relaxed">
              {data.clinicalCourse}
            </div>
          </div>

          {/* Discharge Medications */}
          <div className="mb-6">
            <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Prescribed Discharge Medications (Take Exactly as Directed)
            </span>
            <table className="w-full text-left text-xs border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-gray-100 border-b border-gray-200 uppercase text-[10px] text-gray-700">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medication Name</th>
                  <th className="py-2.5 px-3">Dosage & Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.dischargeMedications.map((med, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-2 px-3 text-gray-500 font-mono">{i + 1}</td>
                    <td className="py-2 px-3 font-bold text-gray-900">{med.name}</td>
                    <td className="py-2 px-3 font-medium text-gray-800">{med.dosage} ({med.frequency})</td>
                    <td className="py-2 px-3 text-gray-700">{med.duration}</td>
                    <td className="py-2 px-3 text-gray-600 italic">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Follow-up & Advice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-8">
            <div>
              <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-1">
                Dietary & Activity Advice
              </span>
              <p className="text-gray-700 leading-relaxed">{data.dietAdvice}</p>
            </div>
            <div>
              <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-1">
                Follow-up Consultation
              </span>
              <p className="text-gray-700">
                Review with <strong>{data.attendingDoctor}</strong> on:{' '}
                <strong className="text-indigo-800 font-mono text-sm block mt-0.5">{data.followUpDate}</strong>
              </p>
              <span className="text-[10px] text-red-600 mt-1 block">
                *Report immediately to Emergency if high fever, acute breathlessness, or surgical site redness occurs.
              </span>
            </div>
          </div>

          {/* Signature & Verification QR */}
          <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end text-xs">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 rounded-xl">
              <QrCodeView
                value={`https://medicore.health/discharge/${data.patientMrn || 'DISCH-9941'}`}
                size={56}
                darkColor="#4338ca"
                alt="EMR Verification QR"
              />
              <div className="text-[10px] text-gray-600 leading-tight">
                <span className="font-bold text-gray-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-600" />
                  Authentic EMR Discharge
                </span>
                <span>Verification ID: <strong>DISCH-MC-9941</strong></span>
                <span className="block text-gray-400 mt-0.5">NABH Digital Clinical Record</span>
              </div>
            </div>

            <div className="text-center">
              <div className="h-12 w-48 border-b-2 border-gray-400 mb-1 mx-auto flex items-end justify-center pb-1">
                <span className="text-sm italic font-serif text-indigo-900 font-semibold">{data.attendingDoctor}</span>
              </div>
              <p className="text-xs font-bold text-gray-900">{data.attendingDoctor}</p>
              <p className="text-[10px] text-gray-600">Attending Consultant • Reg: <strong>{data.doctorLicense || '#MCI-2018-84920'}</strong></p>
              <p className="text-[10px] text-gray-400">Authorized Inpatient Medical Officer</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
