import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Doctor } from '../../types/appointment';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import {
  CalendarDays,
  Clock,
  MapPin,
  Phone,
  Mail,
  GraduationCap,
  CalendarCheck
} from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      setIsLoading(true);
      try {
        const data = await appointmentService.getDoctors();
        setDoctors(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const filteredDoctors = doctors.filter(
    d => departmentFilter === 'All' || d.department === departmentFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Medical Faculty & Consultants
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Specialist clinicians, consulting rooms, schedules, and active availability
          </p>
        </div>

        <Select
          options={[
            { value: 'All', label: 'All Specialties' },
            { value: 'Cardiology', label: 'Cardiology' },
            { value: 'Endocrinology', label: 'Endocrinology' },
            { value: 'Neurology', label: 'Neurology' },
            { value: 'General Medicine', label: 'General Medicine' },
            { value: 'Pediatrics', label: 'Pediatrics' },
            { value: 'Radiology', label: 'Radiology' },
          ]}
          value={departmentFilter}
          onChange={e => setDepartmentFilter(e.target.value)}
          className="min-w-[180px] text-xs py-1"
        />
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDoctors.map(doc => (
          <GlassCard key={doc.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-white/[0.18]">
            <div>
              {/* Header with avatar & availability */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar name={doc.name} size="lg" />
                  <div>
                    <h3 className="text-base font-semibold text-text-primary">{doc.name}</h3>
                    <div className="text-xs text-accent-primary font-medium">{doc.specialty}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{doc.department}</div>
                  </div>
                </div>
                <StatusBadge status={doc.availability} size="sm" />
              </div>

              {/* Qualifications & experience */}
              <div className="mt-4 p-3 rounded-xl bg-white/[0.025] border border-white/[0.05] space-y-2 text-xs">
                <div className="flex items-center gap-2 text-text-secondary">
                  <GraduationCap className="w-4 h-4 text-text-muted shrink-0" />
                  <span className="truncate">{doc.qualification}</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <Clock className="w-4 h-4 text-text-muted shrink-0" />
                  <span>{doc.experienceYears} Years Clinical Experience</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="w-4 h-4 text-accent-secondary shrink-0" />
                  <span className="font-semibold text-text-primary">Room: {doc.roomNumber}</span>
                </div>
              </div>

              {/* Today's workload */}
              <div className="mt-3 flex items-center justify-between text-xs text-text-muted">
                <span>Today&apos;s Appointments:</span>
                <span className="font-mono font-bold text-text-primary">
                  {doc.todayAppointmentsCount} Patients
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              <span className="text-[11px] text-text-muted font-mono">
                {doc.schedule.startTime} - {doc.schedule.endTime}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDoctor(doc)}
                leftIcon={<CalendarDays className="w-3.5 h-3.5" />}
              >
                View Roster
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Doctor Schedule Modal */}
      {selectedDoctor && (
        <Modal
          isOpen={!!selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          title={`Doctor Profile: ${selectedDoctor.name}`}
          subtitle={`${selectedDoctor.specialty} • ${selectedDoctor.department}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-4">
              <Avatar name={selectedDoctor.name} size="lg" />
              <div className="text-xs space-y-1">
                <div className="font-bold text-sm text-text-primary">{selectedDoctor.name}</div>
                <div className="text-text-muted">{selectedDoctor.qualification}</div>
                <div className="flex items-center gap-3 pt-1">
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Phone className="w-3 h-3" /> {selectedDoctor.phone}
                  </span>
                  <span className="flex items-center gap-1 text-text-secondary">
                    <Mail className="w-3 h-3" /> {selectedDoctor.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.025] border border-white/[0.06] space-y-3">
              <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-accent-primary" />
                <span>Weekly OPD Consultation Timetable</span>
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-text-muted block">Consulting Days:</span>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {selectedDoctor.schedule.days.map(day => (
                      <span key={day} className="px-2 py-0.5 rounded bg-accent-primary/15 text-accent-primary font-semibold text-[11px]">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-text-muted block">OPD Hours:</span>
                  <span className="font-mono text-text-primary mt-1 inline-block font-semibold">
                    {selectedDoctor.schedule.startTime} to {selectedDoctor.schedule.endTime}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-text-secondary">
                <span>Standard Slot Duration:</span>
                <span className="font-mono text-text-primary">{selectedDoctor.schedule.slotDurationMinutes} Minutes / Patient</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
