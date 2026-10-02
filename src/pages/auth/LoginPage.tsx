import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { MediCoreLogo } from '../../components/layout/MediCoreLogo';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Eye, EyeOff, ShieldCheck, Sparkles, Key, UserPlus, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();
  const { showToast } = useNotification();

  const [email, setEmail] = useState('admin@medicore.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      showToast('Welcome back! Signed in successfully.', 'success', 'Authentication');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setError(msg);
      showToast(msg, 'error', 'Sign In Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    demoLogin();
    showToast('Signed in with Demo Administrator account', 'info', 'Demo Access');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#05070A] bg-ambient-radial flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle background glow orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent-secondary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="w-full max-w-md relative z-10">
        <GlassCard className="p-8 sm:p-10 border-white/[0.12] shadow-2xl backdrop-blur-2xl">
          {/* Logo and title */}
          <div className="flex flex-col items-center text-center mb-8">
            <MediCoreLogo className="mb-3" />
            <h1 className="text-xl font-bold text-text-primary tracking-tight">
              Hospital Management System
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Enterprise clinical, operational & EHR command platform
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-status-danger/15 border border-status-danger/30 text-status-danger text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-status-danger shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email / Employee ID"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@medicore.com"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="hover:text-text-primary text-text-muted transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-white/[0.2] bg-white/[0.05] text-accent-primary focus:ring-accent-primary/40 w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => showToast('Demo environment: Use password "admin123"', 'info')}
                className="text-accent-primary hover:underline font-medium"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2 font-semibold"
              isLoading={isLoading}
            >
              Sign In to MediCore
            </Button>
          </form>

          {/* Staff Registration Link */}
          <div className="mt-4 text-center text-xs text-text-muted">
            Need a new hospital staff account?{' '}
            <Link
              to="/register"
              className="text-accent-primary hover:text-accent-primary/80 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              Register here <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Patient Portal Entrance Banner */}
          <div className="mt-6 p-3.5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary">Are you a Patient?</p>
                <p className="text-[11px] text-text-muted truncate">View your prescriptions, reports & bills</p>
              </div>
            </div>
            <Link
              to="/portal"
              className="px-3 py-1.5 rounded-xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-xs font-semibold hover:bg-accent-primary/20 transition-all shrink-0 whitespace-nowrap"
            >
              Patient Portal →
            </Link>
          </div>

          {/* Demo Login Quick Action */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] flex flex-col gap-3">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full font-medium"
              onClick={handleDemoSignIn}
              leftIcon={<Sparkles className="w-4 h-4 text-accent-secondary" />}
            >
              One-Click Demo Staff Login
            </Button>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-text-muted space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-text-secondary">
                <Key className="w-3 h-3 text-accent-primary" />
                <span>Demo Credentials</span>
              </div>
              <div className="flex items-center justify-between font-mono">
                <span>Email: <strong className="text-text-primary">admin@medicore.com</strong></span>
                <span>Pass: <strong className="text-text-primary">admin123</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center flex items-center justify-center gap-1.5 text-[10px] text-text-muted">
            <ShieldCheck className="w-3.5 h-3.5 text-status-success" />
            <span>256-Bit Encrypted Healthcare Interface (NABH / ABDM Ready)</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
