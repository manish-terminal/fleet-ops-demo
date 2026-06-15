export const STATUS_COLORS = {
  // Vehicle status
  in_transit:  { bg: 'bg-blue-500/10',   text: 'text-blue-400 border-blue-500/20',   dot: 'bg-blue-500'   },
  idle:        { bg: 'bg-amber-500/10',  text: 'text-amber-400 border-amber-500/20',  dot: 'bg-amber-500'  },
  maintenance: { bg: 'bg-red-500/10',    text: 'text-red-400 border-red-500/20',    dot: 'bg-red-500'    },
  offline:     { bg: 'bg-slate-500/10',   text: 'text-slate-400 border-slate-500/20',   dot: 'bg-slate-400'   },

  // Booking status
  draft:       { bg: 'bg-slate-500/10',   text: 'text-slate-300 border-slate-500/20',   dot: 'bg-slate-400'   },
  confirmed:   { bg: 'bg-emerald-500/10',  text: 'text-emerald-400 border-emerald-500/20',  dot: 'bg-emerald-500'  },
  in_progress: { bg: 'bg-blue-500/10',   text: 'text-blue-400 border-blue-500/20',   dot: 'bg-blue-500'   },
  completed:   { bg: 'bg-teal-500/10',   text: 'text-teal-400 border-teal-500/20',   dot: 'bg-teal-500'   },
  cancelled:   { bg: 'bg-red-500/10',    text: 'text-red-400 border-red-500/20',    dot: 'bg-red-400'    },

  // Compliance status
  valid:       { bg: 'bg-emerald-500/10',  text: 'text-emerald-400 border-emerald-500/20',  dot: 'bg-emerald-500'  },
  expiring:    { bg: 'bg-amber-500/10',  text: 'text-amber-400 border-amber-500/20',  dot: 'bg-amber-500'  },
  expired:     { bg: 'bg-red-500/10',    text: 'text-red-400 border-red-500/20',    dot: 'bg-red-500'    },

  // Alert severity
  low:         { bg: 'bg-blue-500/5',    text: 'text-blue-400 border-blue-500/10',   dot: 'bg-blue-400'   },
  medium:      { bg: 'bg-amber-500/5',   text: 'text-amber-400 border-amber-500/10',  dot: 'bg-amber-400'  },
  high:        { bg: 'bg-orange-500/5',  text: 'text-orange-400 border-orange-500/10', dot: 'bg-orange-500' },
  critical:    { bg: 'bg-red-500/5',     text: 'text-red-400 border-red-500/10',    dot: 'bg-red-600'    },
} as const;

export const BOOKING_TRANSITIONS = {
  draft:       ['confirmed', 'cancelled'],
  confirmed:   ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed:   [],
  cancelled:   [],
} as const;

export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'office_staff',
  DRIVER: 'driver',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 10,
} as const;
