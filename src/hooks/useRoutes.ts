import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routeService } from '@/services/routeService';
import { queryKeys } from '@/utils/queryKeys';

export function useTruckOptimisations(vehicleId?: string) {
  return useQuery({
    queryKey: vehicleId ? [...queryKeys.routes.all, 'truck', vehicleId] : [...queryKeys.routes.all, 'list'],
    queryFn: () => routeService.getTruckOptimisations(vehicleId),
  });
}

export function useRouteMetrics() {
  return useQuery({
    queryKey: [...queryKeys.routes.all, 'metrics'],
    queryFn: () => routeService.getGlobalMetrics(),
  });
}

export function useDispatchReturnLoad() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, opportunityId }: { vehicleId: string; opportunityId: string }) =>
      routeService.dispatchReturnLoad(vehicleId, opportunityId),
    onSuccess: () => {
      // Invalidate all route queries to refresh P&L stats
      queryClient.invalidateQueries({ queryKey: queryKeys.routes.all });
    },
  });
}
