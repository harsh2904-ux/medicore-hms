import React from 'react';
import { Printer, Download, X, Stethoscope, Heart, Activity, QrCode, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';
import { QrCodeView } from '../common/QrCodeView';

export interface PrintablePrescriptionData {
  doctorName?: string;
  doctorSpecialty?: string;
  doctorLicense?: string;
  doctorChamber?: string;
  patientName: string;
  patientMrn: string;
  patientAge?: number;
  patientGender?: string;
  date?: string;
  vitals?: {
    bp?: string;
    pulse?: number | string;
    temp?: number | string;
    spo2?: number | string;
    weight?: number | string;
  };
  chiefComplaint?: string;
  diagnosis?: string;
  medications: Array<{
    name: string;
    dosage?: string;
    frequency?: string;
    duration?: string;
    instructions?: string;
  }>;
  investigations?: string[];
  advice?: string;
  followUpDate?: string;
}

interface PrintPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrintablePrescriptionData | null;
}

export const PrintPrescriptionModal: React.FC<PrintPrescriptionModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  const defaultDate = data.date || new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-gray-900 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print flex items-center justify-between px-6 py-4 bg-gray-900 text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm">Official Clinical Prescription — {data.patientName}</span>
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

        {/* Printable Prescription Sheet */}
        <div className="printable-document p-8 sm:p-12 bg-white text-gray-900 font-sans">
          
          {/* Hospital Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-blue-700 pb-5 mb-5">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center text-white font-black text-xl shadow">
                  M
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">MEDICORE HOSPITAL</h1>
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-widest">
                    Outpatient Clinical Care & Academic Medical Center
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                450 Healthcare Boulevard, San Francisco, CA 94103 • Tel: +1 (555) 019-8000
              </p>
            </div>

            <div className="text-right">
              <h2 className="text-base font-bold text-gray-900">{data.doctorName || 'Dr. Sarah Jenkins, MD'}</h2>
              <p className="text-xs text-blue-800 font-semibold">{data.doctorSpecialty || 'Senior Consultant Physician'}</p>
              <p className="text-[11px] text-gray-500 font-mono">Reg No: {data.doctorLicense || 'CA-MD-98231'}</p>
              <p className="text-[11px] text-gray-500">Chamber: {data.doctorChamber || 'Room 301-A'}</p>
            </div>
          </div>

          {/* Patient Details & Vitals Bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-3 border-b border-gray-200">
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Patient Name</span>
                <span className="font-bold text-sm text-gray-900">{data.patientName}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">MRN</span>
                <span className="font-mono font-semibold text-gray-800">{data.patientMrn}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Age / Gender</span>
                <span className="font-semibold text-gray-800">
                  {data.patientAge ? `${data.patientAge} Yrs` : '35 Yrs'} / {data.patientGender || 'Female'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block">Date</span>
                <span className="font-semibold text-gray-800">{defaultDate}</span>
              </div>
            </div>

            {/* Vitals */}
            {data.vitals && (
              <div className="grid grid-cols-5 gap-2 pt-3 text-[11px] text-gray-700">
                <div>
                  <span className="text-gray-500 block">BP:</span>
                  <span className="font-bold text-gray-900">{data.vitals.bp || '120/80 mmHg'}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Pulse:</span>
                  <span className="font-bold text-gray-900">{data.vitals.pulse || 72} bpm</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Temp:</span>
                  <span className="font-bold text-gray-900">{data.vitals.temp || '98.4'} °F</span>
                </div>
                <div>
                  <span className="text-gray-500 block">SpO2:</span>
                  <span className="font-bold text-gray-900">{data.vitals.spo2 || '99'}%</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Weight:</span>
                  <span className="font-bold text-gray-900">{data.vitals.weight || 68} kg</span>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
            {data.chiefComplaint && (
              <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                <span className="font-bold text-blue-900 uppercase text-[10px] tracking-wider block mb-0.5">
                  Chief Complaint
                </span>
                <p className="text-gray-800">{data.chiefComplaint}</p>
              </div>
            )}
            {data.diagnosis && (
              <div className="p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                <span className="font-bold text-purple-900 uppercase text-[10px] tracking-wider block mb-0.5">
                  Provisional Diagnosis
                </span>
                <p className="text-gray-800 font-medium">{data.diagnosis}</p>
              </div>
            )}
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl font-serif font-black text-blue-800">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Prescribed Medications</span>
            </div>

            <table className="w-full text-left border-collapse text-xs border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-bold uppercase text-[10px] tracking-wider border-b border-gray-200">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Medicine & Dosage</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-3">Duration</th>
                  <th className="py-2.5 px-3">Special Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.medications.length > 0 ? (
                  data.medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 px-3 font-mono text-gray-500">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <p className="font-bold text-gray-900 text-sm">{med.name}</p>
                        {med.dosage && <p className="text-[11px] text-gray-600">{med.dosage}</p>}
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800">
                        {med.frequency || '1 - 0 - 1'}
                      </td>
                      <td className="py-3 px-3 text-gray-800">{med.duration || '5 Days'}</td>
                      <td className="py-3 px-3 text-gray-600 italic">
                        {med.instructions || 'After meals with water'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No prescription items recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Advice & Diagnostics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 text-xs mb-10">
            <div>
              <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-1">
                General Advice & Dietary Instructions
              </span>
              <p className="text-gray-700 leading-relaxed">
                {data.advice || 'Stay hydrated, avoid oily foods, monitor blood pressure twice daily. Report immediately to Emergency if chest discomfort or severe headache recurs.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-1">
                Follow-up Review
              </span>
              <p className="text-gray-700">
                Date: <span className="font-bold text-blue-900">{data.followUpDate || 'After 7 Days'}</span>
              </p>
            </div>
          </div>

          {/* Doctor Signature & Security QR Verification */}
          <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end text-xs">
            {/* Security QR Verification Box */}
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2 rounded-xl">
              <QrCodeView
                value={`https://medicore.health/rx/${data.patientMrn || 'RX-2026-9901'}`}
                size={56}
                darkColor="#1e3a8a"
                alt="Rx Verification QR"
              />
              <div className="text-[10px] text-gray-600 leading-tight">
                <span className="font-bold text-gray-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Tamper-Evident QR
                </span>
                <span>Verification: <strong>RX-VERIFIED</strong></span>
                <span className="block text-gray-400 mt-0.5">MCI Reg: {data.doctorLicense || 'MCI-2018-84920'}</span>
              </div>
            </div>

            {/* Doctor Signature Block */}
            <div className="text-center">
              <div className="h-12 w-48 border-b-2 border-gray-400 mb-1 mx-auto flex items-end justify-center pb-1">
                <span className="text-sm italic font-serif text-blue-900 font-semibold">{data.doctorName || 'Dr. Sarah Jenkins'}</span>
              </div>
              <p className="text-xs font-bold text-gray-900">{data.doctorName || 'Dr. Sarah Jenkins, MD (Cardiology)'}</p>
              <p className="text-[10px] text-gray-600">Reg No: <strong>{data.doctorLicense || 'MCI-2018-84920'}</strong></p>
              <p className="text-[10px] text-gray-400">Authorized Medical Practitioner Signature</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
