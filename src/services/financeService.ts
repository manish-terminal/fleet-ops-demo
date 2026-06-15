import type { RevenueEntry, ExpenseEntry, ProfitSummary } from '@/types/finance';
import type { ApiResponse } from '@/types/api';
import { mockRevenueEntries, mockExpenseEntries, mockProfitSummaries } from '@/mocks/finance';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

interface FinanceSummary {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  margin: number;
}

interface IFinanceService {
  getSummary(): Promise<ApiResponse<FinanceSummary>>;
  getRevenueEntries(): Promise<ApiResponse<RevenueEntry[]>>;
  getExpenseEntries(): Promise<ApiResponse<ExpenseEntry[]>>;
  getProfitSummaries(): Promise<ApiResponse<ProfitSummary[]>>;
}

const mockFinanceService: IFinanceService = {
  async getSummary() {
    await simulateDelay();
    await simulateError(0.01);

    const totalRevenue = mockRevenueEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpenses = mockExpenseEntries.reduce((sum, entry) => sum + entry.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const margin = totalRevenue > 0 ? Math.round((profit / totalRevenue) * 1000) / 10 : 0;

    return {
      data: { totalRevenue, totalExpenses, profit, margin },
      message: 'OK',
      success: true
    };
  },

  async getRevenueEntries() {
    await simulateDelay();
    // Sort by recordedAt desc
    const sorted = [...mockRevenueEntries].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return { data: sorted, message: 'OK', success: true };
  },

  async getExpenseEntries() {
    await simulateDelay();
    // Sort by recordedAt desc
    const sorted = [...mockExpenseEntries].sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
    return { data: sorted, message: 'OK', success: true };
  },

  async getProfitSummaries() {
    await simulateDelay();
    return { data: mockProfitSummaries, message: 'OK', success: true };
  }
};

const realFinanceService: IFinanceService = {
  getSummary:         () => http.get('/finance/summary'),
  getRevenueEntries:  () => http.get('/finance/revenue'),
  getExpenseEntries:  () => http.get('/finance/expenses'),
  getProfitSummaries: () => http.get('/finance/profits'),
};

export const financeService: IFinanceService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realFinanceService
    : mockFinanceService;

export default financeService;
