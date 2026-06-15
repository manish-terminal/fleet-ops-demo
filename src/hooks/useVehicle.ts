import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { queryKeys } from '@/utils/queryKeys';

export function useVehicle(id: string) {
  return useQuery({
    queryKey: queryKeys.vehicles.detail(id),
    queryFn: () => vehicleService.getById(id),
    enabled: !!id,
  });
}
export default useVehicle;
