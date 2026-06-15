import { useQuery } from '@tanstack/react-query';
import { financeService } from '@/services/financeService';
import { queryKeys } from '@/utils/queryKeys';

export function useFinanceSummary() {
  return useQuery({
    queryKey: queryKeys.finance.list({ scope: 'summary' }),
    queryFn: () => financeService.getSummary(),
  });
}

export function useRevenueEntries() {
  return useQuery({
    queryKey: queryKeys.finance.list({ scope: 'revenue' }),
    queryFn: () => financeService.getRevenueEntries(),
  });
}

export function useExpenseEntries() {
  return useQuery({
    queryKey: queryKeys.finance.list({ scope: 'expenses' }),
    queryFn: () => financeService.getExpenseEntries(),
  });
}

export function useProfitSummaries() {
  return useQuery({
    queryKey: queryKeys.finance.list({ scope: 'profit-summaries' }),
    queryFn: () => financeService.getProfitSummaries(),
  });
}
