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
  period:       string;       // e.g. "2026-Q2"
  totalRevenue: number;
  totalExpenses: number;
  profit:       number;
  margin:       number;       // percentage
}
