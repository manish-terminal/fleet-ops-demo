import type { Vehicle, VehicleListParams } from '@/types/vehicle';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { mockVehicles } from '@/mocks/vehicles';
import { simulateDelay, simulateError, paginate, filterBySearch } from '@/utils/mockHelpers';
import { http } from './http';

interface IVehicleService {
  getAll(params?: VehicleListParams): Promise<PaginatedResponse<Vehicle>>;
  getById(id: string): Promise<ApiResponse<Vehicle>>;
  create(data: Omit<Vehicle, 'id' | 'createdAt'>): Promise<ApiResponse<Vehicle>>;
  update(id: string, data: Partial<Vehicle>): Promise<ApiResponse<Vehicle>>;
  delete(id: string): Promise<ApiResponse<null>>;
  getLiveLocations(): Promise<ApiResponse<Vehicle[]>>;
}

const mockVehicleService: IVehicleService = {
  async getAll(params = {}) {
    await simulateDelay();
    await simulateError(0.01);

    let results = [...mockVehicles];

    if (params.status) {
      results = results.filter(v => v.status === params.status);
    }
    if (params.driverId) {
      results = results.filter(v => v.assignedDriverId === params.driverId);
    }
    if (params.search) {
      results = filterBySearch(results, params.search, ['plateNumber', 'make', 'model']);
    }

    if (params.sortBy) {
      results.sort((a, b) => {
        const dir = params.sortDir === 'desc' ? -1 : 1;
        const valA = String(a[params.sortBy as keyof Vehicle] || '');
        const valB = String(b[params.sortBy as keyof Vehicle] || '');
        return valA.localeCompare(valB) * dir;
      });
    }

    return paginate(results, params.page ?? 1, params.limit ?? 10);
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
    await simulateDelay(200);
    const located = mockVehicles.filter(v => v.currentLocation !== null);
    return { data: located, message: 'OK', success: true };
  },
};

const realVehicleService: IVehicleService = {
  getAll:           (params) => http.get('/vehicles', { params }),
  getById:          (id)     => http.get(`/vehicles/${id}`),
  create:           (data)   => http.post('/vehicles', data),
  update:           (id, data) => http.patch(`/vehicles/${id}`, data),
  delete:           (id)     => http.delete(`/vehicles/${id}`),
  getLiveLocations: ()       => http.get('/vehicles/locations/live'),
};

export const vehicleService: IVehicleService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realVehicleService
    : mockVehicleService;
