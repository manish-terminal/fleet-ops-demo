import { AlertSeverity } from './fuel';

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
