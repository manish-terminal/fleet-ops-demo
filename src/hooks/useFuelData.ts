import { useQuery } from '@tanstack/react-query';
import { fuelService } from '@/services/fuelService';
import { queryKeys } from '@/utils/queryKeys';

export function useFuelReadings(vehicleId?: string) {
  return useQuery({
    queryKey: vehicleId ? queryKeys.fuel.truck(vehicleId) : queryKeys.fuel.all,
    queryFn: () => fuelService.getReadings(vehicleId),
  });
}

export function useFuelAlerts(vehicleId?: string) {
  return useQuery({
    queryKey: queryKeys.fuel.alerts(),
    queryFn: () => fuelService.getAlerts(vehicleId),
    refetchInterval: 10000, // Poll alerts every 10 seconds for anomalies
  });
}

export function useFuelTrends(vehicleId?: string) {
  return useQuery({
    queryKey: ['fuel', 'trends', vehicleId || 'all'],
    queryFn: () => fuelService.getTrends(vehicleId),
  });
}
