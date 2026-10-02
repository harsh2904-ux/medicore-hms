import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { operationsService } from '../../services/operationsService';
import { HospitalProfile } from '../../types/system';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useNotification } from '../../context/NotificationContext';
import {
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle2,
  Users,
  KeyRound,
  History
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await operationsService.getHospitalProfile();
      setProfile(data);
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setIsSaving(true);
    try {
      await operationsService.updateHospitalProfile(profile);
      showToast('Hospital profile and institutional settings updated successfully', 'success', 'Settings Saved');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return <div className="py-12 text-center text-text-muted">Loading configuration...</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Institutional Settings & Configuration
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            NABH facility licensing, GST tax invoicing metadata, emergency helplines, and security
          </p>
        </div>

        {/* Quick settings jump */}
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings/users')}
            leftIcon={<Users className="w-3.5 h-3.5 text-accent-primary" />}
          >
            Users
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings/roles')}
            leftIcon={<KeyRound className="w-3.5 h-3.5 text-accent-secondary" />}
          >
            Permissions
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/settings/audit-logs')}
            leftIcon={<History className="w-3.5 h-3.5 text-status-warning" />}
          >
            Audit Logs
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hospital Identity */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-accent-primary/10 text-accent-primary">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Hospital Facility Profile</h2>
              <p className="text-xs text-text-muted">Entity naming and legal registration</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Hospital Name"
              required
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Institutional Tagline"
              value={profile.tagline}
              onChange={e => setProfile({ ...profile, tagline: e.target.value })}
            />
            <Input
              label="State Healthcare Registration #"
              required
              value={profile.registrationNumber}
              onChange={e => setProfile({ ...profile, registrationNumber: e.target.value })}
            />
            <Input
              label="GSTIN / Tax ID"
              required
              value={profile.taxGstin}
              onChange={e => setProfile({ ...profile, taxGstin: e.target.value })}
            />
          </div>
        </GlassCard>

        {/* Emergency & Helpline Contacts */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-danger/10 text-status-danger">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Emergency Helpline & Communications</h2>
              <p className="text-xs text-text-muted">Direct public helpline displayed on topbar and reports</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Emergency Helpline (24x7)"
              required
              value={profile.emergencyHelpline}
              onChange={e => setProfile({ ...profile, emergencyHelpline: e.target.value })}
            />
            <Input
              label="Board Line Phone"
              required
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />
            <Input
              label="Official Contact Email"
              type="email"
              required
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
        </GlassCard>

        {/* Address and Geolocation */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-info/10 text-status-info">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Campus Location</h2>
              <p className="text-xs text-text-muted">Physical address for bills and ambulance dispatch base</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Street Address"
                required
                value={profile.address}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
              />
            </div>
            <Input
              label="City"
              required
              value={profile.city}
              onChange={e => setProfile({ ...profile, city: e.target.value })}
            />
            <Input
              label="State / Province"
              required
              value={profile.state}
              onChange={e => setProfile({ ...profile, state: e.target.value })}
            />
            <Input
              label="PIN / Postal Code"
              required
              value={profile.pinCode}
              onChange={e => setProfile({ ...profile, pinCode: e.target.value })}
            />
            <Input
              label="Official Web Portal"
              value={profile.website}
              onChange={e => setProfile({ ...profile, website: e.target.value })}
            />
          </div>
        </GlassCard>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Hospital Profile
          </Button>
        </div>
      </form>
    </div>
  );
};
