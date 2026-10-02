import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import { GlassCard } from '../../components/ui/GlassCard';
import { StatCard } from '../../components/ui/StatCard';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  BedDouble,
  IndianRupee,
  Calendar
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [patientData, setPatientData] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [deptData, setDeptData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [flow, rev, dept] = await Promise.all([
          analyticsService.getPatientFlowData(timeframe as any),
          analyticsService.getRevenueData(timeframe as any),
          analyticsService.getDepartmentPerformance(),
        ]);
        setPatientData(flow);
        setRevenueData(rev);
        setDeptData(dept);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [timeframe]);

  const admissionsTrendData = [
    { name: 'Mon', admissions: 18, discharges: 14 },
    { name: 'Tue', admissions: 22, discharges: 19 },
    { name: 'Wed', admissions: 20, discharges: 21 },
    { name: 'Thu', admissions: 19, discharges: 16 },
    { name: 'Fri', admissions: 25, discharges: 22 },
    { name: 'Sat', admissions: 28, discharges: 26 },
    { name: 'Sun', admissions: 15, discharges: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary tracking-tight font-sans">
            Executive Analytics & Insights
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
            Cohort retention, departmental yield, bed turnover, and resource utilization
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center gap-1 p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl text-xs">
          {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timeframe === tf
                  ? 'bg-accent-primary text-white shadow-sm font-semibold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label="Cohort Volume"
          value="1,248"
          icon={<Users className="w-5 h-5 text-accent-primary" />}
          trend={{ value: '+12.4% vs benchmark', isPositive: true }}
          indicatorColor="primary"
        />
        <StatCard
          label="Operating Revenue"
          value="₹ 58.4L"
          icon={<IndianRupee className="w-5 h-5 text-status-success" />}
          trend={{ value: '+14.8% vs last month', isPositive: true }}
          indicatorColor="success"
        />
        <StatCard
          label="Bed Utilization"
          value="78.2%"
          icon={<BedDouble className="w-5 h-5 text-accent-secondary" />}
          trend={{ value: '+3.8% efficiency', isPositive: true }}
          indicatorColor="secondary"
        />
        <StatCard
          label="Clinical Quality (NPS)"
          value="92 / 100"
          icon={<Activity className="w-5 h-5 text-status-info" />}
          trend={{ value: '+2.1 pts', isPositive: true }}
          indicatorColor="primary"
        />
      </div>

      {/* Chart Row 1: Patient Influx & Admissions/Discharges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Patient Influx Trend ({timeframe})</h2>
              <p className="text-xs text-text-muted">Total encounters across outpatient and emergency</p>
            </div>
            <span className="p-1 rounded-lg bg-accent-primary/10 text-accent-primary text-xs font-mono">
              Volume Stream
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={patientData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaOpd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5B8CFF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#5B8CFF" stopOpacity={0.0} />
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
                    color: '#F5F7FA'
                  }}
                />
                <Area type="monotone" dataKey="opd" name="Outpatient Visits" stroke="#5B8CFF" strokeWidth={2.5} fill="url(#areaOpd)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Inpatient Admissions vs Discharges</h2>
              <p className="text-xs text-text-muted">Net bed occupancy turnover balance</p>
            </div>
            <span className="p-1 rounded-lg bg-accent-secondary/10 text-accent-secondary text-xs font-mono">
              Inpatient Flow
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={admissionsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#687386" fontSize={11} tickLine={false} />
                <YAxis stroke="#687386" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F131A',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '12px',
                    color: '#F5F7FA'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="admissions" name="Admissions" fill="#7C5CFF" radius={[6, 6, 0, 0]} />
                <Bar dataKey="discharges" name="Discharges" fill="#30D158" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      {/* Chart Row 2: Department Performance & Yield */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Departmental Efficiency & Patient Volume</h2>
            <p className="text-xs text-text-muted">Comparison of clinical throughput and average outpatient wait times</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-text-muted uppercase">
                <th className="py-2.5 px-3">Clinical Department</th>
                <th className="py-2.5 px-3">Patients Treated</th>
                <th className="py-2.5 px-3">Revenue (₹ Lakhs)</th>
                <th className="py-2.5 px-3">Avg Wait Time</th>
                <th className="py-2.5 px-3 text-right">Performance Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {deptData.map((d, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-semibold text-text-primary text-sm">{d.department}</td>
                  <td className="py-3 px-3 font-mono text-text-secondary">{d.patients}</td>
                  <td className="py-3 px-3 font-mono font-bold text-status-success">₹{d.revenueLakhs} L</td>
                  <td className="py-3 px-3 font-mono text-accent-primary">{d.avgWaitMins} mins</td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-status-success/15 text-status-success font-bold font-mono text-[11px]">
                      98.{9 - i}%
                    </span>
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
