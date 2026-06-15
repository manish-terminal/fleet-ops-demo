import type { ComplianceRecord, LicenceStatus } from '@/types/compliance';
import type { ApiResponse } from '@/types/api';
import { mockComplianceRecords } from '@/mocks/compliance';
import { simulateDelay, simulateError } from '@/utils/mockHelpers';
import { differenceInDays, addYears } from 'date-fns';
import { http } from './http';

const WARNING_DAYS = 30;

export function calculateComplianceStatus(expiresAt: string): LicenceStatus {
  const daysUntilExpiry = differenceInDays(new Date(expiresAt), new Date());
  if (daysUntilExpiry < 0)             return 'expired';
  if (daysUntilExpiry <= WARNING_DAYS) return 'expiring';
  return 'valid';
}

interface IComplianceService {
  getAll(params?: { status?: LicenceStatus; vehicleId?: string }): Promise<ApiResponse<ComplianceRecord[]>>;
  renew(id: string): Promise<ApiResponse<ComplianceRecord>>;
}

const mockComplianceService: IComplianceService = {
  async getAll(params = {}) {
    await simulateDelay();
    await simulateError(0.01);
    
    // Recalculate status on-the-fly to ensure dynamic correctness based on current local date
    let results = mockComplianceRecords.map(rec => ({
      ...rec,
      status: calculateComplianceStatus(rec.expiresAt)
    }));

    if (params.status) {
      results = results.filter(r => r.status === params.status);
    }
    if (params.vehicleId) {
      results = results.filter(r => r.vehicleId === params.vehicleId);
    }
    return { data: results, message: 'OK', success: true };
  },

  async renew(id) {
    await simulateDelay(300);
    const idx = mockComplianceRecords.findIndex(r => r.id === id);
    if (idx === -1) {
      throw { code: 'NOT_FOUND', message: `Compliance document ${id} not found`, details: null };
    }

    const current = mockComplianceRecords[idx];
    const newExpiry = addYears(new Date(), 1).toISOString(); // Extend by 1 year from now
    
    mockComplianceRecords[idx] = {
      ...current,
      expiresAt: newExpiry,
      status: 'valid',
      issuedAt: new Date().toISOString(),
      reminderSentAt: null,
      notes: `Renewed on ${new Date().toLocaleDateString()}`,
    };

    return { data: mockComplianceRecords[idx], message: 'Document renewed successfully', success: true };
  }
};

const realComplianceService: IComplianceService = {
  getAll: (params) => http.get('/compliance', { params }),
  renew:  (id)     => http.post(`/compliance/${id}/renew`),
};

export const complianceService: IComplianceService =
  // @ts-ignore
  import.meta.env.VITE_ENABLE_REAL_API === 'true'
    ? realComplianceService
    : mockComplianceService;

export default complianceService;
