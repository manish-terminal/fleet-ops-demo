import { cn } from '@/utils/cn';
import { STATUS_COLORS } from '@/utils/constants';

type StatusKey = keyof typeof STATUS_COLORS;

export interface BadgeProps {
  status:    StatusKey;
  label?:    string;    // Override auto-label
  withDot?:  boolean;
  className?: string;
}

const AUTO_LABELS: Record<string, string> = {
  in_transit:  'In Transit',
  idle:        'Idle',
  maintenance: 'Maintenance',
  offline:     'Offline',
  draft:       'Draft',
  confirmed:   'Confirmed',
  in_progress: 'In Progress',
  completed:   'Completed',
  cancelled:   'Cancelled',
  valid:       'Valid',
  expiring:    'Expiring Soon',
  expired:     'Expired',
};

export function Badge({ status, label, withDot = true, className }: BadgeProps) {
  const colors = STATUS_COLORS[status];
  if (!colors) return null;
  const text   = label ?? AUTO_LABELS[status] ?? status;

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border',
        colors.bg,
        colors.text,
        className
      )}
    >
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />}
      <span>{text}</span>
    </span>
  );
}
export default Badge;
