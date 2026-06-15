import type { Booking, BookingListParams, BookingStatus } from '@/types/booking';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import { mockBookings } from '@/mocks/bookings';
import { simulateDelay, simulateError, paginate, filterBySearch } from '@/utils/mockHelpers';
import { BOOKING_TRANSITIONS } from '@/utils/constants';
import { http } from './http';

interface IBookingService {
  getAll(params?: BookingListParams): Promise<PaginatedResponse<Booking>>;
  getById(id: string): Promise<ApiResponse<Booking>>;
  create(data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Booking>>;
  updateStatus(id: string, status: BookingStatus): Promise<ApiResponse<Booking>>;
}

const mockBookingService: IBookingService = {
  async getAll(params = {}) {
    await simulateDelay();
    await simulateError(0.01);

    let results = [...mockBookings];

    if (params.status) {
      results = results.filter(b => b.status === params.status);
    }
    if (params.vehicleId) {
      results = results.filter(b => b.vehicleId === params.vehicleId);
    }
    if (params.driverId) {
      results = results.filter(b => b.driverId === params.driverId);
    }
    if (params.search) {
      results = filterBySearch(results, params.search, ['bookingNumber', 'customerName', 'customerPhone']);
    }

    if (params.sortBy) {
      results.sort((a, b) => {
        const dir = params.sortDir === 'desc' ? -1 : 1;
        const valA = String(a[params.sortBy as keyof Booking] || '');
        const valB = String(b[params.sortBy as keyof Booking] || '');
        return valA.localeCompare(valB) * dir;
      });
    } else {
      // Default sort by createdAt desc
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return paginate(results, params.page ?? 1, params.limit ?? 10);
  },

  async getById(id) {
    await simulateDelay();
    const booking = mockBookings.find(b => b.id === id);
    if (!booking) throw { code: 'NOT_FOUND', message: `Booking ${id} not found`, details: null };
    return { data: booking, message: 'OK', success: true };
  },

  async create(data) {
    await simulateDelay();
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const sequentialNum = String(mockBookings.length + 1).padStart(3, '0');
    
    const newBooking: Booking = {
      ...data,
      id: `b-${Date.now()}`,
      bookingNumber: `BK-${dateStr}-${sequentialNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockBookings.push(newBooking);
    return { data: newBooking, message: 'Booking created', success: true };
  },

  async updateStatus(id, status) {
    await simulateDelay();
    const idx = mockBookings.findIndex(b => b.id === id);
    if (idx === -1) throw { code: 'NOT_FOUND', message: `Booking ${id} not found`, details: null };
    
    const currentBooking = mockBookings[idx];
    const allowed = BOOKING_TRANSITIONS[currentBooking.status] as unknown as BookingStatus[];
    
    if (!allowed.includes(status)) {
      throw {
        code: 'INVALID_TRANSITION',
        message: `Cannot transition booking from ${currentBooking.status} to ${status}`,
        details: null
      };
    }

    mockBookings[idx] = {
      ...currentBooking,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : currentBooking.completedAt,
      updatedAt: new Date().toISOString(),
    };

    return { data: mockBookings[idx], message: 'Booking status updated', success: true };
  },
};

const realBookingService: IBookingService = {
  getAll:       (params) => http.get('/bookings', { params }),
  getById:      (id)     => http.get(`/bookings/${id}`),
  create:       (data)   => http.post('/bookings', data),
  updateStatus: (id, status) => http.patch(`/bookings/${id}/status`, { status }),
};

export const bookingService: IBookingService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realBookingService
    : mockBookingService;
