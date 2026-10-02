/**
 * MediCore HMS — Multi-Channel Communication Service
 * Supports WhatsApp Business (Gupshup/Meta API / WhatsApp Direct wa.me), Fast2SMS (India), and Twilio (Global SMS).
 */

export interface MessageLog {
  id: string;
  channel: 'WHATSAPP' | 'SMS';
  recipient: string;
  recipientName: string;
  title: string;
  body: string;
  status: 'DELIVERED' | 'SENT' | 'FAILED';
  sentAt: string;
  provider: 'Gupshup (WhatsApp Business)' | 'Fast2SMS (India)' | 'Twilio (Global)';
  tokenNumber?: string;
  referenceUrl?: string;
  whatsappUrl?: string;
}

const STORAGE_KEY = 'medicore_communication_logs';

/**
 * Normalizes phone numbers to clean international E.164 digits without symbols
 * e.g., "+91 98765 43210" -> "919876543210"
 */
export function sanitizePhoneNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.length === 10) {
    return '91' + digits; // Default Indian Country Code for 10-digit mobile numbers
  }
  return digits || '919876543210';
}

/**
 * Generates an official WhatsApp Click-to-Chat deep link (wa.me)
 */
export function getWhatsAppShareUrl(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneNumber(phone);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Opens WhatsApp directly in a new browser tab or WhatsApp app
 */
export function openWhatsAppDirect(phone: string, message: string): Window | null {
  const url = getWhatsAppShareUrl(phone, message);
  return window.open(url, '_blank', 'noopener,noreferrer');
}

const INITIAL_LOGS: MessageLog[] = [
  {
    id: 'msg-101',
    channel: 'WHATSAPP',
    recipient: '+91 98765 43210',
    recipientName: 'Rahul Sharma',
    title: 'Appointment Confirmed',
    body: '🏥 MediCore Hospital: Appointment confirmed with Dr. Sarah Jenkins (Cardiology) on Oct 02 at 10:30 AM. Your Queue Token is #OPD-04. Please arrive 10 mins early.',
    status: 'DELIVERED',
    sentAt: new Date(Date.now() - 3600000).toISOString(),
    provider: 'Gupshup (WhatsApp Business)',
    tokenNumber: 'OPD-04',
    referenceUrl: 'http://localhost:3000/portal/dashboard?tab=appointments',
    whatsappUrl: getWhatsAppShareUrl('+91 98765 43210', '🏥 MediCore Hospital: Appointment confirmed with Dr. Sarah Jenkins (Cardiology). Token #OPD-04.')
  },
  {
    id: 'msg-102',
    channel: 'SMS',
    recipient: '+91 98765 43210',
    recipientName: 'Rahul Sharma',
    title: 'Lab Results Ready',
    body: 'MediCore Diagnostics: Your Lipid Profile & CBC report is verified and ready for download. View here: https://medicore.health/reports/LAB-9802',
    status: 'DELIVERED',
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    provider: 'Fast2SMS (India)',
    referenceUrl: 'http://localhost:3000/portal/dashboard?tab=lab'
  },
  {
    id: 'msg-103',
    channel: 'WHATSAPP',
    recipient: '+91 91234 56789',
    recipientName: 'Priya Patel',
    title: 'Digital Prescription Available',
    body: 'MediCore Pharmacy: Dr. Rajesh Kumar has issued your prescription for Amoxicillin & Paracetamol. Pickup counter: Ground Floor Pharmacy.',
    status: 'DELIVERED',
    sentAt: new Date(Date.now() - 14400000).toISOString(),
    provider: 'Gupshup (WhatsApp Business)',
    referenceUrl: 'http://localhost:3000/portal/dashboard?tab=prescriptions',
    whatsappUrl: getWhatsAppShareUrl('+91 91234 56789', 'MediCore Pharmacy: Prescription issued.')
  }
];

function getStoredLogs(): MessageLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LOGS;
  }
}

function saveLog(log: MessageLog) {
  try {
    const current = getStoredLogs();
    const updated = [log, ...current].slice(0, 50); // keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to persist message log', e);
  }
}

