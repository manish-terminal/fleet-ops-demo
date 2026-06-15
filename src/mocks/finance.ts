import type { RevenueEntry, ExpenseEntry, ProfitSummary } from '@/types/finance';
import { mockVehicles } from './vehicles';

const now = new Date();

// Generate revenue entries matching our bookings or general trips
export const mockRevenueEntries: RevenueEntry[] = [
  {
    id: 'rev-001',
    bookingId: 'b-001',
    vehicleId: 'v-001',
    amount: 74400,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: 'rev-002',
    bookingId: 'b-003',
    vehicleId: 'v-004',
    amount: 18750,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'rev-003',
    bookingId: 'BK-20260612-099',
    vehicleId: 'v-006',
    amount: 40500,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8).toISOString(),
  },
  {
    id: 'rev-004',
    bookingId: 'BK-20260610-101',
    vehicleId: 'v-009',
    amount: 62000,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 12).toISOString(),
  },
  {
    id: 'rev-005',
    bookingId: 'BK-20260608-102',
    vehicleId: 'v-010',
    amount: 32000,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(),
  },
  {
    id: 'rev-006',
    bookingId: 'BK-20260605-103',
    vehicleId: 'v-013',
    amount: 51000,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
  },
  {
    id: 'rev-007',
    bookingId: 'BK-20260602-104',
    vehicleId: 'v-014',
    amount: 28500,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 25).toISOString(),
  },
  {
    id: 'rev-008',
    bookingId: 'BK-20260528-105',
    vehicleId: 'v-015',
    amount: 95000,
    currency: 'INR',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  }
];

// Generate operational expenses
export const mockExpenseEntries: ExpenseEntry[] = [
  {
    id: 'exp-001',
    vehicleId: 'v-001',
    category: 'fuel',
    amount: 18500,
    currency: 'INR',
    description: 'Fuel refuel (Tata Prima) - IOCL Pune',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
  {
    id: 'exp-002',
    vehicleId: 'v-001',
    category: 'driver_wage',
    amount: 8500,
    currency: 'INR',
    description: 'Driver wage payout for trip BK-20260615-001',
    receiptUrl: null,
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'exp-003',
    vehicleId: 'v-001',
    category: 'toll',
    amount: 2400,
    currency: 'INR',
    description: 'Fastag NH AI Toll debits total',
    receiptUrl: null,
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: 'exp-004',
    vehicleId: 'v-004',
    category: 'fuel',
    amount: 4800,
    currency: 'INR',
    description: 'Refuel HPCL Whitefield Bengaluru',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 6).toISOString(),
  },
  {
    id: 'exp-005',
    vehicleId: 'v-004',
    category: 'driver_wage',
    amount: 2100,
    currency: 'INR',
    description: 'Driver wage payout for trip BK-20260614-003',
    receiptUrl: null,
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'exp-006',
    vehicleId: 'v-003',
    category: 'maintenance',
    amount: 32000,
    currency: 'INR',
    description: 'Scheduled Engine service & filters replacement - BharatBenz workshop',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150',
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: 'exp-007',
    vehicleId: 'v-006',
    category: 'insurance',
    amount: 45000,
    currency: 'INR',
    description: 'Annual commercial insurance policy renewal premium',
    receiptUrl: null,
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 'exp-008',
    vehicleId: 'v-009',
    category: 'fuel',
    amount: 11200,
    currency: 'INR',
    description: 'Fuel refuel Mundra port station',
    receiptUrl: null,
    recordedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 13).toISOString(),
  }
];

// Helper to calculate summary per vehicle for 2026-Q2
function generateProfitSummaries(): ProfitSummary[] {
  const summaries: ProfitSummary[] = [];

  mockVehicles.slice(0, 8).forEach((vehicle, idx) => {
    // Determine simulated revenue and expense based on index
    const totalRevenue = 150000 + idx * 45000;
    const totalExpenses = 95000 + idx * 18000;
    const profit = totalRevenue - totalExpenses;
    const margin = Math.round((profit / totalRevenue) * 1000) / 10;

    summaries.push({
      vehicleId: vehicle.id,
      vehiclePlate: vehicle.plateNumber,
      period: '2026-Q2',
      totalRevenue,
      totalExpenses,
      profit,
      margin,
    });
  });

  return summaries;
}

export const mockProfitSummaries = generateProfitSummaries();
