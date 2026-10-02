import React from 'react';
import { NavLink } from 'react-router-dom';
import { MediCoreLogo } from './MediCoreLogo';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  ListOrdered,
  Stethoscope,
  BedDouble,
  Siren,
  FileHeart,
  HeartPulse,
  FlaskConical,
  Scan,
  Pill,
  Scissors,
  Droplets,
  CreditCard,
  ShieldCheck,
  Package,
  Ambulance,
  UserCheck,
  Building2,
  FileSpreadsheet,
  BarChart3,
  UserCog,
  KeyRound,
  History,
  Settings,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: {
    label: string;
    path: string;
    icon: React.ReactNode;
    badge?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PATIENT CARE',
      items: [
        { label: 'Patients', path: '/patients', icon: <Users className="w-4 h-4" /> },
        { label: 'Appointments', path: '/appointments', icon: <CalendarDays className="w-4 h-4" />, badge: '186' },
        { label: 'Queue Management', path: '/queue', icon: <ListOrdered className="w-4 h-4" /> },
        { label: 'OPD Care', path: '/opd', icon: <Stethoscope className="w-4 h-4" /> },
        { label: 'IPD & Admissions', path: '/ipd', icon: <BedDouble className="w-4 h-4" /> },
        { label: 'Emergency & Triage', path: '/emergency', icon: <Siren className="w-4 h-4" />, badge: 'Critical' },
      ],
    },
    {
      title: 'CLINICAL',
      items: [
        { label: 'EMR Records', path: '/emr', icon: <FileHeart className="w-4 h-4" /> },
        { label: 'Nursing Station', path: '/nursing', icon: <HeartPulse className="w-4 h-4" /> },
        { label: 'Laboratory', path: '/laboratory', icon: <FlaskConical className="w-4 h-4" /> },
        { label: 'Radiology', path: '/radiology', icon: <Scan className="w-4 h-4" /> },
        { label: 'Pharmacy', path: '/pharmacy', icon: <Pill className="w-4 h-4" /> },
        { label: 'Operation Theatre', path: '/ot', icon: <Scissors className="w-4 h-4" /> },
        { label: 'Blood Bank', path: '/blood-bank', icon: <Droplets className="w-4 h-4" /> },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Billing & Invoices', path: '/billing', icon: <CreditCard className="w-4 h-4" /> },
        { label: 'Insurance & TPA', path: '/insurance', icon: <ShieldCheck className="w-4 h-4" /> },
        { label: 'Supply Inventory', path: '/inventory', icon: <Package className="w-4 h-4" /> },
        { label: 'Ambulance Fleet', path: '/ambulance', icon: <Ambulance className="w-4 h-4" /> },
      ],
    },
    {
      title: 'PEOPLE',
      items: [
        { label: 'Doctors', path: '/doctors', icon: <UserCheck className="w-4 h-4" /> },
        { label: 'Staff Roster', path: '/staff', icon: <Building2 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'ANALYTICS',
      items: [
        { label: 'Report Center', path: '/reports', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { label: 'Analytics Insights', path: '/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Users', path: '/settings/users', icon: <UserCog className="w-4 h-4" /> },
        { label: 'Roles & Permissions', path: '/settings/roles', icon: <KeyRound className="w-4 h-4" /> },
        { label: 'Audit Logs', path: '/settings/audit-logs', icon: <History className="w-4 h-4" /> },
        { label: 'Hospital Settings', path: '/settings', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0A0D12]/95 backdrop-blur-2xl border-r border-white/[0.08] flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Header */}
        <div className="h-16 px-5 border-b border-white/[0.08] flex items-center justify-between shrink-0">
          <MediCoreLogo />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.08] lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 text-[10px] font-semibold text-text-muted/70 tracking-wider uppercase">
                {section.title}
              </div>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onClose();
                    }}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                        isActive
                          ? 'bg-accent-primary/15 text-white border border-accent-primary/30 shadow-sm font-semibold'
                          : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.05]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-text-muted group-hover:text-text-primary group-[.active]:text-accent-primary transition-colors">
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          item.badge === 'Critical'
                            ? 'bg-status-danger/20 text-status-danger border border-status-danger/30'
                            : 'bg-white/[0.08] text-text-muted'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-3.5 border-t border-white/[0.08] bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <span className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-medium text-text-primary truncate">
                Server Connected
              </span>
              <span className="text-[10px] text-text-muted truncate">
                NABH Certified Hub
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
