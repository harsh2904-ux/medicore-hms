export interface DashboardKPIs {
  totalPatients: number;
  todayAppointments: number;
  admissions: number;
  bedOccupancyRate: number; // percentage
  todayRevenueINR: number;
  trends: {
    patients: { value: string; isPositive: boolean };
    appointments: { value: string; isPositive: boolean };
    admissions: { value: string; isPositive: boolean };
    occupancy: { value: string; isPositive: boolean };
    revenue: { value: string; isPositive: boolean };
  };
}

export const analyticsService = {
  async getDashboardKPIs(): Promise<DashboardKPIs> {
    await new Promise(resolve => setTimeout(resolve, 150));
    return {
      totalPatients: 1248,
      todayAppointments: 186,
      admissions: 42,
      bedOccupancyRate: 78,
      todayRevenueINR: 842000,
      trends: {
        patients: { value: '+12.4% vs last week', isPositive: true },
        appointments: { value: '+8.1% vs yesterday', isPositive: true },
        admissions: { value: '-3.2% vs last week', isPositive: false },
        occupancy: { value: '+4.5% vs avg capacity', isPositive: true },
        revenue: { value: '+14.8% vs target', isPositive: true },
      }
    };
  },

  async getPatientFlowData(timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' = 'Weekly') {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (timeframe === 'Daily') {
      return [
        { time: '08:00', opd: 14, emergency: 4, ipd: 2 },
        { time: '10:00', opd: 38, emergency: 9, ipd: 6 },
        { time: '12:00', opd: 52, emergency: 12, ipd: 11 },
        { time: '14:00', opd: 41, emergency: 8, ipd: 7 },
        { time: '16:00', opd: 33, emergency: 6, ipd: 5 },
        { time: '18:00', opd: 24, emergency: 10, ipd: 4 },
        { time: '20:00', opd: 12, emergency: 8, ipd: 3 },
      ];
    }
    if (timeframe === 'Monthly') {
      return [
        { name: 'Week 1', opd: 380, emergency: 92, ipd: 64 },
        { name: 'Week 2', opd: 410, emergency: 104, ipd: 78 },
        { name: 'Week 3', opd: 440, emergency: 112, ipd: 82 },
        { name: 'Week 4', opd: 490, emergency: 120, ipd: 91 },
      ];
    }
    // Default Weekly
    return [
      { name: 'Mon', opd: 145, emergency: 28, ipd: 18 },
      { name: 'Tue', opd: 162, emergency: 32, ipd: 22 },
      { name: 'Wed', opd: 178, emergency: 26, ipd: 20 },
      { name: 'Thu', opd: 154, emergency: 30, ipd: 19 },
      { name: 'Fri', opd: 190, emergency: 35, ipd: 25 },
      { name: 'Sat', opd: 210, emergency: 42, ipd: 28 },
      { name: 'Sun', opd: 95, emergency: 48, ipd: 15 },
    ];
  },

  async getRevenueData(timeframe: 'Daily' | 'Weekly' | 'Monthly' | 'Yearly' = 'Weekly') {
    await new Promise(resolve => setTimeout(resolve, 100));
    if (timeframe === 'Monthly') {
      return [
        { name: 'May', opd: 12.4, ipd: 28.5, pharmacy: 9.8, lab: 7.2 },
        { name: 'Jun', opd: 14.1, ipd: 31.2, pharmacy: 10.4, lab: 8.1 },
        { name: 'Jul', opd: 15.8, ipd: 33.9, pharmacy: 11.2, lab: 9.0 },
        { name: 'Aug', opd: 16.5, ipd: 35.1, pharmacy: 12.0, lab: 9.6 },
        { name: 'Sep', opd: 18.2, ipd: 38.4, pharmacy: 13.5, lab: 10.8 },
      ];
    }
    // Default Weekly (in Lakhs INR)
    return [
      { name: 'Mon', revenue: 7.8, target: 7.0 },
      { name: 'Tue', revenue: 8.2, target: 7.0 },
      { name: 'Wed', revenue: 9.1, target: 7.5 },
      { name: 'Thu', revenue: 8.0, target: 7.5 },
      { name: 'Fri', revenue: 9.6, target: 8.0 },
      { name: 'Sat', revenue: 10.4, target: 8.5 },
      { name: 'Sun', revenue: 5.2, target: 5.0 },
    ];
  },

  async getBedOccupancyBreakdown() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      { category: 'ICU', total: 40, occupied: 34, available: 4, cleaning: 2, rate: 85 },
      { category: 'General', total: 120, occupied: 94, available: 20, cleaning: 6, rate: 78 },
      { category: 'Private', total: 60, occupied: 44, available: 12, cleaning: 4, rate: 73 },
      { category: 'Emergency', total: 30, occupied: 23, available: 6, cleaning: 1, rate: 76 },
    ];
  },

  async getDepartmentPerformance() {
    await new Promise(resolve => setTimeout(resolve, 100));
    return [
      { department: 'Cardiology', patients: 342, revenueLakhs: 28.4, avgWaitMins: 14 },
      { department: 'Neurology', patients: 218, revenueLakhs: 22.1, avgWaitMins: 18 },
      { department: 'Orthopedics', patients: 280, revenueLakhs: 19.5, avgWaitMins: 12 },
      { department: 'General Medicine', patients: 450, revenueLakhs: 14.2, avgWaitMins: 9 },
      { department: 'Pediatrics', patients: 195, revenueLakhs: 8.6, avgWaitMins: 11 },
      { department: 'Oncology', patients: 160, revenueLakhs: 31.8, avgWaitMins: 16 },
    ];
  }
};
