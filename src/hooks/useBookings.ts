import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { queryKeys } from '@/utils/queryKeys';
import type { BookingListParams } from '@/types/booking';

export function useBookings(params: BookingListParams = {}) {
  return useQuery({
    queryKey: queryKeys.bookings.list(params),
    queryFn: () => bookingService.getAll(params),
  });
}
export default useBookings;
