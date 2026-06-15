export const queryKeys = {
  vehicles: {
    all:    ['vehicles'] as const,
    list:   (params: object) => ['vehicles', 'list', params] as const,
    detail: (id: string)     => ['vehicles', 'detail', id] as const,
    locations: ()            => ['vehicles', 'locations'] as const,
  },
  bookings: {
    all:    ['bookings'] as const,
    list:   (params: object) => ['bookings', 'list', params] as const,
    detail: (id: string)     => ['bookings', 'detail', id] as const,
  },
  fuel: {
    all:    ['fuel'] as const,
    truck:  (id: string)     => ['fuel', id] as const,
    alerts: ()               => ['fuel', 'alerts'] as const,
  },
  compliance: {
    all:    ['compliance'] as const,
    list:   (params: object) => ['compliance', 'list', params] as const,
  },
  finance: {
    all:    ['finance'] as const,
    list:   (params: object) => ['finance', 'list', params] as const,
  },
  analytics: {
    all:    ['analytics'] as const,
    period: (period: string) => ['analytics', period] as const,
  },
  routes: {
    all:    ['routes'] as const,
  },
  maintenance: {
    all:    ['maintenance'] as const,
    truck:  (id: string)     => ['maintenance', id] as const,
  },
  drivers: {
    all:    ['drivers'] as const,
  },
  notifications: {
    all:    ['notifications'] as const,
  },
  users: {
    all:    ['users'] as const,
  }
} as const;
