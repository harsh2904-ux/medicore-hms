import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { CommandPaletteProvider } from './context/CommandPaletteContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Auth page
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { PatientPortalLoginPage } from './pages/portal/PatientPortalLoginPage';
import { PatientPortalRegisterPage } from './pages/portal/PatientPortalRegisterPage';
import { PatientPortalDashboardPage } from './pages/portal/PatientPortalDashboardPage';

// Dashboard
import { DashboardPage } from './pages/dashboard/DashboardPage';

// Patient Care
import { PatientListPage } from './pages/patients/PatientListPage';
import { PatientRegistrationPage } from './pages/patients/PatientRegistrationPage';
import { PatientProfilePage } from './pages/patients/PatientProfilePage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { QueuePage } from './pages/queue/QueuePage';
import { OpdPage } from './pages/opd/OpdPage';
import { ConsultationPage } from './pages/opd/ConsultationPage';
import { IpdPage } from './pages/ipd/IpdPage';
import { BedsPage } from './pages/ipd/BedsPage';
import { EmergencyPage } from './pages/emergency/EmergencyPage';

// Clinical
import { EmrPage } from './pages/emr/EmrPage';
import { NursingPage } from './pages/nursing/NursingPage';
import { LaboratoryPage } from './pages/laboratory/LaboratoryPage';
import { RadiologyPage } from './pages/radiology/RadiologyPage';
import { PharmacyPage } from './pages/pharmacy/PharmacyPage';
import { OtPage } from './pages/ot/OtPage';
import { BloodBankPage } from './pages/bloodbank/BloodBankPage';

// Operations
import { BillingPage } from './pages/billing/BillingPage';
import { InsurancePage } from './pages/insurance/InsurancePage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { AmbulancePage } from './pages/ambulance/AmbulancePage';

// People
import { DoctorsPage } from './pages/doctors/DoctorsPage';
import { StaffPage } from './pages/staff/StaffPage';

// Analytics & Reports
import { ReportsPage } from './pages/reports/ReportsPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';

// Settings
import { SettingsPage } from './pages/settings/SettingsPage';
import { UsersPage } from './pages/settings/UsersPage';
import { RolesPage } from './pages/settings/RolesPage';
import { AuditLogsPage } from './pages/settings/AuditLogsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <CommandPaletteProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Auth & Patient Portal Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/portal" element={<PatientPortalLoginPage />} />
                <Route path="/portal/login" element={<PatientPortalLoginPage />} />
                <Route path="/portal/register" element={<PatientPortalRegisterPage />} />
                <Route path="/portal/dashboard" element={<PatientPortalDashboardPage />} />

                {/* Protected Application Routes */}
                <Route
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />

                  {/* Patients */}
                  <Route path="/patients" element={<PatientListPage />} />
                  <Route path="/patients/new" element={<PatientRegistrationPage />} />
                  <Route path="/patients/:id" element={<PatientProfilePage />} />

                  {/* Appointments & Queue */}
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/appointments/new" element={<AppointmentsPage />} />
                  <Route path="/queue" element={<QueuePage />} />

                  {/* Doctors */}
                  <Route path="/doctors" element={<DoctorsPage />} />

                  {/* OPD Care & Consultation */}
                  <Route path="/opd" element={<OpdPage />} />
                  <Route path="/opd/consultation/:id" element={<ConsultationPage />} />

                  {/* IPD & Bed Management */}
                  <Route path="/ipd" element={<IpdPage />} />
                  <Route path="/ipd/admissions" element={<IpdPage />} />
                  <Route path="/ipd/beds" element={<BedsPage />} />

                  {/* Clinical Modules */}
                  <Route path="/nursing" element={<NursingPage />} />
                  <Route path="/emergency" element={<EmergencyPage />} />
                  <Route path="/emr" element={<EmrPage />} />
                  <Route path="/laboratory" element={<LaboratoryPage />} />
                  <Route path="/laboratory/orders" element={<LaboratoryPage />} />
                  <Route path="/laboratory/results" element={<LaboratoryPage />} />
                  <Route path="/radiology" element={<RadiologyPage />} />
                  <Route path="/pharmacy" element={<PharmacyPage />} />
                  <Route path="/pharmacy/prescriptions" element={<PharmacyPage />} />
                  <Route path="/pharmacy/inventory" element={<PharmacyPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/ot" element={<OtPage />} />
                  <Route path="/blood-bank" element={<BloodBankPage />} />

                  {/* Operations & Revenue */}
                  <Route path="/billing" element={<BillingPage />} />
                  <Route path="/billing/invoices" element={<BillingPage />} />
                  <Route path="/billing/payments" element={<BillingPage />} />
                  <Route path="/insurance" element={<InsurancePage />} />
                  <Route path="/ambulance" element={<AmbulancePage />} />
                  <Route path="/staff" element={<StaffPage />} />

                  {/* Analytics & Reports */}
                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />

                  {/* Settings */}
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/settings/hospital" element={<SettingsPage />} />
                  <Route path="/settings/users" element={<UsersPage />} />
                  <Route path="/settings/roles" element={<RolesPage />} />
                  <Route path="/settings/audit-logs" element={<AuditLogsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </CommandPaletteProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
