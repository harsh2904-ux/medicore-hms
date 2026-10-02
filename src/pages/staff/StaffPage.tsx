import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { StaffMember } from '../../types/operations';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../context/NotificationContext';
import {
  UserCheck,
  Building2,
  Phone,
  Mail,
  Clock,
  Plus
} from 'lucide-react';

export const StaffPage: React.FC = () => {
  const { showToast } = useNotification();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getStaff();
      setStaff(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staff.filter(
    s => roleFilter === 'All' || s.role === roleFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Hospital Staff & Human Resources
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Nursing shifts, clinical technicians, administrative duty roster, and status
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Select
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Doctor', label: 'Doctors' },
              { value: 'Head Nurse', label: 'Head Nurse' },
              { value: 'Staff Nurse', label: 'Staff Nurse' },
              { value: 'Pharmacist', label: 'Pharmacist' },
              { value: 'Billing Executive', label: 'Billing Executive' },
            ]}
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="py-1 text-xs min-w-[140px]"
          />

          <Button
            variant="primary"
            onClick={() => showToast('Staff onboarding workflow initialized', 'info')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Staff Member
          </Button>
        </div>
      </div>

      {/* Staff Table */}
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Emp ID</th>
                <th className="py-2.5 px-3">Staff Member</th>
                <th className="py-2.5 px-3">Designation / Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Contact</th>
                <th className="py-2.5 px-3">Active Shift</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredStaff.map(member => (
                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-mono font-semibold text-accent-primary whitespace-nowrap">
                    {member.employeeId}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={member.name} size="sm" />
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{member.name}</div>
                        <div className="text-[10px] text-text-muted">{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium text-text-secondary">{member.role}</td>
                  <td className="py-3 px-3 text-text-muted">{member.department}</td>
                  <td className="py-3 px-3 font-mono text-text-secondary">{member.phone}</td>
                  <td className="py-3 px-3 font-mono text-accent-secondary">{member.shift}</td>
                  <td className="py-3 px-3 text-right">
                    <StatusBadge status={member.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
