export type SystemRole = 
  | 'Super Admin'
  | 'Administrator'
  | 'Doctor'
  | 'Nurse'
  | 'Receptionist'
  | 'Lab Technician'
  | 'Radiologist'
  | 'Pharmacist'
  | 'Accountant';

export interface User {
  id: string;
  name: string;
  email: string;
  role: SystemRole;
  department: string;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  avatarUrl?: string;
}

export interface PermissionMatrixItem {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

export interface RoleDefinition {
  id: string;
  name: SystemRole;
  description: string;
  userCount: number;
  permissions: PermissionMatrixItem[];
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  details?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Appointments' | 'Clinical' | 'Billing' | 'Pharmacy' | 'System';
  timestamp: string;
  read: boolean;
  priority: 'High' | 'Normal' | 'Low';
  actionUrl?: string;
}

export interface HospitalProfile {
  name: string;
  tagline: string;
  registrationNumber: string;
  nabhAccredited: boolean;
  phone: string;
  emergencyHelpline: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  website: string;
  taxGstin: string;
}
