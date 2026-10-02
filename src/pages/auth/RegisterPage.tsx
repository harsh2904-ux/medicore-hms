import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService, RegisterStaffInput } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';
import {
  UserPlus,
  Mail,
  Lock,
  Phone,
  Building,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  CheckCircle2,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<RegisterStaffInput['role']>('doctor');
  const [department, setDepartment] = useState('General Medicine');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid hospital email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await authService.register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department,
        phone: phone.trim() || '+1 (555) 000-0000',
      });

      // Update auth context state by logging in
      await login(email.trim().toLowerCase(), password);

      showToast(
        `Staff account created and saved to PostgreSQL! Welcome, ${user.name}`,
        'success',
        'Staff Registration Completed'
      );

      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#05070A] bg-ambient-radial relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 my-8">
        <GlassCard className="p-6 sm:p-8 border-white/[0.12] shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex justify-center mb-3">
              <MediCoreLogo />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
              Staff Registration
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Create an official staff account with role-based access to MediCore HMS
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-status-danger/10 border border-status-danger/25 text-status-danger text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-danger" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="First Name"
                placeholder="e.g. John"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                leftIcon={<User className="w-4 h-4 text-text-muted" />}
                required
              />
              <Input
                label="Last Name"
                placeholder="e.g. Watson"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <Input
              label="Hospital Email Address"
              type="email"
              placeholder="e.g. j.watson@medicore.health"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4 text-text-muted" />}
              required
            />

            {/* Role & Department */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Assigned Clinical Role"
                options={[
                  { value: 'doctor', label: 'Doctor / Physician' },
                  { value: 'nurse', label: 'Registered Nurse' },
                  { value: 'receptionist', label: 'Front Desk / Receptionist' },
                  { value: 'pharmacist', label: 'Pharmacist' },
                  { value: 'lab_technician', label: 'Lab Technician' },
                  { value: 'billing', label: 'Billing / Accounts Officer' },
                  { value: 'admin', label: 'System Administrator' },
                ]}
                value={role}
                onChange={e => setRole(e.target.value as RegisterStaffInput['role'])}
              />

              <Select
                label="Department"
                options={[
                  { value: 'Cardiology', label: 'Cardiology' },
                  { value: 'Neurology', label: 'Neurology' },
                  { value: 'Pediatrics', label: 'Pediatrics' },
                  { value: 'Orthopedics', label: 'Orthopedics' },
                  { value: 'Emergency', label: 'Emergency Medicine' },
                  { value: 'General Medicine', label: 'General Medicine' },
                  { value: 'Pathology & Lab', label: 'Pathology & Lab' },
                  { value: 'Pharmacy', label: 'Pharmacy' },
                  { value: 'Accounts & Billing', label: 'Accounts & Billing' },
                  { value: 'Hospital Administration', label: 'Hospital Administration' },
                ]}
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>

            {/* Phone */}
            <Input
              label="Contact Phone"
              type="tel"
              placeholder="+1 (555) 012-3456"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              leftIcon={<Phone className="w-4 h-4 text-text-muted" />}
            />

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative">
                <Input
                  label="Create Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4 text-text-muted" />}
                required
              />
            </div>

            {/* Security note */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[11px] text-text-muted flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-accent-primary shrink-0 mt-0.5" />
              <span>
                Account will be verified and stored directly in the hospital's PostgreSQL security database with
                role-based cryptographic credentials.
              </span>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full py-2.5 mt-2"
              isLoading={isSubmitting}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Create Staff Account
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-text-muted">
            Already have an active staff account?{' '}
            <Link
              to="/login"
              className="text-accent-primary hover:text-accent-primary/80 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Sign In here <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
