import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCommandPalette } from '../../context/CommandPaletteContext';
import { initialPatients, initialDoctors, initialMedicines, initialInvoices } from '../../services/mockData';
import {
  Search,
  UserPlus,
  CalendarPlus,
  Stethoscope,
  FlaskConical,
  Pill,
  BedDouble,
  Receipt,
  Users,
  UserCheck,
  ChevronRight,
  X
} from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { isOpen, close } = useCommandPalette();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Search results
  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const patients = initialPatients.filter(
      p => p.fullName.toLowerCase().includes(q) || p.mrn.toLowerCase().includes(q)
    ).slice(0, 3);

    const doctors = initialDoctors.filter(
      d => d.name.toLowerCase().includes(q) || d.specialty.toLowerCase().includes(q)
    ).slice(0, 3);

    const medicines = initialMedicines.filter(
      m => m.name.toLowerCase().includes(q) || m.genericName.toLowerCase().includes(q)
    ).slice(0, 3);

    const invoices = initialInvoices.filter(
      i => i.invoiceNumber.toLowerCase().includes(q) || i.patientName.toLowerCase().includes(q)
    ).slice(0, 3);

    return { patients, doctors, medicines, invoices };
  }, [query]);

  if (!isOpen) return null;

  const quickActions = [
    { label: 'Register New Patient', icon: <UserPlus className="w-4 h-4 text-accent-primary" />, path: '/patients/new' },
    { label: 'Schedule Appointment', icon: <CalendarPlus className="w-4 h-4 text-status-warning" />, path: '/appointments' },
    { label: 'Open Clinical Consultation', icon: <Stethoscope className="w-4 h-4 text-accent-secondary" />, path: '/opd/consultation/con-101' },
    { label: 'Verify Lab Results', icon: <FlaskConical className="w-4 h-4 text-status-info" />, path: '/laboratory/results' },
    { label: 'Pharmacy Medicine Catalog', icon: <Pill className="w-4 h-4 text-status-success" />, path: '/pharmacy/inventory' },
    { label: 'Inspect Bed Occupancy', icon: <BedDouble className="w-4 h-4 text-purple-400" />, path: '/ipd/beds' },
    { label: 'Billing Invoices', icon: <Receipt className="w-4 h-4 text-emerald-400" />, path: '/billing/invoices' },
  ];

  const handleSelect = (path: string) => {
    navigate(path);
    close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={close}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Palette container */}
      <div className="relative w-full max-w-2xl bg-[#0F131A] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col">
        {/* Search input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] gap-3 bg-white/[0.02]">
          <Search className="w-5 h-5 text-accent-primary shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search patients, doctors, medicines, invoices or type action..."
            className="w-full bg-transparent text-text-primary text-sm placeholder:text-text-muted focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-text-muted hover:text-text-primary p-1 rounded-lg text-xs"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="text-[10px] font-mono text-text-muted bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/[0.08]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results or Quick Actions */}
        <div className="p-3 max-h-[60vh] overflow-y-auto space-y-4">
          {searchResults ? (
            <div className="space-y-3">
              {/* Patients */}
              {searchResults.patients.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Patients</span>
                  </div>
                  {searchResults.patients.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleSelect(`/patients/${p.id}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] cursor-pointer text-xs group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {p.fullName}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {p.mrn} • {p.age}y {p.gender} • {p.phone}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
                    </div>
                  ))}
                </div>
              )}

              {/* Doctors */}
              {searchResults.doctors.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Doctors</span>
                  </div>
                  {searchResults.doctors.map(d => (
                    <div
                      key={d.id}
                      onClick={() => handleSelect('/doctors')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] cursor-pointer text-xs group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {d.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {d.specialty} • {d.roomNumber}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
                    </div>
                  ))}
                </div>
              )}

              {/* Medicines */}
              {searchResults.medicines.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" />
                    <span>Medicines</span>
                  </div>
                  {searchResults.medicines.map(m => (
                    <div
                      key={m.id}
                      onClick={() => handleSelect('/pharmacy/inventory')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] cursor-pointer text-xs group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {m.name}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          {m.genericName} • Stock: {m.stockQuantity} {m.unit}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
                    </div>
                  ))}
                </div>
              )}

              {/* Invoices */}
              {searchResults.invoices.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-1 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Invoices</span>
                  </div>
                  {searchResults.invoices.map(i => (
                    <div
                      key={i.id}
                      onClick={() => handleSelect('/billing/invoices')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] cursor-pointer text-xs group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                          {i.invoiceNumber} — {i.patientName}
                        </span>
                        <span className="text-[11px] text-text-muted">
                          ₹{i.totalAmount.toLocaleString()} • Status: {i.status}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary" />
                    </div>
                  ))}
                </div>
              )}

              {searchResults.patients.length === 0 &&
                searchResults.doctors.length === 0 &&
                searchResults.medicines.length === 0 &&
                searchResults.invoices.length === 0 && (
                  <div className="py-8 text-center text-xs text-text-muted">
                    No results found for &quot;{query}&quot;. Try another term.
                  </div>
                )}
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider px-2 mb-2">
                Quick Shortcuts & Actions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {quickActions.map(action => (
                  <button
                    key={action.label}
                    onClick={() => handleSelect(action.path)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.06] text-left transition-colors border border-white/[0.04] group"
                  >
                    <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors shrink-0">
                      {action.icon}
                    </div>
                    <span className="text-xs font-medium text-text-primary group-hover:text-white">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-white/[0.015] flex items-center justify-between text-[11px] text-text-muted">
          <span>Tip: Press ESC to close</span>
          <span className="font-mono text-[10px]">MediCore Quick Jump</span>
        </div>
      </div>
    </div>
  );
};
