import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analyticsService';
import { queryKeys } from '@/utils/queryKeys';

export function useAnalytics(period?: string) {
  return useQuery({
    queryKey: queryKeys.analytics.period(period || 'all'),
    queryFn: () => analyticsService.getSummary(period),
  });
}
export default useAnalytics;