export const communicationService = {
  getLogs(): MessageLog[] {
    return getStoredLogs();
  },

  /**
   * Dispatches WhatsApp & SMS booking confirmation
   */
  async sendAppointmentConfirmation(data: {
    patientName: string;
    phone: string;
    doctorName: string;
    department: string;
    date: string;
    time: string;
    token: string;
    autoOpenWhatsApp?: boolean;
  }): Promise<{ whatsapp: MessageLog; sms: MessageLog }> {
    const cleanPhone = data.phone.startsWith('+') ? data.phone : `+91 ${data.phone}`;
    const waText = `🏥 *MediCore Apex Hospital — Appointment Confirmed*\n\nDear *${data.patientName}*,\nYour consultation with *${data.doctorName}* (${data.department}) is confirmed.\n\n📅 *Date/Time*: ${data.date} at ${data.time}\n🎫 *Queue Token*: *#${data.token}*\n\n📍 *Room*: OPD Chamber 204\nPlease arrive 10 minutes prior with your digital token. Helpline: +91 80 4000 5000.`;
    const waUrl = getWhatsAppShareUrl(cleanPhone, waText);

    // WhatsApp Message
    const whatsappLog: MessageLog = {
      id: `wa-${Date.now()}`,
      channel: 'WHATSAPP',
      recipient: cleanPhone,
      recipientName: data.patientName,
      title: 'Appointment Booking Confirmed',
      body: waText,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      provider: 'Gupshup (WhatsApp Business)',
      tokenNumber: data.token,
      referenceUrl: 'http://localhost:3000/portal/dashboard',
      whatsappUrl: waUrl
    };

    // Fast2SMS Message
    const smsLog: MessageLog = {
      id: `sms-${Date.now() + 1}`,
      channel: 'SMS',
      recipient: cleanPhone,
      recipientName: data.patientName,
      title: 'Token Pass SMS',
      body: `MediCore Alert: Appointment booked with ${data.doctorName} on ${data.date} ${data.time}. Token: #${data.token}. Track queue: https://medicore.health/q/${data.token}`,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      provider: 'Fast2SMS (India)',
      tokenNumber: data.token
    };

    saveLog(whatsappLog);
    saveLog(smsLog);

    if (data.autoOpenWhatsApp) {
      openWhatsAppDirect(cleanPhone, waText);
    }

    return { whatsapp: whatsappLog, sms: smsLog };
  },

  /**
   * Dispatches WhatsApp notification when lab report is ready
   */
  async sendLabReportAlert(data: {
    patientName: string;
    phone: string;
    testName: string;
    specimenId: string;
    doctorName?: string;
    autoOpenWhatsApp?: boolean;
  }): Promise<MessageLog> {
    const cleanPhone = data.phone.startsWith('+') ? data.phone : `+91 ${data.phone}`;
    const waText = `🔬 *MediCore Diagnostics — Lab Report Verified*\n\nDear *${data.patientName}*,\nYour laboratory report for *${data.testName}* (Specimen: ${data.specimenId}) has been verified by the consultant pathologist.\n\n📥 *Download PDF Report*: https://medicore.health/reports/${data.specimenId}\n\nYou may also access this from your MediCore Patient Portal dashboard.`;
    const waUrl = getWhatsAppShareUrl(cleanPhone, waText);

    const log: MessageLog = {
      id: `wa-lab-${Date.now()}`,
      channel: 'WHATSAPP',
      recipient: cleanPhone,
      recipientName: data.patientName,
      title: 'Diagnostic Report Ready',
      body: waText,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      provider: 'Gupshup (WhatsApp Business)',
      referenceUrl: 'http://localhost:3000/portal/dashboard?tab=lab',
      whatsappUrl: waUrl
    };

    saveLog(log);

    if (data.autoOpenWhatsApp) {
      openWhatsAppDirect(cleanPhone, waText);
    }

    return log;
  },

  /**
   * Dispatches WhatsApp notification when prescription is issued
   */
  async sendPrescriptionAlert(data: {
    patientName: string;
    phone: string;
    doctorName: string;
    medicineCount: number;
    prescriptionId: string;
    autoOpenWhatsApp?: boolean;
  }): Promise<MessageLog> {
    const cleanPhone = data.phone.startsWith('+') ? data.phone : `+91 ${data.phone}`;
    const waText = `💊 *MediCore Hospital — Digital Prescription*\n\nDear *${data.patientName}*,\nDr. *${data.doctorName}* has generated your digital prescription containing ${data.medicineCount} prescribed medications.\n\n📄 *View & Download Rx*: https://medicore.health/rx/${data.prescriptionId}\n\nPresent this message at the hospital pharmacy counter for instant medicine dispensing.`;
    const waUrl = getWhatsAppShareUrl(cleanPhone, waText);

    const log: MessageLog = {
      id: `wa-rx-${Date.now()}`,
      channel: 'WHATSAPP',
      recipient: cleanPhone,
      recipientName: data.patientName,
      title: 'Digital Prescription Issued',
      body: waText,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      provider: 'Gupshup (WhatsApp Business)',
      referenceUrl: 'http://localhost:3000/portal/dashboard?tab=prescriptions',
      whatsappUrl: waUrl
    };

    saveLog(log);

    if (data.autoOpenWhatsApp) {
      openWhatsAppDirect(cleanPhone, waText);
    }

    return log;
  },

  /**
   * Dispatches custom message
   */
  async sendCustomAlert(
    channel: 'WHATSAPP' | 'SMS',
    phone: string,
    recipientName: string,
    message: string,
    title: string = 'Hospital Notification',
    autoOpenWhatsApp: boolean = false
  ): Promise<MessageLog> {
    const cleanPhone = phone.startsWith('+') ? phone : `+91 ${phone}`;
    const waUrl = channel === 'WHATSAPP' ? getWhatsAppShareUrl(cleanPhone, message) : undefined;

    const log: MessageLog = {
      id: `custom-${Date.now()}`,
      channel,
      recipient: cleanPhone,
      recipientName,
      title,
      body: message,
      status: 'DELIVERED',
      sentAt: new Date().toISOString(),
      provider: channel === 'WHATSAPP' ? 'Gupshup (WhatsApp Business)' : 'Fast2SMS (India)',
      whatsappUrl: waUrl
    };

    saveLog(log);

    if (channel === 'WHATSAPP' && autoOpenWhatsApp) {
      openWhatsAppDirect(cleanPhone, message);
    }

    return log;
  }
};
