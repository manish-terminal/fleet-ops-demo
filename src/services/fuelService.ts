import type { FuelReading, FuelAlert, FuelEfficiencyTrend } from '@/types/fuel';
import type { ApiResponse } from '@/types/api';
import { mockFuelReadings, mockFuelTrends } from '@/mocks/fuel';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

export const ANOMALY_THRESHOLD = 0.15; // 15% above 7-day average

export function detectFuelAnomalies(
  readings: FuelReading[],
  vehicleId: string
): FuelAlert[] {
  const vehicleReadings = readings.filter(r => r.vehicleId === vehicleId);
  if (vehicleReadings.length < 24) return []; // Need at least 24 readings

  // Calculate 7-day consumption average (using all readings available up to last 168 hours)
  const sorted = [...vehicleReadings].sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());
  
  const recentAvg = sorted
    .slice(-168) // last 168 hourly readings = 7 days
    .reduce((sum, r) => sum + r.consumption, 0) / Math.min(168, sorted.length);

  if (recentAvg === 0) return [];

  return sorted
    .filter(r => r.consumption > recentAvg * (1 + ANOMALY_THRESHOLD))
    .map(r => ({
      id:        `alert-${r.id}`,
      vehicleId: r.vehicleId,
      severity:  r.consumption > recentAvg * 1.3 ? 'critical' : 'high',
      message:   `Fuel consumption ${((r.consumption / recentAvg - 1) * 100).toFixed(0)}% above 7-day average`,
      threshold: Math.round(recentAvg * (1 + ANOMALY_THRESHOLD) * 10) / 10,
      actual:    r.consumption,
      isRead:    false,
      createdAt: r.recordedAt,
    } satisfies FuelAlert));
}

interface IFuelService {
  getReadings(vehicleId?: string): Promise<ApiResponse<FuelReading[]>>;
  getAlerts(vehicleId?: string): Promise<ApiResponse<FuelAlert[]>>;
  getTrends(vehicleId?: string): Promise<ApiResponse<FuelEfficiencyTrend[]>>;
}

const mockFuelService: IFuelService = {
  async getReadings(vehicleId) {
    await simulateDelay();
    await simulateError(0.01);
    let results = [...mockFuelReadings];
    if (vehicleId) {
      results = results.filter(r => r.vehicleId === vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  },

  async getAlerts(vehicleId) {
    await simulateDelay();
    // Run anomaly detection utility on the readings to construct alerts dynamically
    let alerts: FuelAlert[] = [];
    
    // Find unique vehicle IDs
    const vehicleIds = vehicleId ? [vehicleId] : Array.from(new Set(mockFuelReadings.map(r => r.vehicleId)));
    
    vehicleIds.forEach((vId) => {
      const vAlerts = detectFuelAnomalies(mockFuelReadings, vId);
      alerts.push(...vAlerts);
    });

    // Sort alerts by createdAt desc
    alerts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return { data: alerts, message: 'OK', success: true };
  },

  async getTrends(vehicleId) {
    await simulateDelay();
    let results = [...mockFuelTrends];
    if (vehicleId) {
      results = results.filter(t => t.vehicleId === vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  }
};

const realFuelService: IFuelService = {
  getReadings: (vehicleId) => http.get('/fuel/readings', { params: { vehicleId } }),
  getAlerts:   (vehicleId) => http.get('/fuel/alerts', { params: { vehicleId } }),
  getTrends:   (vehicleId) => http.get('/fuel/trends', { params: { vehicleId } }),
};

export const fuelService: IFuelService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realFuelService
    : mockFuelService;

export default fuelService;
