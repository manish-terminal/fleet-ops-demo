import React from 'react';
import type { LicenceStatus } from '@/types/compliance';

interface LicenceBadgeProps {
  status: LicenceStatus;
}

export function LicenceBadge({ status }: LicenceBadgeProps) {
  const styles: Record<LicenceStatus, string> = {
    valid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/15',
    expiring: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/15',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/15',
  };

  const labels: Record<LicenceStatus, string> = {
    valid: 'Valid',
    expiring: 'Expiring Soon',
    expired: 'Expired',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-200 uppercase tracking-wider select-none ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
export default LicenceBadge;
