import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '@/services/bookingService';
import { queryKeys } from '@/utils/queryKeys';
import type { BookingStatus } from '@/types/booking';

export function useBooking(id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: queryKeys.bookings.detail(id || ''),
    queryFn: () => bookingService.getById(id || ''),
    enabled: !!id,
  });

  const createMutation = useMutation({
    mutationFn: bookingService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ status }: { status: BookingStatus }) => {
      if (!id) throw new Error('Booking ID is required for status updates');
      return bookingService.updateStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      if (id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.bookings.detail(id) });
      }
    },
  });

  return {
    booking: query.data?.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    createBooking: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateStatus: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,
  };
}
export default useBooking;
