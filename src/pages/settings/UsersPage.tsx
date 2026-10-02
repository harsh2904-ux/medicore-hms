import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { User, SystemRole } from '../../types/system';
import { GlassCard } from '../../components/ui/GlassCard';
import { Avatar } from '../../components/ui/Avatar';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { useNotification } from '../../context/NotificationContext';
import {
  UserCheck,
  Shield,
  KeyRound,
  UserX,
  Plus
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { showToast } = useNotification();
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getUsers();
      setUsers(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (id: string, name: string) => {
    try {
      const updated = await operationsService.toggleUserStatus(id);
      showToast(`User ${name} status changed to ${updated.status}`, 'info');
      fetchUsers();
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const filteredUsers = users.filter(
    u => roleFilter === 'All' || u.role === roleFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            User Accounts & System Access
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Role assignments, login activity, and security status control
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Select
            options={[
              { value: 'All', label: 'All Roles' },
              { value: 'Super Admin', label: 'Super Admin' },
              { value: 'Doctor', label: 'Doctor' },
              { value: 'Nurse', label: 'Nurse' },
              { value: 'Pharmacist', label: 'Pharmacist' },
              { value: 'Accountant', label: 'Accountant' },
            ]}
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="py-1 text-xs min-w-[140px]"
          />

          <Button
            variant="primary"
            onClick={() => showToast('New system user invitation dialog opened', 'info')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Invite User
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <GlassCard className="p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Assigned Role</th>
                <th className="py-2.5 px-3">Department</th>
                <th className="py-2.5 px-3">Last Active</th>
                <th className="py-2.5 px-3">Account Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={u.name} size="sm" />
                      <div>
                        <div className="font-semibold text-text-primary text-sm">{u.name}</div>
                        <div className="text-[11px] text-text-muted font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-semibold text-accent-primary">{u.role}</span>
                  </td>
                  <td className="py-3 px-3 text-text-secondary">{u.department}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{u.lastLogin}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={u.status} size="sm" />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => showToast(`Password reset link dispatched to ${u.email}`, 'success')}
                        leftIcon={<KeyRound className="w-3.5 h-3.5" />}
                        className="py-1 text-xs"
                      >
                        Reset Key
                      </Button>
                      <Button
                        size="sm"
                        variant={u.status === 'Active' ? 'ghost' : 'secondary'}
                        onClick={() => handleToggleStatus(u.id, u.name)}
                        className={`py-1 text-xs ${u.status === 'Active' ? 'text-status-danger hover:bg-status-danger/10' : 'text-status-success'}`}
                      >
                        {u.status === 'Active' ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
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
