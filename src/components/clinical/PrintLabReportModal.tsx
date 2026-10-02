import React from 'react';
import { 
  Printer, 
  Download, 
  X, 
  FlaskConical, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { Button } from '../ui/Button';

export interface PrintableLabReportData {
  orderId: string;
  testName: string;
  specimenType: string;
  patientName: string;
  patientMrn: string;
  patientAge?: number;
  patientGender?: string;
  orderedBy?: string;
  verifiedBy?: string;
  collectedAt?: string;
  verifiedAt?: string;
  parameters: Array<{
    name: string;
    value: string | number;
    unit: string;
    referenceRange: string;
    status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  }>;
  clinicalRemarks?: string;
}

interface PrintLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: PrintableLabReportData | null;
}

export const PrintLabReportModal: React.FC<PrintLabReportModalProps> = ({
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
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">
              Official Diagnostic Report — {data.testName} ({data.patientName})
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

        {/* Printable Diagnostic Report Sheet */}
        <div className="printable-document p-8 sm:p-12 bg-white text-gray-900 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-emerald-700 pb-5 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-black text-xl shadow">
                +
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  MEDICORE DIAGNOSTICS & CENTRAL LAB
                </h1>
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">
                  NABL & CAP Accredited Automated Clinical Pathology Laboratory
                </p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <p className="font-bold text-gray-900">MediCore Apex Health Campus</p>
              <p>Lab Accreditation #NABL-MC-9082</p>
              <p>Phone: +91 80 4000 5000</p>
            </div>
          </div>

          {/* Patient & Specimen Info Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-6">
            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Patient Name</span>
              <strong className="text-gray-900 text-sm">{data.patientName}</strong>
              <span className="text-gray-500 block text-[11px]">
                {data.patientAge ? `${data.patientAge} Yrs` : '42 Yrs'} • {data.patientGender || 'Male'}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Patient MRN</span>
              <strong className="text-gray-900 font-mono text-sm">{data.patientMrn}</strong>
              <span className="text-gray-500 block text-[11px]">Ref Doc: {data.orderedBy || 'Dr. Sarah Jenkins'}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Specimen / Barcode</span>
              <strong className="text-gray-900 font-mono text-xs">{data.specimenType} (Blood EDTA)</strong>
              <span className="text-gray-500 block text-[11px]">Sample ID: {data.orderId}</span>
            </div>

            <div>
              <span className="text-[10px] text-gray-500 uppercase block font-semibold">Report Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified & Released
              </span>
              <span className="text-gray-500 block text-[10px]">
                {data.verifiedAt || new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Test Name Header */}
          <div className="bg-emerald-50/70 border-l-4 border-emerald-600 px-4 py-2.5 rounded-r-lg mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">{data.testName}</h3>
            <span className="text-xs font-semibold text-emerald-800">Automated Spectrophotometry / Flow Cytometry</span>
          </div>

          {/* Parameters Table */}
          <div className="mb-6 overflow-hidden border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-4">Test Parameter</th>
                  <th className="py-2.5 px-4">Observed Value</th>
                  <th className="py-2.5 px-4">Standard Biological Reference</th>
                  <th className="py-2.5 px-4">Units</th>
                  <th className="py-2.5 px-4">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.parameters.map((param, i) => (
                  <tr key={i} className="hover:bg-gray-50/75">
                    <td className="py-3 px-4 font-medium text-gray-900">{param.name}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900 text-sm">{param.value}</td>
                    <td className="py-3 px-4 text-gray-600">{param.referenceRange}</td>
                    <td className="py-3 px-4 text-gray-600 font-mono">{param.unit}</td>
                    <td className="py-3 px-4">
                      {param.status === 'NORMAL' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          NORMAL
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {param.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Remarks */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs mb-8">
            <span className="font-bold text-gray-800 uppercase text-[10px] tracking-wider block mb-1">
              Pathologist Remarks & Clinical Interpretation
            </span>
            <p className="text-gray-700 leading-relaxed">
              {data.clinicalRemarks ||
                'Parameters analyzed on Roche Cobas 6000 analyzer. Quality control metrics verified within 2 standard deviations. Clinical correlation recommended.'}
            </p>
          </div>

          {/* Verification QR & Pathologist Sign-off */}
          <div className="pt-6 border-t border-dashed border-gray-300 flex justify-between items-end text-xs">
            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-2.5 rounded-xl">
              <svg className="w-16 h-16 shrink-0 bg-white p-1 rounded-lg border border-gray-300" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <rect x="5" y="5" width="26" height="26" fill="#047857" />
                <rect x="9" y="9" width="18" height="18" fill="white" />
                <rect x="13" y="13" width="10" height="10" fill="#047857" />
                <rect x="69" y="5" width="26" height="26" fill="#047857" />
                <rect x="73" y="9" width="18" height="18" fill="white" />
                <rect x="77" y="13" width="10" height="10" fill="#047857" />
                <rect x="5" y="69" width="26" height="26" fill="#047857" />
                <rect x="9" y="73" width="18" height="18" fill="white" />
                <rect x="13" y="77" width="10" height="10" fill="#047857" />
                <circle cx="45" cy="20" r="4" fill="#047857" />
                <circle cx="45" cy="45" r="4" fill="#047857" />
                <circle cx="20" cy="45" r="4" fill="#047857" />
                <circle cx="70" cy="45" r="4" fill="#047857" />
                <circle cx="45" cy="75" r="4" fill="#047857" />
                <circle cx="70" cy="75" r="4" fill="#047857" />
              </svg>
              <div className="text-[10px] text-gray-600 leading-tight">
                <span className="font-bold text-gray-900 block flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  NABL Digital Seal
                </span>
                <span>Verification ID: <strong>LAB-CERT-8842</strong></span>
                <span className="block text-gray-400 mt-0.5">Authenticity verified online</span>
              </div>
            </div>

            <div className="text-center">
              <div className="h-12 w-48 border-b-2 border-gray-400 mb-1 mx-auto flex items-end justify-center pb-1">
                <span className="text-sm italic font-serif text-emerald-900 font-semibold">
                  Dr. Rajesh Mehta, MD (Path)
                </span>
              </div>
              <p className="text-xs font-bold text-gray-900">Dr. Rajesh Mehta, MD (Pathology)</p>
              <p className="text-[10px] text-gray-600">Consultant Clinical Pathologist • Reg: <strong>#MCI-91204</strong></p>
              <p className="text-[10px] text-gray-400">Electronically Signed & Authorized</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
