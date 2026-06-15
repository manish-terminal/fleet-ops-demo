import type { TruckRouteOptimisation, ReturnTripOpportunity } from '@/types/route';
import type { ApiResponse } from '@/types/api';
import { mockTruckOptimisations } from '@/mocks/routes';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { http } from './http';

interface GlobalMetrics {
  emptyKmPercentage: number;
  revenueLost: number;
  matchRate: number;
}

interface IRouteService {
  getTruckOptimisations(vehicleId?: string): Promise<ApiResponse<TruckRouteOptimisation[]>>;
  dispatchReturnLoad(vehicleId: string, opportunityId: string): Promise<ApiResponse<TruckRouteOptimisation>>;
  getGlobalMetrics(): Promise<ApiResponse<GlobalMetrics>>;
}

const mockRouteService: IRouteService = {
  async getTruckOptimisations(vehicleId) {
    await simulateDelay();
    await simulateError(0.01);
    let results = [...mockTruckOptimisations];
    if (vehicleId) {
      results = results.filter(o => o.vehicleId === vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  },

  async dispatchReturnLoad(vehicleId, opportunityId) {
    await simulateDelay(600);
    const idx = mockTruckOptimisations.findIndex(o => o.vehicleId === vehicleId);
    if (idx === -1) {
      throw { code: 'NOT_FOUND', message: `Truck details for vehicle ${vehicleId} not found`, details: null };
    }
    
    mockTruckOptimisations[idx] = {
      ...mockTruckOptimisations[idx],
      returnLoadBooked: true,
      bookedOpportunityId: opportunityId,
    };

    return { data: mockTruckOptimisations[idx], message: 'Return load dispatched successfully', success: true };
  },

  async getGlobalMetrics() {
    await simulateDelay();
    
    // Calculate dynamically based on mock data
    let totalOutboundKm = 0;
    let totalEmptyKm = 0;
    let totalRevenueLost = 0;
    let matchableTrucks = 0;

    mockTruckOptimisations.forEach((opt) => {
      if (opt.currentTrip) {
        totalOutboundKm += opt.currentTrip.distanceKm;
        
        if (!opt.returnLoadBooked) {
          totalEmptyKm += opt.emptyReturnKm;
          totalRevenueLost += opt.revenueLost;
        }

        if (opt.opportunities.length > 0 && !opt.returnLoadBooked) {
          matchableTrucks++;
        }
      }
    });

    // Without return loads, empty km would be 50% of total run (100% outbound + 100% return empty)
    // If return loads are booked, empty km decreases
    const totalRunsKm = totalOutboundKm * 2;
    const emptyKmPercentage = totalRunsKm > 0 ? Math.round((totalEmptyKm / totalRunsKm) * 1000) / 10 : 34.5;
    const matchRate = mockTruckOptimisations.length > 0 
      ? Math.round((matchableTrucks / mockTruckOptimisations.length) * 100) 
      : 85;

    return {
      data: {
        emptyKmPercentage,
        revenueLost: totalRevenueLost,
        matchRate,
      },
      message: 'OK',
      success: true
    };
  }
};

const realRouteService: IRouteService = {
  getTruckOptimisations: (vehicleId) => http.get('/routes/optimisations', { params: { vehicleId } }),
  dispatchReturnLoad:    (vehicleId, opportunityId) => http.post('/routes/dispatch-return', { vehicleId, opportunityId }),
  getGlobalMetrics:      () => http.get('/routes/metrics'),
};

export const routeService: IRouteService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realRouteService
    : mockRouteService;

export default routeService;
