import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { patientService } from '../../services/patientService';
import { useNotification } from '../../context/NotificationContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import {
  User,
  Phone,
  Shield,
  HeartHandshake,
  Stethoscope,
  CreditCard,
  ArrowLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

const patientSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  email: z.string().email('Valid email address required').or(z.literal('')),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pinCode: z.string().min(6, 'Valid 6-digit PIN code required'),
  abhaId: z.string().optional(),
  govtIdType: z.string().optional(),
  govtIdNumber: z.string().optional(),
  emergencyContactName: z.string().min(2, 'Emergency contact name required'),
  emergencyContactRelationship: z.string().min(2, 'Relationship required'),
  emergencyContactPhone: z.string().min(10, 'Valid emergency phone required'),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),
  currentMedications: z.string().optional(),
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export const PatientRegistrationPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '1995-05-15',
      gender: 'Male',
      bloodGroup: 'O+',
      phone: '+91 98201 ',
      email: '',
      address: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400001',
      abhaId: '',
      govtIdType: 'Aadhaar',
      govtIdNumber: '',
      emergencyContactName: '',
      emergencyContactRelationship: 'Spouse',
      emergencyContactPhone: '+91 98201 ',
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      insuranceProvider: '',
      policyNumber: '',
    },
  });

  const onSubmit = async (data: PatientFormData, andBookAppointment = false) => {
    setIsSubmitting(true);
    try {
      const created = await patientService.createPatient({
        ...data,
        email: data.email || `${data.firstName.toLowerCase()}.${data.lastName.toLowerCase()}@example.com`,
      });
      showToast(`Patient ${created.fullName} saved to PostgreSQL database (MRN: ${created.mrn})`, 'success', 'Registration Completed');

      if (andBookAppointment) {
        navigate('/appointments');
      } else {
        navigate(`/patients/${created.id}`);
      }
    } catch {
      showToast('Failed to register patient. Please check input values.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemoData = () => {
    setValue('firstName', 'Devendra');
    setValue('middleName', 'Kumar');
    setValue('lastName', 'Shukla');
    setValue('dob', '1988-03-21');
    setValue('gender', 'Male');
    setValue('bloodGroup', 'B+');
    setValue('phone', '+91 98202 88419');
    setValue('email', 'devendra.shukla@techcorp.in');
    setValue('address', 'Flat 502, Orchid Woods, Powai');
    setValue('city', 'Mumbai');
    setValue('state', 'Maharashtra');
    setValue('pinCode', '400076');
    setValue('abhaId', '91-7712-4401-9921 (Demo ABHA)');
    setValue('govtIdType', 'Aadhaar');
    setValue('govtIdNumber', 'XXXX-XXXX-8910');
    setValue('emergencyContactName', 'Manju Shukla');
    setValue('emergencyContactRelationship', 'Spouse');
    setValue('emergencyContactPhone', '+91 98202 88420');
    setValue('allergies', 'Ciprofloxacin');
    setValue('chronicConditions', 'Hypertension');
    setValue('currentMedications', 'Amlodipine 5mg');
    setValue('insuranceProvider', 'Star Health & Allied Insurance');
    setValue('policyNumber', 'STAR-CORP-44019');
    showToast('Demo patient details populated', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/patients')}
            aria-label="Back to patients list"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
              Patient Registration
            </h1>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Create electronic medical record & assign Medical Record Number (MRN)
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleFillDemoData}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-accent-secondary" />}
        >
          Fill Demo Details
        </Button>
      </div>

      <form onSubmit={handleSubmit((d) => onSubmit(d, false))} className="space-y-6">
        {/* Section 1: Personal Information */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-accent-primary/10 text-accent-primary">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Personal Demographics</h2>
              <p className="text-xs text-text-muted">Primary identity, age, and biological vitals</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="First Name"
              required
              {...register('firstName')}
              error={errors.firstName?.message}
              placeholder="e.g. Rahul"
            />
            <Input
              label="Middle Name"
              {...register('middleName')}
              placeholder="e.g. Kishore"
            />
            <Input
              label="Last Name"
              required
              {...register('lastName')}
              error={errors.lastName?.message}
              placeholder="e.g. Sharma"
            />
            <Input
              label="Date of Birth"
              type="date"
              required
              {...register('dob')}
              error={errors.dob?.message}
            />
            <Select
              label="Gender"
              required
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              {...register('gender')}
            />
            <Select
              label="Blood Group"
              required
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
              ]}
              {...register('bloodGroup')}
            />
          </div>
        </GlassCard>

        {/* Section 2: Contact Information */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-info/10 text-status-info">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Contact & Address</h2>
              <p className="text-xs text-text-muted">Communication channels and residential address</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Mobile Number"
              required
              {...register('phone')}
              error={errors.phone?.message}
              placeholder="+91 98200 00000"
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email')}
              error={errors.email?.message}
              placeholder="patient@example.com"
            />
            <div className="sm:col-span-2">
              <Input
                label="Street Address / Flat No."
                required
                {...register('address')}
                error={errors.address?.message}
                placeholder="402, Sea Breeze Towers, Worli"
              />
            </div>
            <Input
              label="City"
              required
              {...register('city')}
              error={errors.city?.message}
              placeholder="Mumbai"
            />
            <Input
              label="State"
              required
              {...register('state')}
              error={errors.state?.message}
              placeholder="Maharashtra"
            />
            <Input
              label="PIN Code"
              required
              {...register('pinCode')}
              error={errors.pinCode?.message}
              placeholder="400018"
            />
          </div>
        </GlassCard>

        {/* Section 3: Identity & ABDM */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-accent-secondary/10 text-accent-secondary">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Government & Digital Health ID</h2>
              <p className="text-xs text-text-muted">ABHA (Ayushman Bharat Health Account) & National IDs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="ABHA ID (Demo)"
              {...register('abhaId')}
              placeholder="91-4402-9812-3341"
              helperText="Demo ABDM compliant health identifier"
            />
            <Select
              label="Government ID Type"
              options={[
                { value: 'Aadhaar', label: 'Aadhaar Card' },
                { value: 'PAN', label: 'PAN Card' },
                { value: 'Passport', label: 'Passport' },
                { value: 'Voter ID', label: 'Voter ID' },
              ]}
              {...register('govtIdType')}
            />
            <Input
              label="ID Document Number"
              {...register('govtIdNumber')}
              placeholder="XXXX-XXXX-XXXX"
            />
          </div>
        </GlassCard>

        {/* Section 4: Emergency Contact */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-danger/10 text-status-danger">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Emergency Contact</h2>
              <p className="text-xs text-text-muted">Primary next-of-kin contact for urgent notifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Contact Person Name"
              required
              {...register('emergencyContactName')}
              error={errors.emergencyContactName?.message}
              placeholder="e.g. Sunita Sharma"
            />
            <Select
              label="Relationship"
              options={[
                { value: 'Spouse', label: 'Spouse' },
                { value: 'Parent', label: 'Parent' },
                { value: 'Child', label: 'Child' },
                { value: 'Sibling', label: 'Sibling' },
                { value: 'Guardian', label: 'Guardian' },
                { value: 'Friend', label: 'Friend' },
              ]}
              {...register('emergencyContactRelationship')}
            />
            <Input
              label="Emergency Phone"
              required
              {...register('emergencyContactPhone')}
              error={errors.emergencyContactPhone?.message}
              placeholder="+91 98200 00000"
            />
          </div>
        </GlassCard>

        {/* Section 5: Medical Background */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-warning/10 text-status-warning">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Known Medical History</h2>
              <p className="text-xs text-text-muted">Allergies, chronic conditions, and active drugs</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Textarea
              label="Allergies (comma-separated)"
              {...register('allergies')}
              placeholder="e.g. Penicillin, Sulfa, Peanuts"
              rows={2}
            />
            <Textarea
              label="Chronic Conditions (comma-separated)"
              {...register('chronicConditions')}
              placeholder="e.g. Hypertension, Type 2 Diabetes"
              rows={2}
            />
            <Textarea
              label="Current Medications"
              {...register('currentMedications')}
              placeholder="e.g. Telmisartan 40mg, Metformin"
              rows={2}
            />
          </div>
        </GlassCard>

        {/* Section 6: Insurance & TPA */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-white/[0.08]">
            <div className="p-2 rounded-xl bg-status-success/10 text-status-success">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Insurance & Cashless Coverage</h2>
              <p className="text-xs text-text-muted">Health insurance provider and policy details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Insurance Provider / TPA"
              {...register('insuranceProvider')}
              placeholder="e.g. Star Health, HDFC ERGO, Care Health"
            />
            <Input
              label="Policy / Membership Number"
              {...register('policyNumber')}
              placeholder="e.g. POL-2026-992144"
            />
          </div>
        </GlassCard>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/patients')}
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Save Patient
            </Button>
            <Button
              type="button"
              variant="secondary"
              isLoading={isSubmitting}
              onClick={handleSubmit((d) => onSubmit(d, true))}
            >
              Save & Create Appointment
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
