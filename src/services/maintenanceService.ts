import type { EngineHealth, MaintenanceAlert, ServiceLog } from '@/types/maintenance';
import type { ApiResponse } from '@/types/api';
import { mockEngineHealth, mockMaintenanceAlerts, mockServiceLogs } from '@/mocks/maintenance';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

interface IMaintenanceService {
  getEngineHealth(vehicleId?: string): Promise<ApiResponse<EngineHealth[]>>;
  getAlerts(vehicleId?: string): Promise<ApiResponse<MaintenanceAlert[]>>;
  getServiceLogs(vehicleId?: string): Promise<ApiResponse<ServiceLog[]>>;
  performService(vehicleId: string, alertId: string): Promise<ApiResponse<ServiceLog>>;
}

const mockMaintenanceService: IMaintenanceService = {
  async getEngineHealth(vehicleId) {
    await simulateDelay();
    await simulateError(0.01);
    let results = [...mockEngineHealth];
    if (vehicleId) {
      results = results.filter(h => h.vehicleId === vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  },

  async getAlerts(vehicleId) {
    await simulateDelay();
    let results = [...mockMaintenanceAlerts];
    if (vehicleId) {
      results = results.filter(a => a.vehicleId === vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  },

  async getServiceLogs(vehicleId) {
    await simulateDelay();
    let results = [...mockServiceLogs];
    if (vehicleId) {
      results = results.filter(l => l.vehicleId === vehicleId);
    }
    // Sort logs by performedAt desc
    results.sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
    return { data: results, message: 'OK', success: true };
  },

  async performService(vehicleId, alertId) {
    await simulateDelay(600);
    
    // Find and remove alert
    const alertIdx = mockMaintenanceAlerts.findIndex(a => a.id === alertId);
    let alertType: any = 'full_service';
    let alertMessage = 'Routine service';
    if (alertIdx !== -1) {
      alertType = mockMaintenanceAlerts[alertIdx].type;
      alertMessage = mockMaintenanceAlerts[alertIdx].message;
      mockMaintenanceAlerts.splice(alertIdx, 1);
    }

    // Reset Engine health statistics for the vehicle
    const healthIdx = mockEngineHealth.findIndex(h => h.vehicleId === vehicleId);
    if (healthIdx !== -1) {
      mockEngineHealth[healthIdx] = {
        ...mockEngineHealth[healthIdx],
        oilLevel: 95, // Refill oil
        engineTemp: 84, // Normal temp
        batteryVoltage: 12.6, // Recharge battery
        overallStatus: 'good',
        lastCheckedAt: new Date().toISOString(),
      };
    }

    // Add service log
    const newLog: ServiceLog = {
      id: `log-${Date.now()}`,
      vehicleId,
      serviceType: alertType,
      description: `Completed maintenance task: "${alertMessage}". Performed oil flush, diagnostics reset, and general checks.`,
      cost: alertType === 'oil_change' ? 4800 : alertType === 'tyre_rotation' ? 3600 : 12500, // INR costs
      mileageAt: 142000,
      provider: 'FleetOps Pro Central Workshop, Nagpur',
      performedAt: new Date().toISOString(),
      nextDueAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 120).toISOString(), // next due in 120 days
    };

    mockServiceLogs.push(newLog);

    return { data: newLog, message: 'Maintenance completed successfully', success: true };
  }
};

const realMaintenanceService: IMaintenanceService = {
  getEngineHealth: (vehicleId) => http.get('/maintenance/health', { params: { vehicleId } }),
  getAlerts:       (vehicleId) => http.get('/maintenance/alerts', { params: { vehicleId } }),
  getServiceLogs:  (vehicleId) => http.get('/maintenance/logs', { params: { vehicleId } }),
  performService:  (vehicleId, alertId) => http.post('/maintenance/perform', { vehicleId, alertId }),
};

export const maintenanceService: IMaintenanceService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realMaintenanceService
    : mockMaintenanceService;

export default maintenanceService;
