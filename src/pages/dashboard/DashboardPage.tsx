import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { analyticsService, DashboardKPIs } from '../../services/analyticsService';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types/appointment';
import {
  Users,
  CalendarDays,
  BedDouble,
  Activity,
  IndianRupee,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  FileCheck2,
  Pill,
  ShieldAlert
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [patientFlowData, setPatientFlowData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [bedOccupancy, setBedOccupancy] = useState<any[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [flowTimeframe, setFlowTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Weekly');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [kpiRes, flowRes, revRes, bedRes, aptRes] = await Promise.all([
          analyticsService.getDashboardKPIs(),
          analyticsService.getPatientFlowData(flowTimeframe),
          analyticsService.getRevenueData('Weekly'),
          analyticsService.getBedOccupancyBreakdown(),
          appointmentService.getAppointments({ date: '2026-09-30' }),
        ]);
        setKpis(kpiRes);
        setPatientFlowData(flowRes);
        setRevenueData(revRes);
        setBedOccupancy(bedRes);
        setTodayAppointments(aptRes);
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [flowTimeframe]);

  const recentActivities = [
    { title: 'Dr. Rajesh Mehta completed consultation', detail: 'Patient: Rahul Sharma (MC-2026-001284)', time: '12m ago', type: 'consultation' },
    { title: 'CBC Lab Report Verified', detail: 'Central Hematology Lab • Pathologist sign-off', time: '28m ago', type: 'lab' },
    { title: 'Payment Received: ₹4,850 via UPI', detail: 'Invoice INV-2026-00431 • Counter 2', time: '45m ago', type: 'billing' },
    { title: 'Patient Admitted to Tower B', detail: 'Ward 2A / Bed GEN-101 • Cardiology', time: '1h ago', type: 'admission' },
  ];

  const pendingTasks = [
    { label: '12 lab reports awaiting verification', count: 12, path: '/laboratory/results', icon: <FileCheck2 className="w-4 h-4 text-status-warning" /> },
    { label: '5 discharge summaries pending approval', count: 5, path: '/ipd', icon: <BedDouble className="w-4 h-4 text-accent-primary" /> },
    { label: '8 pharmacy prescriptions pending dispensing', count: 8, path: '/pharmacy/prescriptions', icon: <Pill className="w-4 h-4 text-accent-secondary" /> },
    { label: '3 insurance TPA pre-auth approvals pending', count: 3, path: '/insurance', icon: <ShieldAlert className="w-4 h-4 text-status-danger" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight font-sans">
            Good Morning, Admin
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Here&apos;s today&apos;s hospital command overview for MediCore Apex.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/queue')}
            leftIcon={<Clock className="w-3.5 h-3.5 text-accent-primary" />}
          >
            Live Queue
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/patients/new')}
            leftIcon={<Users className="w-3.5 h-3.5" />}
          >
            Register Patient
          </Button>
        </div>
      </div>

      {/* Top KPI Cards (5 required) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Patients"
          value={kpis ? kpis.totalPatients.toLocaleString() : '1,248'}
          icon={<Users className="w-5 h-5 text-accent-primary" />}
          trend={kpis?.trends.patients}
          comparisonText="active cohort"
          indicatorColor="primary"
          onClick={() => navigate('/patients')}
        />
        <StatCard
          label="Today's Appointments"
          value={kpis ? kpis.todayAppointments : '186'}
          icon={<CalendarDays className="w-5 h-5 text-status-warning" />}
          trend={kpis?.trends.appointments}
          comparisonText="across 14 depts"
          indicatorColor="warning"
          onClick={() => navigate('/appointments')}
        />
        <StatCard
          label="Admissions"
          value={kpis ? kpis.admissions : '42'}
          icon={<BedDouble className="w-5 h-5 text-accent-secondary" />}
          trend={kpis?.trends.admissions}
          comparisonText="current inpatients"
          indicatorColor="secondary"
          onClick={() => navigate('/ipd')}
        />
        <StatCard
          label="Bed Occupancy"
          value={kpis ? `${kpis.bedOccupancyRate}%` : '78%'}
          icon={<Activity className="w-5 h-5 text-status-info" />}
          trend={kpis?.trends.occupancy}
          comparisonText="195 / 250 beds"
          indicatorColor="primary"
          onClick={() => navigate('/ipd/beds')}
        />
        <StatCard
          label="Today's Revenue"
          value={kpis ? `₹${(kpis.todayRevenueINR / 100000).toFixed(2)}L` : '₹8.42L'}
          icon={<IndianRupee className="w-5 h-5 text-status-success" />}
          trend={kpis?.trends.revenue}
          comparisonText="billed till now"
          indicatorColor="success"
          onClick={() => navigate('/billing')}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Patient Flow (2 cols) */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Patient Flow Dynamics</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Volume breakdown between Outpatient (OPD), Emergency (ER), and Inpatient (IPD)
              </p>
            </div>
            <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs">
              {(['Daily', 'Weekly', 'Monthly'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setFlowTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    flowTimeframe === tf
                      ? 'bg-accent-primary text-white shadow-sm'
                      : 'text-text-muted hover:text-text-primary'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="opdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B8CFF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="erGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5C70" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#FF5C70" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="ipdGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#687386" fontSize={11} tickLine={false} />
                <YAxis stroke="#687386" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F131A',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#F5F7FA',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="opd" name="OPD Visits" stroke="#5B8CFF" strokeWidth={2} fillOpacity={1} fill="url(#opdGrad)" />
                <Area type="monotone" dataKey="emergency" name="Emergency (ER)" stroke="#FF5C70" strokeWidth={2} fillOpacity={1} fill="url(#erGrad)" />
                <Area type="monotone" dataKey="ipd" name="IPD Admissions" stroke="#7C5CFF" strokeWidth={2} fillOpacity={1} fill="url(#ipdGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Chart 2: Revenue Trend (1 col) */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Weekly Revenue Velocity</h2>
                <p className="text-xs text-text-secondary mt-0.5">Actual vs Daily Target (₹ Lakhs)</p>
              </div>
              <span className="p-1.5 rounded-lg bg-status-success/10 text-status-success">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" stroke="#687386" fontSize={11} tickLine={false} />
                  <YAxis stroke="#687386" fontSize={11} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`₹${val} Lakhs`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: '#0F131A',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: '#F5F7FA'
                    }}
                  />
                  <Bar dataKey="revenue" name="Actual (₹ L)" fill="#30D158" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Target (₹ L)" fill="rgba(255,255,255,0.15)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Secondary Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: Today's Appointments (2 cols) */}
        <GlassCard className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Today&apos;s Appointments</h2>
              <p className="text-xs text-text-secondary mt-0.5">Live schedule across outpatient clinics</p>
            </div>
            <Link
              to="/appointments"
              className="text-xs text-accent-primary hover:underline font-medium flex items-center gap-1"
            >
              <span>View full calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted uppercase tracking-wider">
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Patient</th>
                  <th className="py-2.5 px-3">Doctor</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {todayAppointments.slice(0, 5).map(apt => (
                  <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3 font-mono font-medium text-text-secondary whitespace-nowrap">
                      {apt.time}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-text-primary">{apt.patientName}</div>
                      <div className="text-[10px] text-text-muted">{apt.patientMrn}</div>
                    </td>
                    <td className="py-3 px-3 text-text-secondary">{apt.doctorName}</td>
                    <td className="py-3 px-3 text-text-muted">{apt.department}</td>
                    <td className="py-3 px-3 text-right">
                      <StatusBadge status={apt.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Widget 2: Bed Availability (1 col) */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-text-primary">Bed Availability</h2>
                <p className="text-xs text-text-secondary mt-0.5">Live status by critical units</p>
              </div>
              <Link to="/ipd/beds" className="text-xs text-accent-primary hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {bedOccupancy.map(item => (
                <div key={item.category} className="p-3 rounded-xl bg-white/[0.025] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-text-primary">{item.category} Ward</span>
                    <span className="font-mono text-text-secondary">
                      {item.occupied} / {item.total} ({item.rate}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden flex">
                    <div
                      style={{ width: `${item.rate}%` }}
                      className={`h-full ${
                        item.rate > 80 ? 'bg-status-danger' : item.rate > 60 ? 'bg-accent-primary' : 'bg-status-success'
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-text-muted mt-2">
                    <span className="text-status-success">Available: {item.available}</span>
                    <span className="text-status-warning">Cleaning: {item.cleaning}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Bottom Section: Pending Tasks & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-status-warning" />
              <h2 className="text-sm font-semibold text-text-primary">Operational Action Items</h2>
            </div>
            <span className="text-xs font-mono text-status-warning bg-status-warning/15 px-2 py-0.5 rounded-full border border-status-warning/20">
              Pending
            </span>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.map((task, idx) => (
              <div
                key={idx}
                onClick={() => navigate(task.path)}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.025] border border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.05] cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] transition-colors">
                    {task.icon}
                  </div>
                  <span className="text-xs text-text-secondary group-hover:text-text-primary font-medium">
                    {task.label}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-white">
                    {task.count}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-status-success" />
              <h2 className="text-sm font-semibold text-text-primary">Recent Hospital Activity</h2>
            </div>
            <Link to="/settings/audit-logs" className="text-xs text-accent-primary hover:underline">
              Audit Logs
            </Link>
          </div>

          <div className="space-y-3">
            {recentActivities.map((act, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <span className="w-2 h-2 rounded-full bg-accent-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary truncate">{act.title}</span>
                    <span className="text-[10px] text-text-muted shrink-0">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5 truncate">{act.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
