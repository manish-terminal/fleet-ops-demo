import type { AnalyticsData } from '@/types/analytics';
import { mockVehicles } from './vehicles';

const getPlate = (vId: string) => mockVehicles.find(v => v.id === vId)?.plateNumber || vId;

export const mockAnalyticsData: AnalyticsData = {
  kpis: [
    { label: 'Active Fleet Utilisation', value: '85%', change: 2.4, trend: 'up' },
    { label: 'Total Invoiced Revenue', value: '₹7,44,000', change: 8.7, trend: 'up', unit: 'INR' },
    { label: 'Avg Fuel Efficiency', value: '33.2 L/100km', change: -1.8, trend: 'down' }, // Down is good for fuel!
    { label: 'On-Time Dispatch Rate', value: '96.5%', change: 0.5, trend: 'up' },
  ],
  bookingTrend: [
    { date: '2026-06-01', bookings: 8 },
    { date: '2026-06-02', bookings: 11 },
    { date: '2026-06-03', bookings: 9 },
    { date: '2026-06-04', bookings: 12 },
    { date: '2026-06-05', bookings: 15 },
    { date: '2026-06-06', bookings: 7 },
    { date: '2026-06-07', bookings: 5 },
    { date: '2026-06-08', bookings: 10 },
    { date: '2026-06-09', bookings: 14 },
    { date: '2026-06-10', bookings: 13 },
    { date: '2026-06-11', bookings: 16 },
    { date: '2026-06-12', bookings: 18 },
    { date: '2026-06-13', bookings: 11 },
    { date: '2026-06-14', bookings: 8 },
    { date: '2026-06-15', bookings: 12 },
  ],
  financialTrend: [
    { month: 'Jan', revenue: 450000, expenses: 320000 },
    { month: 'Feb', revenue: 520000, expenses: 380000 },
    { month: 'Mar', revenue: 610000, expenses: 440000 },
    { month: 'Apr', revenue: 580000, expenses: 410000 },
    { month: 'May', revenue: 690000, expenses: 480000 },
    { month: 'Jun', revenue: 744000, expenses: 512000 },
  ],
  fuelEfficiency: [
    { plateNumber: getPlate('v-001'), efficiency: 32.5 },
    { plateNumber: getPlate('v-002'), efficiency: 30.8 },
    { plateNumber: getPlate('v-004'), efficiency: 34.2 },
    { plateNumber: getPlate('v-006'), efficiency: 31.0 },
    { plateNumber: getPlate('v-009'), efficiency: 29.5 },
    { plateNumber: getPlate('v-010'), efficiency: 33.8 },
    { plateNumber: getPlate('v-013'), efficiency: 36.5 },
    { plateNumber: getPlate('v-014'), efficiency: 32.0 },
    { plateNumber: getPlate('v-015'), efficiency: 31.2 },
    { plateNumber: getPlate('v-018'), efficiency: 35.0 },
  ],
  routePerformance: [
    { route: 'Mumbai - Delhi', revenue: 245000, expenses: 168000, profitability: 31.4, delays: 45 },
    { route: 'Pune - Ahmedabad', revenue: 185000, expenses: 122000, profitability: 34.0, delays: 25 },
    { route: 'Bengaluru - Chennai', revenue: 112000, expenses: 78000, profitability: 30.3, delays: 15 },
    { route: 'Delhi - Jaipur', revenue: 95000, expenses: 58000, profitability: 38.9, delays: 30 },
  ],
  successRate: [
    { name: 'Completed', value: 92 },
    { name: 'In Transit', value: 5 },
    { name: 'Cancelled', value: 3 },
  ],
  utilisation: [
    { name: 'Active (In Transit)', value: 60, fill: '#3B82F6' },
    { name: 'Idle (Standby)', value: 25, fill: '#F59E0B' },
    { name: 'Maintenance', value: 10, fill: '#EF4444' },
    { name: 'Offline', value: 5, fill: '#94A3B8' },
  ],
};

export default mockAnalyticsData;
