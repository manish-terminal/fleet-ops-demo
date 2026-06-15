import React from 'react';
import { Badge } from '@/components/ui/Badge';
import type { VehicleStatus } from '@/types/vehicle';

export function TruckStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge status={status} />;
}
export default TruckStatusBadge;
