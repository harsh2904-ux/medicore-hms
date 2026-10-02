import { User, SystemRole } from '../types/system';
import { initialUsers } from './mockData';
import { apiClient } from './apiClient';

const AUTH_STORAGE_KEY = 'medicore_auth_user';

export interface RegisterStaffInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'lab_technician' | 'billing' | 'admin';
  phone?: string;
  department?: string;
}

function toSystemRole(roleStr?: string): SystemRole {
  if (!roleStr) return 'Administrator';
  const l = roleStr.toLowerCase();
  if (l.includes('doc')) return 'Doctor';
  if (l.includes('nurse')) return 'Nurse';
  if (l.includes('recep')) return 'Receptionist';
  if (l.includes('pharm')) return 'Pharmacist';
  if (l.includes('lab')) return 'Lab Technician';
  if (l.includes('radio')) return 'Radiologist';
  if (l.includes('bill') || l.includes('account')) return 'Accountant';
  if (l.includes('super')) return 'Super Admin';
  return 'Administrator';
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Attempt backend login first to authenticate against PostgreSQL
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: normalizedEmail, password }),
      });

      if (res.ok) {
        const body = await res.json();
        const token = body?.data?.token || body?.data?.accessToken;
        const backendUser = body?.data?.user;

        if (token) {
          apiClient.setToken(token);
        }

        if (backendUser) {
          const mappedUser: User = {
            id: String(backendUser.id),
            name: backendUser.name || `${backendUser.firstName || ''} ${backendUser.lastName || ''}`.trim() || 'Staff Member',
            email: backendUser.email || normalizedEmail,
            role: toSystemRole(backendUser.role),
            department: backendUser.department || 'Hospital Administration',
            avatarUrl: backendUser.avatar || undefined,
            status: 'Active',
            lastLogin: new Date().toISOString(),
          };
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mappedUser));
          return mappedUser;
        }
      }
    } catch {
      // Backend might be offline; continue with local fallback
    }

    // 2. Match demo credentials
    if (
      (normalizedEmail === 'admin@medicore.com' && password === 'admin123') ||
      (normalizedEmail === 'admin' && password === 'admin123')
    ) {
      const user = initialUsers[0];
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }

    // Check if matching other demo staff accounts
    const match = initialUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (match && (password === 'admin123' || password === 'password123' || password === `${match.role.toLowerCase()}123`)) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(match));
      return match;
    }

    throw new Error('Invalid email or password. Please verify credentials or register a new staff account.');
  },

  async register(input: RegisterStaffInput): Promise<User> {
    const payload = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.trim().toLowerCase(),
      password: input.password,
      role: input.role.toUpperCase(),
      phone: input.phone || '+1 (555) 000-0000',
      department: input.department || 'General Medicine',
    };

    // Attempt backend registration in PostgreSQL
    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const body = await res.json();
        const token = body?.data?.token || body?.data?.accessToken;
        const backendUser = body?.data?.user;

        if (token) {
          apiClient.setToken(token);
        }

        const newUser: User = {
          id: backendUser?.id ? String(backendUser.id) : `user-${Date.now()}`,
          name: `${input.firstName} ${input.lastName}`,
          email: input.email.toLowerCase(),
          role: toSystemRole(input.role),
          department: input.department || 'Hospital Administration',
          status: 'Active',
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
        initialUsers.push(newUser);
        return newUser;
      } else {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Registration failed on server');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message && err.message !== 'Failed to fetch' && !err.message.toLowerCase().includes('networkerror')) {
          throw err;
        }
      }
      console.warn('Backend registration unreachable, creating locally:', err);
    }

    // Local fallback
    const localUser: User = {
      id: `user-${Date.now()}`,
      name: `${input.firstName} ${input.lastName}`,
      email: input.email.toLowerCase(),
      role: toSystemRole(input.role),
      department: input.department || 'Hospital Administration',
      status: 'Active',
      lastLogin: new Date().toISOString(),
    };

    initialUsers.push(localUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(localUser));
    return localUser;
  },

  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Fallback
    }
    return null;
  },

  async logout(): Promise<void> {
    apiClient.clearToken();
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  demoLogin(): User {
    const user = initialUsers[0];
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    apiClient.ensureToken().catch(() => {});
    return user;
  },
};
