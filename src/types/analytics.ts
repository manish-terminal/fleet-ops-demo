export interface KpiItem {
  label: string;
  value: string | number;
  change: number; // percentage change, e.g. 12.5
  trend: 'up' | 'down' | 'neutral';
  unit?: string;
}

export interface BookingTrend {
  date: string; // YYYY-MM-DD
  bookings: number;
}

export interface FinancialTrend {
  month: string; // e.g. "Jan", "Feb"
  revenue: number;
  expenses: number;
}

export interface FuelEfficiency {
  plateNumber: string;
  efficiency: number; // L/100km
}

export interface RoutePerformance {
  route: string; // e.g. "Mumbai - Delhi"
  revenue: number;
  expenses: number;
  profitability: number; // profit margin in %
  delays: number; // average traffic delays in minutes
}

export interface BookingSuccessRate {
  name: string; // e.g. "Completed", "Cancelled"
  value: number;
}

export interface FleetUtilisation {
  name: string; // e.g. "Utilised", "Available"
  value: number;
  fill: string;
}

export interface AnalyticsData {
  kpis: KpiItem[];
  bookingTrend: BookingTrend[];
  financialTrend: FinancialTrend[];
  fuelEfficiency: FuelEfficiency[];
  routePerformance: RoutePerformance[];
  successRate: BookingSuccessRate[];
  utilisation: FleetUtilisation[];
}
