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
