import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { queryKeys } from '@/utils/queryKeys';

export function useVehicleLocations() {
  return useQuery({
    queryKey:       queryKeys.vehicles.locations(),
    queryFn:        () => vehicleService.getLiveLocations(),
    select:         (data) => data.data,
    refetchInterval: 5000, // poll every 5 seconds
  });
}
export default useVehicleLocations;
