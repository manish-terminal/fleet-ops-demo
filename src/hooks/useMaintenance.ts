import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceService } from '@/services/maintenanceService';
import { queryKeys } from '@/utils/queryKeys';

export function useEngineHealth(vehicleId?: string) {
  return useQuery({
    queryKey: vehicleId ? queryKeys.maintenance.truck(vehicleId) : queryKeys.maintenance.all,
    queryFn: () => maintenanceService.getEngineHealth(vehicleId),
  });
}

export function useMaintenanceAlerts(vehicleId?: string) {
  return useQuery({
    queryKey: ['maintenance', 'alerts', vehicleId || 'all'],
    queryFn: () => maintenanceService.getAlerts(vehicleId),
  });
}

export function useServiceLogs(vehicleId?: string) {
  return useQuery({
    queryKey: ['maintenance', 'logs', vehicleId || 'all'],
    queryFn: () => maintenanceService.getServiceLogs(vehicleId),
  });
}

export function usePerformService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, alertId }: { vehicleId: string; alertId: string }) =>
      maintenanceService.performService(vehicleId, alertId),
    onSuccess: () => {
      // Invalidate all maintenance and vehicle queries to refresh vitals
      queryClient.invalidateQueries({ queryKey: queryKeys.maintenance.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.vehicles.all });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'alerts'] });
      queryClient.invalidateQueries({ queryKey: ['maintenance', 'logs'] });
    },
  });
}
