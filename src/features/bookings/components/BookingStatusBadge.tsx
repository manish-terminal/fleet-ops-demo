import React from 'react';
import { Badge } from '@/components/ui/Badge';
import type { BookingStatus } from '@/types/booking';

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return <Badge status={status} />;
}
export default BookingStatusBadge;
