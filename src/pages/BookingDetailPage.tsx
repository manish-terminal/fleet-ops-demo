import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useBooking } from '@/hooks/useBooking';
import { BookingDetail } from '@/features/bookings/components/BookingDetail';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArrowLeft } from 'lucide-react';

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { booking, isLoading, error, refetch } = useBooking(id);

  if (error) {
    return (
      <PageWrapper title="Booking Details">
        <ErrorState message={(error as any).message || 'Failed to load booking details'} onRetry={refetch} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isLoading ? 'Loading Booking...' : `Booking: ${booking?.bookingNumber}`}
      description="View booking status history, customer, route, and financial details."
      actions={
        <Button variant="secondary" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate('/bookings')}>
          Back to Bookings
        </Button>
      }
    >
      {isLoading || !booking ? (
        <div className="space-y-6">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton.Card />
            <Skeleton.Card />
          </div>
        </div>
      ) : (
        <BookingDetail booking={booking} onStatusChanged={refetch} />
      )}
    </PageWrapper>
  );
}
export default BookingDetailPage;
