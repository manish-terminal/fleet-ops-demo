import type { AnalyticsData } from '@/types/analytics';
import type { ApiResponse } from '@/types/api';
import { mockAnalyticsData } from '@/mocks/analytics';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

interface IAnalyticsService {
  getSummary(period?: string): Promise<ApiResponse<AnalyticsData>>;
}

const mockAnalyticsService: IAnalyticsService = {
  async getSummary(period) {
    await simulateDelay();
    await simulateError(0.01);
    return { data: mockAnalyticsData, message: 'OK', success: true };
  }
};

const realAnalyticsService: IAnalyticsService = {
  getSummary: (period) => http.get('/analytics/summary', { params: { period } }),
};

export const analyticsService: IAnalyticsService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realAnalyticsService
    : mockAnalyticsService;

export default analyticsService;
