# FleetOps Pro — Frontend Implementation Plan

> **Document type:** Engineering Implementation Plan  
> **Audience:** Junior → Mid Frontend Developers  
> **Stack:** React 18 · TypeScript 5 · Vite · Zustand · React Query · Tailwind CSS  
> **Status:** Active — updated as decisions are made

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Rationale](#2-tech-stack--rationale)
3. [Repository Setup](#3-repository-setup)
4. [Folder Structure](#4-folder-structure)
5. [Architecture Decision Records](#5-architecture-decision-records)
6. [Design System](#6-design-system)
7. [Type Definitions](#7-type-definitions)
8. [Mock Data Layer](#8-mock-data-layer)
9. [Service Layer](#9-service-layer)
10. [State Management](#10-state-management)
11. [Routing](#11-routing)
12. [Feature Implementation Plans](#12-feature-implementation-plans)
    - [12.1 Authentication](#121-authentication)
    - [12.2 Fleet Dashboard](#122-fleet-dashboard)
    - [12.3 Booking Management](#123-booking-management)
    - [12.4 Fuel Monitoring](#124-fuel-monitoring)
    - [12.5 Compliance & Licence Portal](#125-compliance--licence-portal)
    - [12.6 Financial Tracking](#126-financial-tracking)
    - [12.7 Analytics & Reporting](#127-analytics--reporting)
    - [12.8 Route Optimisation](#128-route-optimisation)
    - [12.9 Predictive Maintenance](#129-predictive-maintenance)
    - [12.10 Driver Mobile App](#1210-driver-mobile-app)
    - [12.11 Notifications & Alerts](#1211-notifications--alerts)
    - [12.12 Admin Controls](#1212-admin-controls)
13. [Shared UI Components](#13-shared-ui-components)
14. [Hooks Reference](#14-hooks-reference)
15. [Testing Strategy](#15-testing-strategy)
16. [Performance Plan](#16-performance-plan)
17. [Backend Integration Strategy](#17-backend-integration-strategy)
18. [Deployment Pipeline](#18-deployment-pipeline)
19. [Implementation Phases & Timeline](#19-implementation-phases--timeline)
20. [Contributor Checklist](#20-contributor-checklist)

---

## 1. Project Overview

**FleetOps Pro** is an enterprise fleet management platform for logistics companies. It gives dispatchers, managers, drivers, and finance teams a unified interface to manage their truck operations end-to-end.

### Modules

| # | Module | Core Job |
|---|--------|----------|
| 1 | Authentication & RBAC | Secure login; role-based dashboard routing |
| 2 | Fleet Dashboard | Live GPS map, truck status, real-time tracking |
| 3 | Booking Management | Create/dispatch/complete delivery bookings |
| 4 | Fuel Monitoring | Per-truck fuel data, efficiency trends, anomaly alerts |
| 5 | Compliance & Licences | Vehicle inspection due dates, renewal reminders |
| 6 | Financial Tracking | Revenue, expenses, per-truck P&L |
| 7 | Analytics & Reporting | KPIs, trend charts, exportable reports |
| 8 | Route Optimisation | AI-suggested routes, traffic awareness |
| 9 | Predictive Maintenance | Engine health, service history, maintenance alerts |
| 10 | Driver Mobile App | Driver-facing view: assignments, logs, issue reports |
| 11 | Notifications | Alert centre for all modules |
| 12 | Admin Controls | User management, global settings |

### Design Principles

- **Decoupled data layer** — UI components never call `fetch()` directly
- **Type-first** — TypeScript interfaces are written before components
- **Mock-first** — mock services are indistinguishable in interface from real API services
- **Three-state rule** — every data view handles loading, error, and empty states
- **Role-aware** — every screen checks permissions before rendering

---

## 2. Tech Stack & Rationale

| Layer | Library | Version | Why |
|-------|---------|---------|-----|
| Framework | React | 18.x | Industry standard; concurrent features for smooth UX |
| Language | TypeScript | 5.x | Catches interface mismatches at compile time |
| Bundler | Vite | 5.x | Sub-second HMR; native ESM; fast CI builds |
| Routing | React Router | 6.x | File-friendly nested routes; typed params |
| Server State | TanStack Query | 5.x | Caching, background refetch, loading/error out of the box |
| Global State | Zustand | 4.x | Minimal boilerplate; no context hell; easy to test |
| Styling | Tailwind CSS | 3.x | Utility-first; design token config; no CSS file sprawl |
| Components | shadcn/ui | latest | Accessible, unstyled base; we own the code |
| Charts | Recharts | 2.x | Composable; works with Tailwind; good TypeScript types |
| Maps | Leaflet + React-Leaflet | 4.x | Open-source; no API key in dev; swap to Google Maps in prod |
| Forms | React Hook Form + Zod | 7.x / 3.x | Performance-first forms; schema-driven validation |
| Date utilities | date-fns | 3.x | Modular; tree-shakeable; no Moment.js weight |
| HTTP client | Axios | 1.x | Interceptors for auth headers and error normalisation |
| Testing | Vitest + React Testing Library | latest | Fast; Vite-native; same config as app |
| E2E | Playwright | latest | Cross-browser; reliable; runs in CI |
| Linting | ESLint + Prettier | latest | Consistent code style enforced automatically |

---

## 3. Repository Setup

### 3.1 Initialise the Project

```bash
# Create Vite project with React + TypeScript template
npm create vite@latest fleetops-pro -- --template react-ts
cd fleetops-pro

# Install all dependencies
npm install \
  react-router-dom \
  @tanstack/react-query \
  @tanstack/react-query-devtools \
  zustand \
  axios \
  react-hook-form \
  @hookform/resolvers \
  zod \
  recharts \
  leaflet \
  react-leaflet \
  date-fns \
  clsx \
  tailwind-merge \
  lucide-react \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-select \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer \
  @types/leaflet \
  @types/react \
  @types/react-dom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest \
  @vitejs/plugin-react \
  eslint \
  prettier \
  eslint-config-prettier \
  eslint-plugin-react-hooks \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  playwright

# Initialise Tailwind
npx tailwindcss init -p
```

### 3.2 Environment Variables

```bash
# .env.example  — commit this file
VITE_API_BASE_URL=
VITE_ENABLE_REAL_API=false
VITE_MOCK_DELAY_MS=600
VITE_MAP_PROVIDER=openstreetmap
VITE_GOOGLE_MAPS_KEY=
VITE_SENTRY_DSN=
```

```bash
# .env.local  — DO NOT commit; already in .gitignore
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_ENABLE_REAL_API=false
VITE_MOCK_DELAY_MS=600
VITE_MAP_PROVIDER=openstreetmap
```

### 3.3 tsconfig.json Path Aliases

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@features/*": ["./src/features/*"],
      "@services/*": ["./src/services/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"],
      "@mocks/*": ["./src/mocks/*"],
      "@store/*": ["./src/store/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
```

### 3.4 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@mocks': path.resolve(__dirname, './src/mocks'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  }
});
```

### 3.5 tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A5F',
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          danger:  '#DC2626',
          info:    '#0284C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      }
    }
  },
  plugins: []
} satisfies Config;
```

---

## 4. Folder Structure

```
src/
├── assets/
│   ├── fonts/
│   ├── icons/
│   └── images/
│
├── components/                    # Shared, domain-agnostic UI
│   ├── ui/
│   │   ├── Badge/
│   │   │   ├── Badge.tsx
│   │   │   ├── Badge.test.tsx
│   │   │   └── index.ts
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── DataTable/
│   │   ├── EmptyState/
│   │   ├── ErrorState/
│   │   ├── Form/
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Textarea.tsx
│   │   │   ├── FormField.tsx      # label + input + error wrapper
│   │   │   └── index.ts
│   │   ├── Modal/
│   │   ├── Skeleton/
│   │   ├── Spinner/
│   │   ├── Stat/                  # KPI number card
│   │   └── Toast/
│   ├── charts/
│   │   ├── AreaChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   └── PieChart.tsx
│   ├── feedback/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── LoadingOverlay.tsx
│   └── navigation/
│       ├── Breadcrumb.tsx
│       ├── Pagination.tsx
│       └── Tabs.tsx
│
├── features/                      # Vertical feature slices
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RoleGuard.tsx
│   │   └── index.ts
│   ├── fleet/
│   │   ├── components/
│   │   │   ├── FleetMap.tsx
│   │   │   ├── TruckCard.tsx
│   │   │   ├── TruckCardSkeleton.tsx
│   │   │   ├── TruckMarker.tsx
│   │   │   └── TruckStatusBadge.tsx
│   │   └── index.ts
│   ├── bookings/
│   │   ├── components/
│   │   │   ├── BookingForm.tsx
│   │   │   ├── BookingList.tsx
│   │   │   ├── BookingStatusBadge.tsx
│   │   │   ├── BookingDetail.tsx
│   │   │   └── CostCalculator.tsx
│   │   └── index.ts
│   ├── fuel/
│   │   ├── components/
│   │   │   ├── FuelGauge.tsx
│   │   │   ├── FuelTrendChart.tsx
│   │   │   ├── FuelAlertBanner.tsx
│   │   │   └── FuelTable.tsx
│   │   └── index.ts
│   ├── compliance/
│   │   ├── components/
│   │   │   ├── ComplianceTable.tsx
│   │   │   ├── LicenceBadge.tsx
│   │   │   └── RenewalAlert.tsx
│   │   └── index.ts
│   ├── finance/
│   │   ├── components/
│   │   │   ├── RevenueTable.tsx
│   │   │   ├── ExpenseLog.tsx
│   │   │   ├── ProfitSummaryCard.tsx
│   │   │   └── FinancialSummary.tsx
│   │   └── index.ts
│   ├── analytics/
│   │   ├── components/
│   │   │   ├── KpiGrid.tsx
│   │   │   ├── BookingTrendChart.tsx
│   │   │   ├── FuelEfficiencyChart.tsx
│   │   │   └── RoutePerformanceTable.tsx
│   │   └── index.ts
│   ├── routes/
│   │   ├── components/
│   │   │   ├── RouteMap.tsx
│   │   │   ├── RouteForm.tsx
│   │   │   └── RouteSuggestionCard.tsx
│   │   └── index.ts
│   ├── maintenance/
│   │   ├── components/
│   │   │   ├── EngineHealthCard.tsx
│   │   │   ├── MaintenanceAlertList.tsx
│   │   │   └── ServiceLogTable.tsx
│   │   └── index.ts
│   ├── drivers/
│   │   ├── components/
│   │   │   ├── DriverCard.tsx
│   │   │   ├── ActivityLog.tsx
│   │   │   ├── IssueReportForm.tsx
│   │   │   └── AssignmentCard.tsx
│   │   └── index.ts
│   ├── notifications/
│   │   ├── components/
│   │   │   ├── NotificationBell.tsx
│   │   │   └── NotificationList.tsx
│   │   └── index.ts
│   └── admin/
│       ├── components/
│       │   ├── UserTable.tsx
│       │   ├── UserForm.tsx
│       │   └── SystemSettings.tsx
│       └── index.ts
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePermission.ts
│   ├── useVehicles.ts
│   ├── useVehicle.ts
│   ├── useVehicleLocations.ts
│   ├── useBookings.ts
│   ├── useBooking.ts
│   ├── useFuelData.ts
│   ├── useCompliance.ts
│   ├── useFinance.ts
│   ├── useAnalytics.ts
│   ├── useRoutes.ts
│   ├── useMaintenance.ts
│   ├── useDrivers.ts
│   ├── useNotifications.ts
│   ├── useUsers.ts
│   ├── useDebounce.ts
│   ├── usePagination.ts
│   └── useToast.ts
│
├── layouts/
│   ├── AppLayout.tsx              # Sidebar + Header + main content area
│   ├── AuthLayout.tsx             # Centred card for login/forgot-password
│   ├── DriverLayout.tsx           # Simplified mobile layout for drivers
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── PageWrapper.tsx            # Page title + breadcrumb + children
│
├── mocks/
│   ├── vehicles.ts
│   ├── bookings.ts
│   ├── fuelReadings.ts
│   ├── complianceRecords.ts
│   ├── financeEntries.ts
│   ├── routes.ts
│   ├── maintenanceLogs.ts
│   ├── drivers.ts
│   ├── notifications.ts
│   └── users.ts
│
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── FleetPage.tsx
│   ├── BookingsPage.tsx
│   ├── BookingDetailPage.tsx
│   ├── FuelPage.tsx
│   ├── CompliancePage.tsx
│   ├── FinancePage.tsx
│   ├── AnalyticsPage.tsx
│   ├── RoutesPage.tsx
│   ├── MaintenancePage.tsx
│   ├── DriverAppPage.tsx
│   ├── NotificationsPage.tsx
│   ├── AdminPage.tsx
│   ├── NotFoundPage.tsx
│   └── UnauthorizedPage.tsx
│
├── services/
│   ├── http.ts                    # Axios instance + interceptors
│   ├── authService.ts
│   ├── vehicleService.ts
│   ├── bookingService.ts
│   ├── fuelService.ts
│   ├── complianceService.ts
│   ├── financeService.ts
│   ├── analyticsService.ts
│   ├── routeService.ts
│   ├── maintenanceService.ts
│   ├── driverService.ts
│   ├── notificationService.ts
│   └── userService.ts
│
├── store/
│   ├── authStore.ts
│   ├── uiStore.ts
│   ├── notificationStore.ts
│   └── index.ts
│
├── types/
│   ├── api.ts
│   ├── auth.ts
│   ├── vehicle.ts
│   ├── booking.ts
│   ├── fuel.ts
│   ├── compliance.ts
│   ├── finance.ts
│   ├── analytics.ts
│   ├── route.ts
│   ├── maintenance.ts
│   ├── driver.ts
│   └── notification.ts
│
├── utils/
│   ├── cn.ts                      # clsx + tailwind-merge helper
│   ├── format.ts                  # currency, date, distance formatters
│   ├── mockHelpers.ts             # simulateDelay(), simulateError()
│   ├── validators.ts              # Zod schemas
│   ├── constants.ts               # ROLES, STATUS_COLORS, PAGINATION_DEFAULTS
│   └── mappers/
│       ├── vehicleMapper.ts
│       ├── bookingMapper.ts
│       └── financeMapper.ts
│
├── test/
│   └── setup.ts                   # Testing Library matchers + global mocks
│
├── router.tsx                     # All routes defined here
├── App.tsx                        # QueryClient + Router + Providers
└── main.tsx                       # ReactDOM.createRoot entry point
```

---

## 5. Architecture Decision Records

### ADR-001: Service Layer Pattern

**Decision:** All data fetching is abstracted behind a service function. Components never call `fetch()` or Axios directly.

**Why:** When the backend is ready, replacing `mockVehicleService` with `realVehicleService` requires zero changes to any component. The service interface (function signatures + return types) is the contract.

**Pattern:**

```typescript
// The interface both mock and real must satisfy
interface IVehicleService {
  getAll(params: VehicleListParams): Promise<PaginatedResponse<Vehicle>>;
  getById(id: string): Promise<ApiResponse<Vehicle>>;
  updateStatus(id: string, status: VehicleStatus): Promise<ApiResponse<Vehicle>>;
}

// Mock implementation (used when VITE_ENABLE_REAL_API=false)
const mockVehicleService: IVehicleService = { ... };

// Real implementation (swapped in when backend is ready)
const realVehicleService: IVehicleService = { ... };

// Single export — UI never knows which one it's talking to
export const vehicleService = import.meta.env.VITE_ENABLE_REAL_API === 'true'
  ? realVehicleService
  : mockVehicleService;
```

---

### ADR-002: Server State vs Global State vs Local State

**Decision:** Three strictly separated layers. Never use Zustand for server data. Never use React Query for UI state.

| State Type | Tool | Rule |
|------------|------|------|
| Server State | TanStack Query | Data from API — vehicles, bookings, fuel readings |
| Global UI State | Zustand | Current user session, sidebar open/closed, unread count |
| Local UI State | `useState` | Form values, modal visibility, tab selection |

**Why:** Mixing them causes cache-busting bugs and stale data. React Query handles cache invalidation, background re-fetching, and deduplication automatically — Zustand does not.

---

### ADR-003: Mock Data Realism

**Decision:** Mock datasets must include edge cases, not just happy-path data.

Every mock file must include:
- Records with every possible status value
- Records with `null` optional fields
- A record with an unusually long string (tests truncation)
- A record that would trigger an alert condition
- At least 20 records to test pagination

---

### ADR-004: Component Size Limit

**Decision:** No component file exceeds 200 lines. If it does, split it.

**Common splits:**
- Extract the table into `<FeatureTable />`
- Extract the filter bar into `<FeatureFilters />`
- Extract the empty/error/loading states into separate components
- Extract complex render logic into a custom hook

---

### ADR-005: No Inline Styles

**Decision:** All styling via Tailwind utility classes. No `style={{ }}` props except for truly dynamic values (e.g. a `width` percentage from data).

**Allowed:**
```tsx
<div style={{ width: `${fuelLevel}%` }} />  // dynamic value from data
```

**Not allowed:**
```tsx
<div style={{ color: 'red', marginTop: '16px' }} />  // use Tailwind classes
```

---

## 6. Design System

### 6.1 Color Tokens

```typescript
// src/utils/constants.ts

export const STATUS_COLORS = {
  // Vehicle status
  in_transit:  { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
  idle:        { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
  maintenance: { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500'    },
  offline:     { bg: 'bg-gray-100',   text: 'text-gray-600',   dot: 'bg-gray-400'   },

  // Booking status
  draft:       { bg: 'bg-gray-100',   text: 'text-gray-700',   dot: 'bg-gray-400'   },
  confirmed:   { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  in_progress: { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500'   },
  completed:   { bg: 'bg-teal-100',   text: 'text-teal-800',   dot: 'bg-teal-500'   },
  cancelled:   { bg: 'bg-red-100',    text: 'text-red-700',    dot: 'bg-red-400'    },

  // Compliance status
  valid:       { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500'  },
  expiring:    { bg: 'bg-amber-100',  text: 'text-amber-800',  dot: 'bg-amber-500'  },
  expired:     { bg: 'bg-red-100',    text: 'text-red-800',    dot: 'bg-red-500'    },

  // Alert severity
  low:         { bg: 'bg-blue-50',    text: 'text-blue-700',   dot: 'bg-blue-400'   },
  medium:      { bg: 'bg-amber-50',   text: 'text-amber-700',  dot: 'bg-amber-400'  },
  high:        { bg: 'bg-orange-50',  text: 'text-orange-700', dot: 'bg-orange-500' },
  critical:    { bg: 'bg-red-50',     text: 'text-red-700',    dot: 'bg-red-600'    },
} as const;
```

### 6.2 Typography Scale

```
text-xs    (12px)  — Timestamps, helper text, table footnotes
text-sm    (14px)  — Table cell values, form labels, secondary info
text-base  (16px)  — Body text, descriptions, modal content
text-lg    (18px)  — Card titles, sub-section headings
text-xl    (20px)  — Section headings
text-2xl   (24px)  — Page titles
text-3xl   (30px)  — KPI numbers, hero stats
text-4xl+  (36px+) — Empty state headings, splash numbers
```

### 6.3 Spacing System

All spacing is multiples of 4px via Tailwind's default scale.

```
p-1  (4px)   — Tight inline spacing, icon gaps
p-2  (8px)   — Label-to-input spacing
p-3  (12px)  — Small card padding
p-4  (16px)  — Standard card padding
p-6  (24px)  — Section internal padding
p-8  (32px)  — Major section gaps
p-12 (48px)  — Page-level vertical rhythm
```

### 6.4 cn() Utility

```typescript
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges Tailwind classes safely, resolving conflicts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage:
// cn('px-4 py-2', isActive && 'bg-blue-500', className)
```

---

## 7. Type Definitions

All types live in `src/types/`. Define the type, then implement — never the other way around.

### 7.1 API Wrapper Types

```typescript
// src/types/api.ts

export interface ApiResponse<T> {
  data:    T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data:     T[];
  total:    number;
  page:     number;
  pageSize: number;
}

export interface ApiError {
  code:    string;
  message: string;
  details: Record<string, string[]> | null;
}

export interface ListParams {
  page?:    number;
  limit?:   number;
  search?:  string;
  sortBy?:  string;
  sortDir?: 'asc' | 'desc';
}
```

### 7.2 Auth Types

```typescript
// src/types/auth.ts

export type UserRole = 'admin' | 'manager' | 'office_staff' | 'driver';

export interface User {
  id:          string;
  name:        string;
  email:       string;
  role:        UserRole;
  avatarUrl:   string | null;
  phone:       string | null;
  lastLoginAt: string;        // ISO 8601
  isActive:    boolean;
}

export interface AuthSession {
  user:         User;
  accessToken:  string;
  refreshToken: string;
  expiresAt:    number;       // Unix timestamp ms
}

export interface LoginCredentials {
  email:    string;
  password: string;
}
```

### 7.3 Vehicle Types

```typescript
// src/types/vehicle.ts

export type VehicleStatus = 'in_transit' | 'idle' | 'maintenance' | 'offline';

export interface GeoPoint {
  lat:      number;
  lng:      number;
  heading?: number;   // degrees 0-360
  speed?:   number;   // km/h
}

export interface Vehicle {
  id:              string;
  plateNumber:     string;
  make:            string;
  model:           string;
  year:            number;
  color:           string;
  status:          VehicleStatus;
  currentLocation: GeoPoint | null;
  assignedDriverId: string | null;
  fuelLevel:       number;     // 0-100 %
  mileage:         number;     // total km
  lastSeen:        string;     // ISO 8601
  createdAt:       string;
}

export interface VehicleListParams extends ListParams {
  status?: VehicleStatus;
  driverId?: string;
}
```

### 7.4 Booking Types

```typescript
// src/types/booking.ts

export type BookingStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface RoutePoint {
  label:   string;
  address: string;
  coords:  GeoPoint;
}

export interface BookingCost {
  baseFare:       number;
  fuelSurcharge:  number;
  tollFees:       number;
  driverWage:     number;
  total:          number;
  currency:       string;
}

export interface Booking {
  id:             string;
  bookingNumber:  string;     // Human-readable: BK-20240115-001
  customerId:     string;
  customerName:   string;
  customerPhone:  string;
  vehicleId:      string;
  driverId:       string;
  origin:         RoutePoint;
  destination:    RoutePoint;
  stops:          RoutePoint[];
  status:         BookingStatus;
  cost:           BookingCost;
  scheduledAt:    string;     // ISO 8601
  completedAt:    string | null;
  notes:          string | null;
  createdAt:      string;
  updatedAt:      string;
}
```

### 7.5 Fuel Types

```typescript
// src/types/fuel.ts

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface FuelReading {
  id:          string;
  vehicleId:   string;
  litres:      number;         // current tank litres
  percentage:  number;         // 0-100
  consumption: number;         // litres per 100km
  recordedAt:  string;
}

export interface FuelAlert {
  id:        string;
  vehicleId: string;
  severity:  AlertSeverity;
  message:   string;
  threshold: number;
  actual:    number;
  isRead:    boolean;
  createdAt: string;
}

export interface FuelEfficiencyTrend {
  date:       string;          // YYYY-MM-DD
  vehicleId:  string;
  avgConsumption: number;      // L/100km
  totalLitres: number;
  totalKm:    number;
}
```

### 7.6 Compliance Types

```typescript
// src/types/compliance.ts

export type LicenceStatus = 'valid' | 'expiring' | 'expired';
export type DocumentType = 'vehicle_licence' | 'roadworthy' | 'insurance' | 'permit';

export interface ComplianceRecord {
  id:           string;
  vehicleId:    string;
  vehiclePlate: string;
  documentType: DocumentType;
  documentNumber: string;
  status:       LicenceStatus;
  issuedAt:     string;
  expiresAt:    string;
  reminderSentAt: string | null;
  notes:        string | null;
}
```

### 7.7 Finance Types

```typescript
// src/types/finance.ts

export type ExpenseCategory = 'fuel' | 'maintenance' | 'toll' | 'driver_wage' | 'insurance' | 'other';

export interface RevenueEntry {
  id:          string;
  bookingId:   string;
  vehicleId:   string;
  amount:      number;
  currency:    string;
  recordedAt:  string;
}

export interface ExpenseEntry {
  id:          string;
  vehicleId:   string;
  category:    ExpenseCategory;
  amount:      number;
  currency:    string;
  description: string;
  receiptUrl:  string | null;
  recordedAt:  string;
}

export interface ProfitSummary {
  vehicleId:    string;
  vehiclePlate: string;
  period:       string;       // e.g. "2024-Q1"
  totalRevenue: number;
  totalExpenses: number;
  profit:       number;
  margin:       number;       // percentage
}
```

### 7.8 Maintenance Types

```typescript
// src/types/maintenance.ts

export type HealthStatus = 'good' | 'fair' | 'poor' | 'critical';
export type ServiceType = 'oil_change' | 'tyre_rotation' | 'brake_service' | 'engine_service' | 'full_service';

export interface EngineHealth {
  vehicleId:       string;
  oilLevel:        number;    // 0-100 %
  engineTemp:      number;    // Celsius
  batteryVoltage:  number;    // Volts
  tyrePressure:    number[];  // PSI per tyre [FL, FR, RL, RR]
  overallStatus:   HealthStatus;
  lastCheckedAt:   string;
}

export interface MaintenanceAlert {
  id:          string;
  vehicleId:   string;
  type:        ServiceType;
  message:     string;
  dueDate:     string;
  dueMileage:  number | null;
  severity:    AlertSeverity;
  isRead:      boolean;
}

export interface ServiceLog {
  id:          string;
  vehicleId:   string;
  serviceType: ServiceType;
  description: string;
  cost:        number;
  mileageAt:   number;
  provider:    string;
  performedAt: string;
  nextDueAt:   string | null;
}
```

---

## 8. Mock Data Layer

### 8.1 Mock Helpers

```typescript
// src/utils/mockHelpers.ts

const MIN_DELAY = 300;
const MAX_DELAY = 900;

export async function simulateDelay(ms?: number): Promise<void> {
  const delay = ms ?? Number(import.meta.env.VITE_MOCK_DELAY_MS ?? 600);
  const jitter = Math.random() * (MAX_DELAY - MIN_DELAY) + MIN_DELAY;
  await new Promise(resolve => setTimeout(resolve, ms ?? jitter));
}

export async function simulateError(probability = 0.02): Promise<void> {
  if (Math.random() < probability) {
    throw new Error('Simulated network error — retry or check console');
  }
}

export function paginate<T>(items: T[], page: number, limit: number) {
  const start = (page - 1) * limit;
  return {
    data:     items.slice(start, start + limit),
    total:    items.length,
    page,
    pageSize: limit,
  };
}

export function filterBySearch<T>(
  items: T[],
  search: string,
  fields: (keyof T)[]
): T[] {
  if (!search) return items;
  const q = search.toLowerCase();
  return items.filter(item =>
    fields.some(field => String(item[field]).toLowerCase().includes(q))
  );
}
```

### 8.2 Mock Vehicles

```typescript
// src/mocks/vehicles.ts
import type { Vehicle } from '@/types/vehicle';

export const mockVehicles: Vehicle[] = [
  {
    id: 'v-001',
    plateNumber: 'CA 123-456',
    make: 'Mercedes-Benz',
    model: 'Actros 2645',
    year: 2021,
    color: 'White',
    status: 'in_transit',
    currentLocation: { lat: -26.2041, lng: 28.0473, heading: 45, speed: 80 },
    assignedDriverId: 'd-001',
    fuelLevel: 68,
    mileage: 124500,
    lastSeen: new Date().toISOString(),
    createdAt: '2021-03-15T08:00:00Z',
  },
  {
    id: 'v-002',
    plateNumber: 'GP 789-012',
    make: 'Volvo',
    model: 'FH 460',
    year: 2020,
    color: 'Blue',
    status: 'idle',
    currentLocation: { lat: -25.7479, lng: 28.2293, heading: 0, speed: 0 },
    assignedDriverId: 'd-002',
    fuelLevel: 92,
    mileage: 89300,
    lastSeen: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
    createdAt: '2020-07-22T08:00:00Z',
  },
  {
    id: 'v-003',
    plateNumber: 'WC 345-678',
    make: 'MAN',
    model: 'TGX 26.480',
    year: 2019,
    color: 'Red',
    status: 'maintenance',
    currentLocation: null,                // in workshop — no GPS
    assignedDriverId: null,
    fuelLevel: 12,                        // low fuel edge case
    mileage: 210000,                      // high-mileage edge case
    lastSeen: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3h ago
    createdAt: '2019-11-01T08:00:00Z',
  },
  // ... (generate 17+ more with mix of statuses)
];
```

### 8.3 Mock Bookings

```typescript
// src/mocks/bookings.ts
import type { Booking } from '@/types/booking';

export const mockBookings: Booking[] = [
  {
    id: 'b-001',
    bookingNumber: 'BK-20240115-001',
    customerId: 'c-001',
    customerName: 'Acme Logistics (Pty) Ltd',
    customerPhone: '+27 11 555 0100',
    vehicleId: 'v-001',
    driverId: 'd-001',
    origin: {
      label: 'Johannesburg Warehouse',
      address: '15 Industry Road, Germiston, 1401',
      coords: { lat: -26.2041, lng: 28.1573 },
    },
    destination: {
      label: 'Cape Town Distribution Centre',
      address: '88 Paarden Eiland Rd, Cape Town, 7405',
      coords: { lat: -33.9249, lng: 18.4241 },
    },
    stops: [],
    status: 'in_progress',
    cost: {
      baseFare: 12500,
      fuelSurcharge: 2100,
      tollFees: 480,
      driverWage: 1800,
      total: 16880,
      currency: 'ZAR',
    },
    scheduledAt: '2024-01-15T06:00:00Z',
    completedAt: null,
    notes: 'Fragile cargo — refrigerated trailer required',
    createdAt: '2024-01-10T09:32:00Z',
    updatedAt: '2024-01-15T06:05:00Z',
  },
  // ... more records covering every BookingStatus
];
```

---

## 9. Service Layer

### 9.1 HTTP Client

```typescript
// src/services/http.ts
import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
http.interceptors.request.use(config => {
  const token = useAuthStore.getState().session?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors and handle 401 token expiry
http.interceptors.response.use(
  response => response.data,
  async error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
      window.location.href = '/login';
    }
    return Promise.reject({
      code:    error.response?.data?.code ?? 'UNKNOWN',
      message: error.response?.data?.message ?? 'An unexpected error occurred',
      details: error.response?.data?.details ?? null,
    });
  }
);
```

### 9.2 Vehicle Service (Full Example)

```typescript
// src/services/vehicleService.ts
import type { Vehicle, VehicleListParams } from '@/types/vehicle';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { mockVehicles } from '@/mocks/vehicles';
import { simulateDelay, simulateError, paginate, filterBySearch } from '@/utils/mockHelpers';
import { http } from './http';

// ── Interfaces ──────────────────────────────────────────────────────────────

interface IVehicleService {
  getAll(params?: VehicleListParams): Promise<PaginatedResponse<Vehicle>>;
  getById(id: string): Promise<ApiResponse<Vehicle>>;
  create(data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<ApiResponse<Vehicle>>;
  update(id: string, data: Partial<Vehicle>): Promise<ApiResponse<Vehicle>>;
  delete(id: string): Promise<ApiResponse<null>>;
  getLiveLocations(): Promise<ApiResponse<Vehicle[]>>;
}

// ── Mock Implementation ─────────────────────────────────────────────────────

const mockVehicleService: IVehicleService = {
  async getAll(params = {}) {
    await simulateDelay();
    await simulateError(0.02);

    let results = [...mockVehicles];

    if (params.status)   results = results.filter(v => v.status === params.status);
    if (params.driverId) results = results.filter(v => v.assignedDriverId === params.driverId);
    if (params.search)   results = filterBySearch(results, params.search, ['plateNumber', 'make', 'model']);

    if (params.sortBy) {
      results.sort((a, b) => {
        const dir = params.sortDir === 'desc' ? -1 : 1;
        return String(a[params.sortBy as keyof Vehicle])
          .localeCompare(String(b[params.sortBy as keyof Vehicle])) * dir;
      });
    }

    return paginate(results, params.page ?? 1, params.limit ?? 20);
  },

  async getById(id) {
    await simulateDelay();
    const vehicle = mockVehicles.find(v => v.id === id);
    if (!vehicle) throw { code: 'NOT_FOUND', message: `Vehicle ${id} not found`, details: null };
    return { data: vehicle, message: 'OK', success: true };
  },

  async create(data) {
    await simulateDelay();
    const newVehicle: Vehicle = {
      ...data,
      id: `v-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    mockVehicles.push(newVehicle);
    return { data: newVehicle, message: 'Vehicle created', success: true };
  },

  async update(id, data) {
    await simulateDelay();
    const idx = mockVehicles.findIndex(v => v.id === id);
    if (idx === -1) throw { code: 'NOT_FOUND', message: `Vehicle ${id} not found`, details: null };
    mockVehicles[idx] = { ...mockVehicles[idx], ...data };
    return { data: mockVehicles[idx], message: 'Vehicle updated', success: true };
  },

  async delete(id) {
    await simulateDelay();
    const idx = mockVehicles.findIndex(v => v.id === id);
    if (idx === -1) throw { code: 'NOT_FOUND', message: `Vehicle ${id} not found`, details: null };
    mockVehicles.splice(idx, 1);
    return { data: null, message: 'Vehicle deleted', success: true };
  },

  async getLiveLocations() {
    await simulateDelay(400);
    const located = mockVehicles.filter(v => v.currentLocation !== null);
    return { data: located, message: 'OK', success: true };
  },
};

// ── Real Implementation ─────────────────────────────────────────────────────

const realVehicleService: IVehicleService = {
  getAll:           (params) => http.get('/vehicles', { params }),
  getById:          (id)     => http.get(`/vehicles/${id}`),
  create:           (data)   => http.post('/vehicles', data),
  update:           (id, data) => http.patch(`/vehicles/${id}`, data),
  delete:           (id)     => http.delete(`/vehicles/${id}`),
  getLiveLocations: ()       => http.get('/vehicles/locations/live'),
};

// ── Export ──────────────────────────────────────────────────────────────────

export const vehicleService: IVehicleService =
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realVehicleService
    : mockVehicleService;
```

> **All other services follow the same pattern.** The mock and real implementations both satisfy the `IXxxService` interface. Only the export line changes between environments.

---

## 10. State Management

### 10.1 Auth Store

```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthSession, User } from '@/types/auth';

interface AuthState {
  session:      AuthSession | null;
  // Derived
  user:         User | null;
  isLoggedIn:   boolean;
  // Actions
  setSession:   (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session:    null,
      get user()      { return get().session?.user ?? null; },
      get isLoggedIn() { return get().session !== null; },
      setSession:   (session) => set({ session }),
      clearSession: ()        => set({ session: null }),
    }),
    {
      name:    'fleetops-auth',
      // Only persist the token — sensitive but necessary for page refresh
      partialize: (state) => ({ session: state.session }),
    }
  )
);
```

### 10.2 UI Store

```typescript
// src/store/uiStore.ts
import { create } from 'zustand';

interface UiState {
  sidebarOpen:  boolean;
  toggleSidebar: () => void;
  setSidebar:   (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen:   true,
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebar:    (open) => set({ sidebarOpen: open }),
}));
```

### 10.3 React Query Setup

```typescript
// src/App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            1000 * 30,      // 30s before background refetch
      gcTime:               1000 * 60 * 10, // 10 min garbage collect
      retry:                2,
      refetchOnWindowFocus: false,           // avoid jarring refetch on tab switch
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 10.4 Query Keys Convention

```typescript
// src/utils/queryKeys.ts
// Centralised query keys prevent cache key typos

export const queryKeys = {
  vehicles: {
    all:    ['vehicles']                   as const,
    list:   (params: object) => ['vehicles', 'list', params]  as const,
    detail: (id: string)     => ['vehicles', 'detail', id]    as const,
    locations: ()            => ['vehicles', 'locations']      as const,
  },
  bookings: {
    all:    ['bookings']                   as const,
    list:   (params: object) => ['bookings', 'list', params]  as const,
    detail: (id: string)     => ['bookings', 'detail', id]    as const,
  },
  fuel: {
    all:    ['fuel']                       as const,
    truck:  (id: string)     => ['fuel', id]                   as const,
    alerts: ()               => ['fuel', 'alerts']             as const,
  },
  // ... one per service
} as const;
```

---

## 11. Routing

```typescript
// src/router.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout }    from '@/layouts/AppLayout';
import { AuthLayout }   from '@/layouts/AuthLayout';
import { DriverLayout } from '@/layouts/DriverLayout';
import { RoleGuard }    from '@/features/auth/components/RoleGuard';
import { AuthGuard }    from '@/features/auth/components/AuthGuard';

// Pages — lazy-loaded for code splitting
const LoginPage         = lazy(() => import('@/pages/LoginPage'));
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'));
const FleetPage         = lazy(() => import('@/pages/FleetPage'));
const BookingsPage      = lazy(() => import('@/pages/BookingsPage'));
const BookingDetailPage = lazy(() => import('@/pages/BookingDetailPage'));
const FuelPage          = lazy(() => import('@/pages/FuelPage'));
const CompliancePage    = lazy(() => import('@/pages/CompliancePage'));
const FinancePage       = lazy(() => import('@/pages/FinancePage'));
const AnalyticsPage     = lazy(() => import('@/pages/AnalyticsPage'));
const RoutesPage        = lazy(() => import('@/pages/RoutesPage'));
const MaintenancePage   = lazy(() => import('@/pages/MaintenancePage'));
const DriverAppPage     = lazy(() => import('@/pages/DriverAppPage'));
const NotificationsPage = lazy(() => import('@/pages/NotificationsPage'));
const AdminPage         = lazy(() => import('@/pages/AdminPage'));
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage  = lazy(() => import('@/pages/UnauthorizedPage'));

export const router = createBrowserRouter([
  // ── Public routes (no auth required)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
    ],
  },

  // ── Protected app routes
  {
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/dashboard',              element: <DashboardPage /> },
      { path: '/fleet',                  element: <FleetPage /> },
      { path: '/bookings',               element: <BookingsPage /> },
      { path: '/bookings/:id',           element: <BookingDetailPage /> },
      { path: '/fuel',                   element: <FuelPage /> },
      { path: '/compliance',             element: <CompliancePage /> },
      { path: '/routes',                 element: <RoutesPage /> },
      { path: '/maintenance',            element: <MaintenancePage /> },
      { path: '/notifications',          element: <NotificationsPage /> },

      // Finance — admin + manager only
      {
        path: '/finance',
        element: (
          <RoleGuard allowedRoles={['admin', 'manager']} fallback={<UnauthorizedPage />}>
            <FinancePage />
          </RoleGuard>
        )
      },

      // Analytics — admin + manager only
      {
        path: '/analytics',
        element: (
          <RoleGuard allowedRoles={['admin', 'manager']} fallback={<UnauthorizedPage />}>
            <AnalyticsPage />
          </RoleGuard>
        )
      },

      // Admin — admin only
      {
        path: '/admin',
        element: (
          <RoleGuard allowedRoles={['admin']} fallback={<UnauthorizedPage />}>
            <AdminPage />
          </RoleGuard>
        )
      },
    ],
  },

  // ── Driver mobile layout
  {
    element: <AuthGuard><DriverLayout /></AuthGuard>,
    children: [
      { path: '/driver', element: <DriverAppPage /> },
    ],
  },

  // ── Catch-alls
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '*',             element: <NotFoundPage /> },
]);
```

---

## 12. Feature Implementation Plans

Each feature follows this build sequence:
1. Types defined in `src/types/`
2. Mock data in `src/mocks/`
3. Service in `src/services/`
4. React Query hook in `src/hooks/`
5. Feature components in `src/features/<feature>/components/`
6. Page component in `src/pages/`
7. Route added to `router.tsx`

---

### 12.1 Authentication

**Files:**
- `src/types/auth.ts` ✅ (defined above)
- `src/mocks/users.ts`
- `src/services/authService.ts`
- `src/store/authStore.ts` ✅
- `src/hooks/useAuth.ts`
- `src/hooks/usePermission.ts`
- `src/features/auth/components/LoginForm.tsx`
- `src/features/auth/components/RoleGuard.tsx`
- `src/features/auth/components/AuthGuard.tsx`
- `src/pages/LoginPage.tsx`

**Demo users in `src/mocks/users.ts`:**

```typescript
export const mockUsers = [
  { email: 'admin@fleetops.demo',   password: 'demo1234', role: 'admin' },
  { email: 'manager@fleetops.demo', password: 'demo1234', role: 'manager' },
  { email: 'staff@fleetops.demo',   password: 'demo1234', role: 'office_staff' },
  { email: 'driver@fleetops.demo',  password: 'demo1234', role: 'driver' },
];
```

**`useAuth` hook:**

```typescript
// src/hooks/useAuth.ts
import { useAuthStore } from '@/store/authStore';
import { authService }  from '@/services/authService';
import { useMutation }  from '@tanstack/react-query';
import type { UserRole } from '@/types/auth';

export function useAuth() {
  const { user, session, isLoggedIn, setSession, clearSession } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => setSession(data.data),
  });

  const hasRole = (...roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const logout = () => {
    clearSession();
    authService.logout().catch(() => {}); // fire-and-forget
  };

  return {
    user,
    isLoggedIn,
    hasRole,
    login:    loginMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError:  loginMutation.error,
  };
}
```

**`RoleGuard` component:**

```typescript
// src/features/auth/components/RoleGuard.tsx
import type { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  fallback?:    React.ReactNode;
  children:     React.ReactNode;
}

export function RoleGuard({ allowedRoles, fallback = null, children }: RoleGuardProps) {
  const { hasRole } = useAuth();
  return hasRole(...allowedRoles) ? <>{children}</> : <>{fallback}</>;
}
```

**Login form validation schema:**

```typescript
// src/utils/validators.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email:    z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
```

---

### 12.2 Fleet Dashboard

**Files:**
- `src/types/vehicle.ts` ✅
- `src/mocks/vehicles.ts`
- `src/services/vehicleService.ts` ✅
- `src/hooks/useVehicles.ts`
- `src/hooks/useVehicleLocations.ts`
- `src/features/fleet/components/FleetMap.tsx`
- `src/features/fleet/components/TruckCard.tsx`
- `src/features/fleet/components/TruckStatusBadge.tsx`
- `src/pages/FleetPage.tsx`

**`useVehicleLocations` hook (polling):**

```typescript
// src/hooks/useVehicleLocations.ts
import { useQuery } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicleService';
import { queryKeys } from '@/utils/queryKeys';

export function useVehicleLocations() {
  return useQuery({
    queryKey:       queryKeys.vehicles.locations(),
    queryFn:        vehicleService.getLiveLocations,
    select:         (data) => data.data,
    refetchInterval: 5000, // poll every 5 seconds
  });
}
```

**Fleet page layout:**

```
┌─────────────────────────────────────────────────────┐
│  Fleet Dashboard              [+ Add Truck] [Export] │
├────────────────────────┬────────────────────────────┤
│                        │  Filter: [All ▾] [Search…]  │
│   Interactive Map      ├─────────────────────────────│
│   (Leaflet)            │  TruckCard (v-001)           │
│                        │  TruckCard (v-002)           │
│   Truck markers        │  TruckCard (v-003)           │
│   with status dots     │  ...                         │
│                        │                              │
│                        │  [1] [2] [3] … [Next]        │
└────────────────────────┴─────────────────────────────┘

Stats row:
[ 12 In Transit ] [ 4 Idle ] [ 2 Maintenance ] [ 1 Offline ]
```

---

### 12.3 Booking Management

**Files:**
- `src/types/booking.ts` ✅
- `src/mocks/bookings.ts`
- `src/services/bookingService.ts`
- `src/hooks/useBookings.ts`
- `src/hooks/useBooking.ts`
- `src/features/bookings/components/BookingForm.tsx`
- `src/features/bookings/components/BookingList.tsx`
- `src/features/bookings/components/BookingDetail.tsx`
- `src/features/bookings/components/BookingStatusBadge.tsx`
- `src/features/bookings/components/CostCalculator.tsx`
- `src/pages/BookingsPage.tsx`
- `src/pages/BookingDetailPage.tsx`

**Status machine transitions:**

```typescript
// src/utils/constants.ts
export const BOOKING_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  draft:       ['confirmed', 'cancelled'],
  confirmed:   ['in_progress', 'cancelled'],
  in_progress: ['completed', 'cancelled'],
  completed:   [],
  cancelled:   [],
};
```

**Cost calculator logic:**

```typescript
// Extracted to a pure function — easy to unit test
export function calculateBookingCost(params: {
  distanceKm:     number;
  fuelPricePerL:  number;
  consumptionL100: number;
  driverRatePerKm: number;
  tollFees:       number;
}): BookingCost {
  const fuelSurcharge = (params.distanceKm / 100) * params.consumptionL100 * params.fuelPricePerL;
  const driverWage    = params.distanceKm * params.driverRatePerKm;
  const baseFare      = params.distanceKm * 12; // R12/km base rate
  return {
    baseFare:      Math.round(baseFare),
    fuelSurcharge: Math.round(fuelSurcharge),
    tollFees:      params.tollFees,
    driverWage:    Math.round(driverWage),
    total:         Math.round(baseFare + fuelSurcharge + params.tollFees + driverWage),
    currency:      'ZAR',
  };
}
```

**Page layout:**

```
┌────────────────────────────────────────────────────────┐
│  Bookings                          [+ New Booking]      │
│                                                         │
│  [ All ▾ ] [ This Week ▾ ] [Search bookings…]          │
├────────────────────────────────────────────────────────┤
│  #       │ Customer        │ Route       │ Status │ Cost │
│  BK-001  │ Acme Logistics  │ JHB → CPT   │ 🔵 In… │ R16.9K│
│  BK-002  │ Swift Delivery  │ DBN → JHB   │ ✅ Done │ R8.4K │
│  BK-003  │ Peak Freight    │ CPT → PLZ   │ ⏳ Draft│ R11.2K│
└────────────────────────────────────────────────────────┘
```

---

### 12.4 Fuel Monitoring

**Files:**
- `src/types/fuel.ts` ✅
- `src/mocks/fuelReadings.ts`
- `src/services/fuelService.ts`
- `src/hooks/useFuelData.ts`
- `src/features/fuel/components/FuelGauge.tsx`
- `src/features/fuel/components/FuelTrendChart.tsx`
- `src/features/fuel/components/FuelAlertBanner.tsx`
- `src/features/fuel/components/FuelTable.tsx`
- `src/pages/FuelPage.tsx`

**Anomaly detection:**

```typescript
// src/utils/fuelUtils.ts
export const ANOMALY_THRESHOLD = 0.15; // 15% above 7-day average

export function detectFuelAnomalies(
  readings: FuelReading[],
  vehicleId: string
): FuelAlert[] {
  const vehicleReadings = readings.filter(r => r.vehicleId === vehicleId);
  if (vehicleReadings.length < 24) return []; // Need at least 24 readings

  const recentAvg = vehicleReadings
    .slice(-168) // last 168 hourly readings = 7 days
    .reduce((sum, r) => sum + r.consumption, 0) / 168;

  return vehicleReadings
    .filter(r => r.consumption > recentAvg * (1 + ANOMALY_THRESHOLD))
    .map(r => ({
      id:        `alert-${r.id}`,
      vehicleId: r.vehicleId,
      severity:  r.consumption > recentAvg * 1.3 ? 'critical' : 'high',
      message:   `Fuel consumption ${((r.consumption / recentAvg - 1) * 100).toFixed(0)}% above 7-day average`,
      threshold: recentAvg * (1 + ANOMALY_THRESHOLD),
      actual:    r.consumption,
      isRead:    false,
      createdAt: r.recordedAt,
    } satisfies FuelAlert));
}
```

---

### 12.5 Compliance & Licence Portal

**Files:**
- `src/types/compliance.ts` ✅
- `src/mocks/complianceRecords.ts`
- `src/services/complianceService.ts`
- `src/hooks/useCompliance.ts`
- `src/features/compliance/components/ComplianceTable.tsx`
- `src/features/compliance/components/LicenceBadge.tsx`
- `src/features/compliance/components/RenewalAlert.tsx`
- `src/pages/CompliancePage.tsx`

**Status calculation logic:**

```typescript
// src/utils/complianceUtils.ts
import { differenceInDays } from 'date-fns';

const WARNING_DAYS = 30; // Show "expiring" badge 30 days before expiry

export function getComplianceStatus(expiresAt: string): LicenceStatus {
  const daysUntilExpiry = differenceInDays(new Date(expiresAt), new Date());
  if (daysUntilExpiry < 0)             return 'expired';
  if (daysUntilExpiry <= WARNING_DAYS) return 'expiring';
  return 'valid';
}
```

---

### 12.6 Financial Tracking

**Files:**
- `src/types/finance.ts` ✅
- `src/mocks/financeEntries.ts`
- `src/services/financeService.ts`
- `src/hooks/useFinance.ts`
- `src/features/finance/components/RevenueTable.tsx`
- `src/features/finance/components/ExpenseLog.tsx`
- `src/features/finance/components/ProfitSummaryCard.tsx`
- `src/pages/FinancePage.tsx`

**Page layout:**

```
┌───────────────────────────────────────────────────────────┐
│  Financial Tracking                [Export PDF] [Q1 2024 ▾]│
├──────────────┬──────────────┬──────────────┬──────────────┤
│ Total Revenue│ Total Expenses│   Net Profit │   Margin     │
│ R 1,284,500  │  R 892,300   │  R 392,200   │  30.5 %      │
├──────────────┴──────────────┴──────────────┴──────────────┤
│  [Revenue] [Expenses] [By Truck] [By Route]                │
│                                                            │
│  Revenue Table / Expense Log (tabbed)                      │
└────────────────────────────────────────────────────────────┘
```

---

### 12.7 Analytics & Reporting

**Files:**
- `src/types/analytics.ts`
- `src/services/analyticsService.ts`
- `src/hooks/useAnalytics.ts`
- `src/features/analytics/components/KpiGrid.tsx`
- `src/features/analytics/components/BookingTrendChart.tsx`
- `src/features/analytics/components/FuelEfficiencyChart.tsx`
- `src/features/analytics/components/RoutePerformanceTable.tsx`
- `src/pages/AnalyticsPage.tsx`

**Charts to implement:**
- Bookings over time (AreaChart)
- Revenue vs Expenses by month (BarChart)
- Fuel efficiency per truck (BarChart)
- Top routes by profitability (horizontal BarChart)
- Booking success rate (PieChart)
- Fleet utilisation rate (RadialBarChart)

---

### 12.8 Route Optimisation

**Files:**
- `src/types/route.ts`
- `src/mocks/routes.ts`
- `src/services/routeService.ts`
- `src/hooks/useRoutes.ts`
- `src/features/routes/components/RouteMap.tsx`
- `src/features/routes/components/RouteForm.tsx`
- `src/features/routes/components/RouteSuggestionCard.tsx`
- `src/pages/RoutesPage.tsx`

**Route suggestion type:**

```typescript
// src/types/route.ts
export type OptimisationCriteria = 'fastest' | 'cheapest' | 'least_fuel';

export interface RouteSuggestion {
  id:                string;
  criteria:          OptimisationCriteria;
  waypoints:         GeoPoint[];
  distanceKm:        number;
  estimatedDuration: number;     // minutes
  estimatedFuelCost: number;
  trafficDelay:      number;     // minutes
  score:             number;     // 0-100 AI confidence
}
```

**Mock AI suggestion:** The mock service returns 3 pre-computed route options with slightly different trade-offs to simulate AI output. No real AI call is made in mock mode.

---

### 12.9 Predictive Maintenance

**Files:**
- `src/types/maintenance.ts` ✅
- `src/mocks/maintenanceLogs.ts`
- `src/services/maintenanceService.ts`
- `src/hooks/useMaintenance.ts`
- `src/features/maintenance/components/EngineHealthCard.tsx`
- `src/features/maintenance/components/MaintenanceAlertList.tsx`
- `src/features/maintenance/components/ServiceLogTable.tsx`
- `src/pages/MaintenancePage.tsx`

**Engine health card layout:**

```
┌──────────────────────────────────────┐
│  v-001  CA 123-456   ● FAIR          │
│                                      │
│  Oil Level     ████████░░  80%       │
│  Engine Temp   22°C  ✅ Normal       │
│  Battery       12.6V ✅ Good         │
│  Tyres         [32] [31] [33] [32]   │
│                                      │
│  ⚠ Oil change due in 1,200 km       │
│  Last service: 15 Jan 2024           │
└──────────────────────────────────────┘
```

---

### 12.10 Driver Mobile App

**Files:**
- `src/types/driver.ts`
- `src/mocks/drivers.ts`
- `src/services/driverService.ts`
- `src/hooks/useDrivers.ts`
- `src/features/drivers/components/AssignmentCard.tsx`
- `src/features/drivers/components/ActivityLog.tsx`
- `src/features/drivers/components/IssueReportForm.tsx`
- `src/layouts/DriverLayout.tsx`
- `src/pages/DriverAppPage.tsx`

**Driver layout** is a dedicated mobile-first layout (max-width 480px) separate from the desktop `AppLayout`. A driver logging in is auto-redirected to `/driver`.

```typescript
// src/features/auth/components/AuthGuard.tsx
// After login, redirect driver role to /driver, all others to /dashboard
if (user.role === 'driver') {
  return <Navigate to="/driver" replace />;
}
```

---

### 12.11 Notifications & Alerts

**Files:**
- `src/types/notification.ts`
- `src/mocks/notifications.ts`
- `src/services/notificationService.ts`
- `src/store/notificationStore.ts`
- `src/hooks/useNotifications.ts`
- `src/features/notifications/components/NotificationBell.tsx`
- `src/features/notifications/components/NotificationList.tsx`
- `src/pages/NotificationsPage.tsx`

**Notification type:**

```typescript
// src/types/notification.ts
export type NotificationType =
  | 'fuel_alert'
  | 'maintenance_due'
  | 'compliance_expiry'
  | 'booking_update'
  | 'system';

export interface Notification {
  id:        string;
  type:      NotificationType;
  severity:  AlertSeverity;
  title:     string;
  message:   string;
  entityId:  string | null;    // linked vehicle/booking ID
  isRead:    boolean;
  createdAt: string;
}
```

**Unread count in Header:** `notificationStore` holds a `unreadCount` that the `NotificationBell` reads. On marking as read, the service call updates the store optimistically.

---

### 12.12 Admin Controls

**Files:**
- `src/services/userService.ts`
- `src/hooks/useUsers.ts`
- `src/features/admin/components/UserTable.tsx`
- `src/features/admin/components/UserForm.tsx`
- `src/features/admin/components/SystemSettings.tsx`
- `src/pages/AdminPage.tsx`

**Admin tabs:**
- **Users** — list, create, edit, deactivate users; assign roles
- **System Settings** — fuel anomaly threshold, compliance warning window, default currency
- **Audit Log** — who changed what and when (read-only)

---

## 13. Shared UI Components

### Button

```typescript
// src/components/ui/Button/Button.tsx
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:    Variant;
  size?:       Size;
  isLoading?:  boolean;
  leftIcon?:   React.ReactNode;
  rightIcon?:  React.ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500',
  secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  ghost:     'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
  danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
};

const SIZES: Record<Size, string> = {
  sm: 'h-8  px-3 text-sm  gap-1.5',
  md: 'h-10 px-4 text-sm  gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <Spinner size="sm" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
```

### Badge

```typescript
// src/components/ui/Badge/Badge.tsx
import { cn } from '@/utils/cn';
import { STATUS_COLORS } from '@/utils/constants';

type StatusKey = keyof typeof STATUS_COLORS;

interface BadgeProps {
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
  const text   = label ?? AUTO_LABELS[status] ?? status;

  return (
    <span
      role="status"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colors.bg,
        colors.text,
        className
      )}
    >
      {withDot && <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />}
      {text}
    </span>
  );
}
```

### DataTable

```typescript
// src/components/ui/DataTable/DataTable.tsx
// Handles: sorting, pagination, empty state, loading skeleton, row selection

interface Column<T> {
  key:       keyof T | string;
  header:    string;
  cell:      (row: T) => React.ReactNode;
  sortable?: boolean;
  width?:    string;       // e.g. 'w-32'
}

interface DataTableProps<T> {
  columns:     Column<T>[];
  data:        T[];
  isLoading?:  boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    page:      number;
    pageSize:  number;
    total:     number;
    onChange:  (page: number) => void;
  };
  onRowClick?: (row: T) => void;
}
```

### Skeleton

```typescript
// src/components/ui/Skeleton/Skeleton.tsx
// Usage: <Skeleton className="h-4 w-32" /> or <Skeleton.Card /> or <Skeleton.Table rows={5} />

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-gray-200', className)} />
  );
}

Skeleton.Card = function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
    </div>
  );
};

Skeleton.Table = function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
};
```

### EmptyState

```typescript
// src/components/feedback/EmptyState.tsx
interface EmptyStateProps {
  icon?:        React.ReactNode;
  title:        string;
  description?: string;
  action?:      React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

---

## 14. Hooks Reference

| Hook | Returns | Purpose |
|------|---------|---------|
| `useAuth()` | `{ user, isLoggedIn, hasRole, login, logout }` | Auth state + actions |
| `usePermission(role)` | `boolean` | Single role check |
| `useVehicles(params)` | `{ data, isLoading, error }` | Vehicle list (paginated) |
| `useVehicle(id)` | `{ data, isLoading, error }` | Single vehicle |
| `useVehicleLocations()` | `{ locations, isLoading }` | Live GPS, polls every 5s |
| `useBookings(params)` | `{ data, isLoading, error }` | Booking list (paginated) |
| `useBooking(id)` | `{ data, isLoading, error }` | Single booking |
| `useFuelData(vehicleId?)` | `{ readings, alerts, trends }` | Fuel data |
| `useCompliance(params)` | `{ data, isLoading, error }` | Compliance records |
| `useFinance(params)` | `{ revenue, expenses, summary }` | Finance data |
| `useAnalytics(period)` | `{ kpis, charts }` | Analytics data |
| `useRoutes()` | `{ suggest, routes, isLoading }` | Route optimisation |
| `useMaintenance(vehicleId?)` | `{ health, alerts, logs }` | Maintenance data |
| `useDrivers()` | `{ data, isLoading }` | Driver list |
| `useNotifications()` | `{ notifications, unreadCount, markRead }` | Notification centre |
| `useDebounce(value, ms)` | `T` | Debounce any value |
| `usePagination(total)` | `{ page, pageSize, setPage, setPageSize }` | Pagination state |
| `useToast()` | `{ toast }` | Show success/error toasts |

---

## 15. Testing Strategy

### 15.1 Test Pyramid

```
        /\
       /E2E\          (Playwright — 10-15 critical user journeys)
      /──────\
     / Integr \       (RTL + MSW — 30-40 container components)
    /──────────\
   /    Unit    \     (Vitest — 100+ utils, services, hooks)
  /______________\
```

### 15.2 Test Setup

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(cleanup);

// Mock env variables for tests
vi.stubEnv('VITE_ENABLE_REAL_API', 'false');
vi.stubEnv('VITE_MOCK_DELAY_MS', '0');  // no delay in tests
```

### 15.3 What to Test

**Unit tests — utilities:**
```typescript
// src/utils/fuelUtils.test.ts
describe('detectFuelAnomalies', () => {
  it('returns empty array when fewer than 24 readings', () => {
    expect(detectFuelAnomalies(readings.slice(0, 10), 'v-001')).toEqual([]);
  });

  it('flags consumption > 15% above 7-day average as high severity', () => {
    const alerts = detectFuelAnomalies(anomalousReadings, 'v-001');
    expect(alerts[0].severity).toBe('high');
  });
});
```

**Unit tests — services:**
```typescript
// src/services/vehicleService.test.ts
describe('mockVehicleService.getAll', () => {
  it('paginates correctly', async () => {
    const page1 = await vehicleService.getAll({ page: 1, limit: 5 });
    expect(page1.data).toHaveLength(5);
    expect(page1.total).toBeGreaterThan(5);
  });

  it('filters by status', async () => {
    const result = await vehicleService.getAll({ status: 'idle' });
    expect(result.data.every(v => v.status === 'idle')).toBe(true);
  });
});
```

**Integration tests — components:**
```typescript
// src/features/fleet/components/TruckCard.test.tsx
import { render, screen } from '@testing-library/react';
import { TruckCard } from './TruckCard';
import { mockVehicles } from '@/mocks/vehicles';

describe('TruckCard', () => {
  const vehicle = mockVehicles[0];

  it('renders plate number', () => {
    render(<TruckCard vehicle={vehicle} />);
    expect(screen.getByText(vehicle.plateNumber)).toBeInTheDocument();
  });

  it('shows correct status badge', () => {
    render(<TruckCard vehicle={vehicle} />);
    expect(screen.getByRole('status')).toHaveTextContent('In Transit');
  });

  it('calls onSelect with vehicle id on click', async () => {
    const onSelect = vi.fn();
    const { user } = render(<TruckCard vehicle={vehicle} onSelect={onSelect} />);
    await user.click(screen.getByRole('button'));
    expect(onSelect).toHaveBeenCalledWith(vehicle.id);
  });
});
```

### 15.4 Coverage Targets

| Layer | Target |
|-------|--------|
| Utility functions | 95%+ |
| Service layer | 90%+ |
| Presentational components | 80%+ |
| Container components | 70%+ |
| Pages | 50%+ (E2E covers the rest) |

---

## 16. Performance Plan

### Code Splitting

All pages are lazy-loaded via `React.lazy()`. Each feature folder is a separate chunk. The initial bundle loads only the auth page and the app shell.

### Memoisation Rules

```typescript
// Memoize only when:
// 1. Component is proven slow via React DevTools Profiler
// 2. The function/value is recreated on every render AND passed to a child component

// ✅ Correct use of useMemo
const sortedVehicles = useMemo(
  () => [...vehicles].sort((a, b) => a.plateNumber.localeCompare(b.plateNumber)),
  [vehicles]  // only recalculates when vehicles array changes
);

// ❌ Premature optimisation — don't do this
const label = useMemo(() => `${count} trucks`, [count]); // string concat is free
```

### React Query Caching

```typescript
// Aggressive caching for slow-changing data
useQuery({ queryKey: [...], staleTime: 1000 * 60 * 5 })  // 5 min — compliance records

// Conservative caching for frequently updated data
useQuery({ queryKey: [...], staleTime: 1000 * 15 })       // 15s — fuel readings

// Real-time via polling
useQuery({ queryKey: [...], refetchInterval: 5000 })       // 5s — GPS locations
```

### Image & Asset Optimisation

- All truck/driver images served via CDN with explicit width/height
- SVG icons imported directly (no icon font)
- Fonts: Inter loaded via `font-display: swap` to prevent FOIT

---

## 17. Backend Integration Strategy

### Phase 1 — Mock Mode (Current)

The app runs entirely on in-memory mock data. No backend required.

```
UI Component → Hook → Service (mock) → Mock Data
```

### Phase 2 — Backend Ready

Change two things per service:

**Step 1:** Set environment variable
```bash
VITE_ENABLE_REAL_API=true
VITE_API_BASE_URL=https://api.fleetops.yourdomain.com/v1
```

**Step 2:** Implement the real service functions (already scaffolded in every service file)

**Step 3:** If the API response shape differs from frontend types, add a mapper:
```typescript
// src/utils/mappers/vehicleMapper.ts
export function mapApiVehicle(raw: ApiVehicleDto): Vehicle {
  return {
    id:              raw.vehicle_id,
    plateNumber:     raw.license_plate,
    // ... normalise snake_case to camelCase, handle nulls, etc.
  };
}
```

### API Contract Expectations

The frontend assumes the backend provides:

```
GET    /vehicles              → PaginatedResponse<Vehicle>
GET    /vehicles/:id          → ApiResponse<Vehicle>
POST   /vehicles              → ApiResponse<Vehicle>
PATCH  /vehicles/:id          → ApiResponse<Vehicle>
DELETE /vehicles/:id          → ApiResponse<null>
GET    /vehicles/locations/live → ApiResponse<Vehicle[]>

GET    /bookings              → PaginatedResponse<Booking>
GET    /bookings/:id          → ApiResponse<Booking>
POST   /bookings              → ApiResponse<Booking>
PATCH  /bookings/:id/status   → ApiResponse<Booking>

POST   /auth/login            → ApiResponse<AuthSession>
POST   /auth/logout           → ApiResponse<null>
POST   /auth/refresh          → ApiResponse<AuthSession>

# ... (same pattern for all resources)
```

### Auth Flow

```
Login → POST /auth/login → { accessToken, refreshToken, expiresAt, user }
       → Store in authStore (persisted to localStorage via Zustand persist)
       → Axios interceptor attaches Bearer token to every request
       → 401 response → auto-call POST /auth/refresh
       → Refresh fails → clearSession() → redirect to /login
```

---

## 18. Deployment Pipeline

### CI Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test -- --coverage
      - run: npm run build

  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '18', cache: 'npm' }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npx playwright test
```

### Environments

| Environment | Branch | URL | API Mode |
|-------------|--------|-----|----------|
| Development | any | localhost:5173 | Mock |
| Staging | `main` | staging.fleetops.yourdomain.com | Real (staging API) |
| Production | `release/*` | fleetops.yourdomain.com | Real (prod API) |

---

## 19. Implementation Phases & Timeline

### Phase 1 — Foundation (Week 1–2)

**Goal:** Project skeleton running with auth and basic navigation.

- [ ] Repository setup (Vite, TypeScript, Tailwind, ESLint, Prettier)
- [ ] Path aliases configured
- [ ] Folder structure created
- [ ] Design system tokens in `tailwind.config.ts`
- [ ] Core shared components: `Button`, `Badge`, `Card`, `Skeleton`, `EmptyState`, `ErrorState`
- [ ] App layout: `AppLayout`, `Sidebar`, `Header`
- [ ] Auth layout: `AuthLayout`
- [ ] Auth types + mock users
- [ ] `authService` (mock)
- [ ] `authStore` (Zustand)
- [ ] `LoginPage` with form validation
- [ ] `RoleGuard`, `AuthGuard`
- [ ] Router with protected routes
- [ ] `DashboardPage` stub (role-specific welcome)

**Deliverable:** Runnable app. Login with any demo user. See role-specific dashboard stub. Logout works.

---

### Phase 2 — Fleet & Bookings (Week 3–4)

**Goal:** Core operational features working end-to-end.

- [ ] Vehicle types + 20 mock records (all statuses)
- [ ] `vehicleService` (mock)
- [ ] `useVehicles`, `useVehicle`, `useVehicleLocations` hooks
- [ ] `FleetMap` (Leaflet), `TruckCard`, `TruckStatusBadge`
- [ ] `FleetPage` with map + sidebar list + polling
- [ ] Booking types + 15 mock records (all statuses)
- [ ] `bookingService` (mock) + status machine validation
- [ ] `useBookings`, `useBooking` hooks
- [ ] `BookingList` with `DataTable`, filters, pagination
- [ ] `BookingForm` with Zod validation + cost calculator
- [ ] `BookingDetail` page
- [ ] `BookingStatusBadge`

**Deliverable:** Full fleet map with live markers. Can create, view, filter, and update bookings.

---

### Phase 3 — Fuel, Compliance & Finance (Week 5–6)

**Goal:** Operational monitoring features.

- [ ] Fuel types + mock time-series data
- [ ] `fuelService` + anomaly detection util
- [ ] `useFuelData` hook
- [ ] `FuelGauge`, `FuelTrendChart`, `FuelAlertBanner`, `FuelTable`
- [ ] `FuelPage`
- [ ] Compliance types + mock records (valid/expiring/expired mix)
- [ ] `complianceService` + expiry calculation util
- [ ] `ComplianceTable`, `LicenceBadge`, `RenewalAlert`
- [ ] `CompliancePage`
- [ ] Finance types + mock revenue/expense entries
- [ ] `financeService`
- [ ] `RevenueTable`, `ExpenseLog`, `ProfitSummaryCard`
- [ ] `FinancePage` (admin/manager only)

**Deliverable:** Fuel monitoring with alerts. Compliance tracker. Finance P&L view.

---

### Phase 4 — Analytics, Routes & Maintenance (Week 7–8)

**Goal:** Intelligence and optimisation features.

- [ ] Analytics types + mock aggregate data
- [ ] `analyticsService`
- [ ] Chart components (Area, Bar, Pie, Radial)
- [ ] `KpiGrid`, `AnalyticsPage`
- [ ] Route types + mock AI suggestions
- [ ] `routeService`
- [ ] `RouteMap`, `RouteForm`, `RouteSuggestionCard`
- [ ] `RoutesPage`
- [ ] Maintenance types + mock engine health + service logs
- [ ] `maintenanceService`
- [ ] `EngineHealthCard`, `MaintenanceAlertList`, `ServiceLogTable`
- [ ] `MaintenancePage`

**Deliverable:** Full analytics dashboard. Route optimisation with 3 AI suggestion options. Predictive maintenance centre.

---

### Phase 5 — Drivers, Notifications & Admin (Week 9–10)

**Goal:** Complete all remaining modules.

- [ ] Driver types + mock profiles
- [ ] `driverService`
- [ ] `DriverLayout` (mobile-first)
- [ ] `AssignmentCard`, `ActivityLog`, `IssueReportForm`
- [ ] `DriverAppPage`
- [ ] Notification types + mock alerts
- [ ] `notificationService`
- [ ] `notificationStore`
- [ ] `NotificationBell` (Header), `NotificationList`
- [ ] `NotificationsPage`
- [ ] `userService`
- [ ] `UserTable`, `UserForm`, `SystemSettings`
- [ ] `AdminPage` (admin only)

**Deliverable:** Driver mobile view. Notification bell with unread count. Full admin panel.

---

### Phase 6 — Polish & Handoff (Week 11–12)

**Goal:** Production readiness.

- [ ] Responsive design audit (mobile, tablet, desktop)
- [ ] Accessibility audit (keyboard nav, screen reader labels, focus visible)
- [ ] Error boundary added to all route-level pages
- [ ] `NotFoundPage`, `UnauthorizedPage` polished
- [ ] Loading performance: measure and fix > 3s LCP
- [ ] Unit test coverage to targets
- [ ] Playwright E2E for 10 critical journeys
- [ ] CI pipeline green
- [ ] Backend integration checklist reviewed with API team
- [ ] README and Storybook (optional) up to date

---

## 20. Contributor Checklist

Run through this list before opening every pull request:

```
Code Quality
  ☐ npm run type-check passes (zero TypeScript errors)
  ☐ npm run lint passes (zero ESLint errors or warnings)
  ☐ npm run test passes (all tests green)
  ☐ No console.log() statements in committed code
  ☐ No commented-out code blocks
  ☐ No any types — all props are fully typed

Architecture
  ☐ No data fetching inside components (all through service layer)
  ☐ No hardcoded data in components (all through mocks/)
  ☐ New mock data includes edge cases (nulls, long strings, all status values)
  ☐ New service implements both mock and real interfaces

UI / UX
  ☐ All data views handle: loading state, error state, empty state, success state
  ☐ Loading states use Skeleton, not just a spinner
  ☐ Error states give the user a Retry action
  ☐ Empty states give the user an action to resolve the emptiness
  ☐ Responsive at 375px (mobile), 768px (tablet), 1280px (desktop)

Accessibility
  ☐ Interactive elements are keyboard-accessible
  ☐ Images have meaningful alt text (or alt="" if decorative)
  ☐ Status badges use role="status"
  ☐ Form inputs have associated labels
  ☐ Color is not the only indicator of meaning (also text or icon)

Git
  ☐ Branch name follows convention (feature/FO-NNN-description)
  ☐ Commit messages follow Conventional Commits format
  ☐ PR description explains what changed and why
  ☐ PR links to the Jira/Linear ticket
  ☐ Self-reviewed the diff before requesting review
```

---

*Questions? Open a GitHub Discussion or ping `#frontend-eng` in Slack.*  
*Last updated: 2024 — update this line when making structural changes.*
