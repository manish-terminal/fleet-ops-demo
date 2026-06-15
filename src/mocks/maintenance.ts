import type { EngineHealth, MaintenanceAlert, ServiceLog } from '@/types/maintenance';
import { mockVehicles } from './vehicles';

const now = new Date();

// Generate Engine Health readings for our fleet vehicles
function generateEngineHealth(): EngineHealth[] {
  const healths: EngineHealth[] = [];

  mockVehicles.forEach((vehicle, idx) => {
    // Determine diagnostics based on index to create a mix of good/fair/critical health
    let overallStatus: 'good' | 'fair' | 'poor' | 'critical' = 'good';
    let oilLevel = 85 - (idx % 4) * 10; // 55% - 85%
    let engineTemp = 82 + (idx % 3) * 5; // 82C - 92C
    let batteryVoltage = 12.6 - (idx % 5) * 0.15; // 12.0V - 12.6V
    let tyrePressure = [32 + (idx % 2), 32 - (idx % 2), 33 + (idx % 3), 33 - (idx % 3)];

    // Inject some bad health states
    if (vehicle.id === 'v-003') {
      overallStatus = 'poor';
      oilLevel = 22; // Low oil
      engineTemp = 99; // Slightly high temp
      tyrePressure = [30, 29, 32, 31];
    } else if (vehicle.id === 'v-005') {
      overallStatus = 'critical';
      oilLevel = 8; // Critical low oil!
      engineTemp = 108; // Overheating
      batteryVoltage = 10.8; // Low battery voltage
      tyrePressure = [26, 32, 33, 24]; // Flat tyres
    } else if (vehicle.id === 'v-008') {
      overallStatus = 'fair';
      oilLevel = 45;
      batteryVoltage = 11.9;
    }

    healths.push({
      vehicleId: vehicle.id,
      oilLevel,
      engineTemp,
      batteryVoltage: Math.round(batteryVoltage * 10) / 10,
      tyrePressure,
      overallStatus,
      lastCheckedAt: new Date(now.getTime() - idx * 60 * 60 * 1000).toISOString(),
    });
  });

  return healths;
}

export const mockEngineHealth: EngineHealth[] = generateEngineHealth();

// Pending maintenance alerts
export const mockMaintenanceAlerts: MaintenanceAlert[] = [
  {
    id: 'm-alert-001',
    vehicleId: 'v-003',
    type: 'oil_change',
    message: 'Engine oil quality has degraded to 22%. Replace filter and oil.',
    dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3).toISOString(), // due in 3 days
    dueMileage: 211200,
    severity: 'high',
    isRead: false,
  },
  {
    id: 'm-alert-002',
    vehicleId: 'v-005',
    type: 'engine_service',
    message: 'Critical engine overheating detected (108°C). Shut down engine immediately.',
    dueDate: new Date().toISOString(), // due now
    dueMileage: 345050,
    severity: 'critical',
    isRead: false,
  },
  {
    id: 'm-alert-003',
    vehicleId: 'v-005',
    type: 'tyre_rotation',
    message: 'Severe tyre pressure imbalance detected (26/32/33/24 PSI). Inspect tyres.',
    dueDate: new Date().toISOString(),
    dueMileage: null,
    severity: 'critical',
    isRead: false,
  },
  {
    id: 'm-alert-004',
    vehicleId: 'v-008',
    type: 'brake_service',
    message: 'Front brake pads worn down to 15%. Service booking recommended.',
    dueDate: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    dueMileage: 157500,
    severity: 'medium',
    isRead: false,
  }
];

// Historical service logs
export const mockServiceLogs: ServiceLog[] = [
  {
    id: 'log-001',
    vehicleId: 'v-001',
    serviceType: 'full_service',
    description: 'Major service completed. Replaced engine oil, gear oil, air filter, and cabin filters. Checked brakes.',
    cost: 14500, // INR
    mileageAt: 121000,
    provider: 'Tata Motors Service Centre, Pune',
    performedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    nextDueAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 320).toISOString(),
  },
  {
    id: 'log-002',
    vehicleId: 'v-002',
    serviceType: 'tyre_rotation',
    description: 'Rotated and balanced all tyres. Replaced front right tyre due to sidewall damage.',
    cost: 8800,
    mileageAt: 88500,
    provider: 'MRF Tyres Clinic, Delhi',
    performedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    nextDueAt: null,
  },
  {
    id: 'log-003',
    vehicleId: 'v-004',
    serviceType: 'brake_service',
    description: 'Replaced front brake discs and brake pads. Bled braking system.',
    cost: 11200,
    mileageAt: 64100,
    provider: 'Mahindra Authorized Workshop, Gurugram',
    performedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    nextDueAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 180).toISOString(),
  },
  {
    id: 'log-004',
    vehicleId: 'v-006',
    serviceType: 'oil_change',
    description: 'Routine oil change and oil filter replacement.',
    cost: 5400,
    mileageAt: 110500,
    provider: 'BharatBenz Service hub, Chennai',
    performedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    nextDueAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90).toISOString(),
  }
];

export default mockEngineHealth;
