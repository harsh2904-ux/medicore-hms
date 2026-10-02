import React, { useRef } from 'react';
import { Appointment } from '../../types/appointment';
import { Patient } from '../../types/patient';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { QrCodeView } from '../common/QrCodeView';
import {
  Printer,
  Calendar,
  Clock,
  MapPin,
  User,
  ShieldCheck,
  Stethoscope,
  Building,
  CheckCircle2,
  QrCode,
  FileCheck
} from 'lucide-react';

interface PrintAppointmentSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  patient: Patient | null;
}

export const PrintAppointmentSlipModal: React.FC<PrintAppointmentSlipModalProps> = ({
  isOpen,
  onClose,
  appointment,
  patient,
}) => {
  const printAreaRef = useRef<HTMLDivElement>(null);

  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Confirmation Pass"
      subtitle={`Official hospital entry slip for Token ${appointment.tokenNumber || `T-${appointment.id}`}`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        
        {/* Top Print Actions */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
          <div className="flex items-center gap-2 text-blue-400">
            <FileCheck className="w-4 h-4 shrink-0" />
            <span>Appointment verified and scheduled in MediCore HMS. Ready to print or save as PDF.</span>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-3.5 h-3.5" />}
          >
            Print / Save PDF
          </Button>
        </div>

        {/* PRINTABLE SLIP CONTAINER */}
        <div
          ref={printAreaRef}
          className="print-area bg-white text-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-200 shadow-lg space-y-6"
        >
          {/* Hospital Header */}
          <div className="flex items-start justify-between border-b-2 border-blue-900 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center font-black text-xl tracking-tighter">
                M+
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-950 tracking-tight leading-none">
                  MEDICORE APEX HOSPITAL
                </h1>
                <p className="text-[11px] font-semibold text-blue-700 uppercase tracking-widest mt-1">
                  Tertiary Healthcare & Research Institute • NABH Accredited
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  Healthcare Boulevard, BKC, Mumbai 400051 • Helpline: +91 22 6988 5000
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider border border-emerald-300">
                Confirmed Entry Slip
              </span>
              <p className="text-[10px] text-gray-400 mt-1 font-mono">
                Booking ID: APT-{appointment.id}
              </p>
            </div>
          </div>

          {/* Token Highlight Banner */}
          <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-800">
                Clinic Consultation Token
              </span>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl font-black font-mono text-blue-950 tracking-tight">
                  {appointment.tokenNumber || `T-${appointment.id}`}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-900">
                  {appointment.type}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs border-t sm:border-t-0 sm:border-l border-blue-200 pt-2 sm:pt-0 sm:pl-6">
              <div>
                <span className="text-[10px] uppercase text-gray-500 font-semibold block">Date</span>
                <span className="font-bold text-gray-900 font-mono text-sm">{appointment.date}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-500 font-semibold block">Time Slot</span>
                <span className="font-bold text-blue-900 font-mono text-sm">{appointment.time}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-gray-500 font-semibold block">Chamber</span>
                <span className="font-bold text-gray-900 text-sm">{appointment.roomNumber || 'Room 201'}</span>
              </div>
            </div>
          </div>

          {/* Patient Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-semibold block">Patient Name</span>
              <strong className="text-gray-900 text-[13px]">{appointment.patientName}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-semibold block">MRN / Patient ID</span>
              <strong className="text-blue-900 font-mono text-[13px]">{appointment.patientMrn}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-semibold block">Age / Gender</span>
              <strong className="text-gray-900">{patient ? `${patient.age} Yrs / ${patient.gender}` : 'Adult'}</strong>
            </div>
            <div>
              <span className="text-[10px] uppercase text-gray-500 font-semibold block">Registered Phone</span>
              <strong className="text-gray-900">{appointment.patientPhone || patient?.phone || 'N/A'}</strong>
            </div>
          </div>

          {/* Doctor & Location Details */}
          <div className="p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-950 text-sm">{appointment.doctorName}</h3>
                  <p className="text-xs text-blue-700 font-medium">{appointment.department} Department</p>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-gray-900">{appointment.roomNumber || 'OPD Chamber 201'}</span>
                <p className="text-[11px] text-gray-500">2nd Floor, Main OPD Wing</p>
              </div>
            </div>

            {appointment.reason && (
              <div className="pt-2 border-t border-gray-100 text-xs text-gray-700">
                <span className="font-semibold text-gray-900">Reason for Visit: </span>
                {appointment.reason}
              </div>
            )}
          </div>

          {/* Patient Instructions */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span>⚠️ Important Patient Check-In Instructions:</span>
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-amber-800">
              <li>Please arrive <strong>15 minutes prior</strong> to your scheduled slot at OPD Reception Desk B.</li>
              <li>Present this electronic confirmation pass or mention Token <strong>{appointment.tokenNumber}</strong>.</li>
              <li>Bring your previous prescriptions, lab reports, and photo identification.</li>
              <li>For assistance or rescheduling, contact our 24/7 OPD helpline at <strong>+91 22 6988 5000</strong>.</li>
            </ul>
          </div>

          {/* Footer & Barcode Mockup */}
          <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-xs font-semibold text-gray-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Digitally Verified by MediCore OPD Scheduling Engine</span>
              </div>
              <p className="text-[10px] text-gray-500">
                Issued on {new Date().toLocaleDateString()} • System generated document, physical signature not required.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <QrCodeView
                value={`https://medicore.health/q/${appointment.tokenNumber || appointment.id}`}
                size={48}
                darkColor="#1e3a8a"
                alt="Token QR"
              />
              <div className="text-right font-mono text-[9px] text-gray-400">
                <div className="tracking-[3px] font-black text-gray-700 text-xs">||| | |||| | |||||</div>
                <span>MC-APT-{appointment.id}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print Appointment Pass
          </Button>
        </div>

      </div>
    </Modal>
  );
};
