import { Bed, InpatientAdmission, BloodStockItem, AmbulanceVehicle, StaffMember } from '../types/operations';
import { User, RoleDefinition, AuditLogItem, NotificationItem, HospitalProfile } from '../types/system';
import { apiClient } from './apiClient';
import {
  initialBeds,
  initialAdmissions,
  initialBloodBank,
  initialAmbulances,
  initialStaffMembers,
  initialUsers,
  initialRoles,
  initialAuditLogs,
  initialNotifications,
  initialHospitalProfile
} from './mockData';

let bedsStore: Bed[] = [...initialBeds];
let admissionsStore: InpatientAdmission[] = [...initialAdmissions];
let bloodBankStore: BloodStockItem[] = [...initialBloodBank];
let ambulancesStore: AmbulanceVehicle[] = [...initialAmbulances];
let staffMembersStore: StaffMember[] = [...initialStaffMembers];
let usersStore: User[] = [...initialUsers];
let rolesStore: RoleDefinition[] = [...initialRoles];
let auditLogsStore: AuditLogItem[] = [...initialAuditLogs];
let notificationsStore: NotificationItem[] = [...initialNotifications];
let hospitalProfileStore: HospitalProfile = { ...initialHospitalProfile };

export const operationsService = {
  async getBeds(params?: { category?: string; status?: string; building?: string }): Promise<Bed[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    let result = [...bedsStore];
    if (params?.category && params.category !== 'All') {
      result = result.filter(b => b.category === params.category);
    }
    if (params?.status && params.status !== 'All') {
      result = result.filter(b => b.status === params.status);
    }
    if (params?.building && params.building !== 'All') {
      result = result.filter(b => b.building === params.building);
    }
    return result;
  },

  async updateBedStatus(bedId: string, status: Bed['status']): Promise<Bed> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = bedsStore.findIndex(b => b.id === bedId);
    if (idx === -1) throw new Error('Bed not found');
    bedsStore[idx].status = status;
    return bedsStore[idx];
  },

  async getAdmissions(status?: string): Promise<InpatientAdmission[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    if (!status || status === 'All') return [...admissionsStore];
    return admissionsStore.filter(a => a.status === status);
  },

  async dischargePatient(admissionId: string): Promise<InpatientAdmission> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const idx = admissionsStore.findIndex(a => a.id === admissionId);
    if (idx === -1) throw new Error('Admission not found');
    admissionsStore[idx].status = 'Discharged';
    
    // Free the bed
    const bedIdx = bedsStore.findIndex(b => b.id === admissionsStore[idx].bedId);
    if (bedIdx !== -1) {
      bedsStore[bedIdx].status = 'Cleaning';
      bedsStore[bedIdx].currentPatientId = undefined;
      bedsStore[bedIdx].currentPatientName = undefined;
      bedsStore[bedIdx].currentPatientMrn = undefined;
    }
    return admissionsStore[idx];
  },

  async getBloodBank(): Promise<BloodStockItem[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...bloodBankStore];
  },

  async updateBloodUnits(bloodGroup: string, delta: number): Promise<BloodStockItem> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = bloodBankStore.findIndex(b => b.bloodGroup === bloodGroup);
    if (idx === -1) throw new Error('Blood group not found');
    bloodBankStore[idx].unitsAvailable = Math.max(0, bloodBankStore[idx].unitsAvailable + delta);
    bloodBankStore[idx].lastUpdated = 'Just now';
    return bloodBankStore[idx];
  },

  async getAmbulances(): Promise<AmbulanceVehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...ambulancesStore];
  },

  async updateAmbulanceStatus(id: string, status: AmbulanceVehicle['status']): Promise<AmbulanceVehicle> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = ambulancesStore.findIndex(a => a.id === id);
    if (idx === -1) throw new Error('Ambulance not found');
    ambulancesStore[idx].status = status;
    return ambulancesStore[idx];
  },

  async getStaff(): Promise<StaffMember[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...staffMembersStore];
  },

  async getUsers(): Promise<User[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...usersStore];
  },

  async toggleUserStatus(id: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 150));
    const idx = usersStore.findIndex(u => u.id === id);
    if (idx === -1) throw new Error('User not found');
    usersStore[idx].status = usersStore[idx].status === 'Active' ? 'Inactive' : 'Active';
    return usersStore[idx];
  },

  async getRoles(): Promise<RoleDefinition[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...rolesStore];
  },

  async updateRolePermission(roleId: string, moduleName: string, permissionKey: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', value: boolean): Promise<RoleDefinition> {
    const rIdx = rolesStore.findIndex(r => r.id === roleId);
    if (rIdx === -1) throw new Error('Role not found');
    const pIdx = rolesStore[rIdx].permissions.findIndex(p => p.module === moduleName);
    if (pIdx !== -1) {
      rolesStore[rIdx].permissions[pIdx][permissionKey] = value;
    }
    return rolesStore[rIdx];
  },

  async getAuditLogs(): Promise<AuditLogItem[]> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...auditLogsStore];
  },

  async getNotifications(): Promise<NotificationItem[]> {
    // Attempt backend query
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const res = await apiClient.get<any>('/notifications');
      if (res && res.data && Array.isArray(res.data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const backendNotifs: NotificationItem[] = res.data.map((n: any) => ({
          id: String(n.id),
          title: n.title,
          message: n.message,
          category: n.type === 'SUCCESS' ? 'Clinical' : (n.type === 'WARNING' ? 'Pharmacy' : 'System'),
          timestamp: n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
          read: Boolean(n.isRead),
          priority: n.type === 'WARNING' ? 'High' : (n.type === 'SUCCESS' ? 'Normal' : 'Low'),
          actionUrl: n.type === 'SUCCESS' ? '/emr' : (n.type === 'WARNING' ? '/pharmacy' : '/dashboard'),
        }));

        backendNotifs.forEach(bn => {
          const idx = notificationsStore.findIndex(n => n.id === bn.id);
          if (idx >= 0) notificationsStore[idx] = bn;
          else notificationsStore.unshift(bn);
        });
      }
    } catch (err) {
      console.warn('Backend notifications query failed, using local store:', err);
    }

    return [...notificationsStore];
  },

  async markNotificationRead(id: string): Promise<NotificationItem[]> {
    try {
      if (/^\d+$/.test(id)) {
        await apiClient.request(`/notifications/${id}/read`, { method: 'PATCH' });
      }
    } catch {
      // Fallback
    }

    notificationsStore = notificationsStore.map(n => n.id === id ? { ...n, read: true } : n);
    return [...notificationsStore];
  },

  async markAllNotificationsRead(): Promise<NotificationItem[]> {
    try {
      await apiClient.post('/notifications/mark-all-read', {});
    } catch {
      // Fallback
    }

    notificationsStore = notificationsStore.map(n => ({ ...n, read: true }));
    return [...notificationsStore];
  },

  async addNotification(item: Omit<NotificationItem, 'id' | 'timestamp'>): Promise<NotificationItem> {
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      await apiClient.post('/notifications', {
        title: item.title,
        message: item.message,
        type: item.priority === 'High' ? 'WARNING' : 'INFO',
      });
    } catch {
      // Fallback
    }

    notificationsStore.unshift(newItem);
    return newItem;
  },

  async getHospitalProfile(): Promise<HospitalProfile> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return { ...hospitalProfileStore };
  },

  async updateHospitalProfile(profile: Partial<HospitalProfile>): Promise<HospitalProfile> {
    await new Promise(resolve => setTimeout(resolve, 200));
    hospitalProfileStore = { ...hospitalProfileStore, ...profile };
    return { ...hospitalProfileStore };
  }
};
