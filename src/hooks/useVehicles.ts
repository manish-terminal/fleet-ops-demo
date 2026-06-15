import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { queryKeys } from '@/utils/queryKeys';
import type { VehicleListParams } from '@/types/vehicle';

export function useVehicles(params: VehicleListParams = {}) {
  return useQuery({
    queryKey: queryKeys.vehicles.list(params),
    queryFn: () => vehicleService.getAll(params),
  });
}
export default useVehicles;
