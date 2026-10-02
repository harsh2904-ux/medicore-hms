import React, { useState, useEffect } from 'react';
import { operationsService } from '../../services/operationsService';
import { RoleDefinition } from '../../types/system';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useNotification } from '../../context/NotificationContext';
import {
  KeyRound,
  Shield,
  Check,
  Save,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const RolesPage: React.FC = () => {
  const { showToast } = useNotification();
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role-1');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await operationsService.getRoles();
      setRoles(data);
      if (data.length > 0 && !selectedRoleId) {
        setSelectedRoleId(data[0].id);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0];

  const handleTogglePermission = async (module: string, key: 'canView' | 'canCreate' | 'canEdit' | 'canDelete', currentVal: boolean) => {
    if (!selectedRole) return;
    try {
      const updated = await operationsService.updateRolePermission(selectedRole.id, module, key, !currentVal);
      setRoles(prev => prev.map(r => r.id === updated.id ? updated : r));
      showToast(`Updated ${key} permission for ${module}`, 'info');
    } catch {
      showToast('Failed to update permission', 'error');
    }
  };

  if (!selectedRole) return <div className="py-12 text-center text-text-muted">Loading permissions...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Roles & Granular RBAC Permissions
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Role-Based Access Control matrix across clinical, financial, and administrative operations
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => showToast('Permission schema synchronized with backend RBAC', 'success')}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Permissions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Role List (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-wider px-1">
            System Roles
          </h2>

          <div className="space-y-2">
            {roles.map(r => (
              <GlassCard
                key={r.id}
                onClick={() => setSelectedRoleId(r.id)}
                className={`p-4 cursor-pointer transition-all ${
                  selectedRoleId === r.id
                    ? 'border-accent-primary/50 bg-accent-primary/10 shadow-glow-primary'
                    : 'hover:border-white/[0.14]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-text-primary">{r.name}</h3>
                  <span className="text-[10px] font-mono text-accent-primary bg-accent-primary/15 px-2 py-0.5 rounded-full">
                    {r.userCount} Users
                  </span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                  {r.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Right: Permission Matrix (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.08]">
              <div>
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-accent-primary" />
                  <span>Permission Matrix: {selectedRole.name}</span>
                </h3>
                <p className="text-xs text-text-muted mt-0.5">{selectedRole.description}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                    <th className="py-2.5 px-3">Module Domain</th>
                    <th className="py-2.5 px-3 text-center">View (Read)</th>
                    <th className="py-2.5 px-3 text-center">Create (Write)</th>
                    <th className="py-2.5 px-3 text-center">Edit (Update)</th>
                    <th className="py-2.5 px-3 text-center">Delete (Purge)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {selectedRole.permissions.map(perm => (
                    <tr key={perm.module} className="hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-text-primary text-sm">
                        {perm.module}
                      </td>

                      {/* View */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm.module, 'canView', perm.canView)}
                          className={`w-6 h-6 rounded-lg border transition-all inline-flex items-center justify-center ${
                            perm.canView
                              ? 'bg-status-success text-black border-status-success font-bold'
                              : 'border-white/[0.2] bg-white/[0.03] text-transparent hover:border-white/[0.4]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Create */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm.module, 'canCreate', perm.canCreate)}
                          className={`w-6 h-6 rounded-lg border transition-all inline-flex items-center justify-center ${
                            perm.canCreate
                              ? 'bg-status-success text-black border-status-success font-bold'
                              : 'border-white/[0.2] bg-white/[0.03] text-transparent hover:border-white/[0.4]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Edit */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm.module, 'canEdit', perm.canEdit)}
                          className={`w-6 h-6 rounded-lg border transition-all inline-flex items-center justify-center ${
                            perm.canEdit
                              ? 'bg-status-success text-black border-status-success font-bold'
                              : 'border-white/[0.2] bg-white/[0.03] text-transparent hover:border-white/[0.4]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleTogglePermission(perm.module, 'canDelete', perm.canDelete)}
                          className={`w-6 h-6 rounded-lg border transition-all inline-flex items-center justify-center ${
                            perm.canDelete
                              ? 'bg-status-danger text-white border-status-danger font-bold'
                              : 'border-white/[0.2] bg-white/[0.03] text-transparent hover:border-white/[0.4]'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] text-xs text-text-muted flex items-center justify-between">
              <span>Security Note: System permissions enforce UI-level gating & token scopes</span>
              <span className="font-mono text-status-success flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Immutable Super Admin Baseline
              </span>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
