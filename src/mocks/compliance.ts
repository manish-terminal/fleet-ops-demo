import type { ComplianceRecord } from '@/types/compliance';
import { mockVehicles } from './vehicles';

// Helper to get plate by vehicleId
const getPlate = (vehicleId: string) => mockVehicles.find(v => v.id === vehicleId)?.plateNumber || 'MH 12 XX 0000';

const now = new Date();

export const mockComplianceRecords: ComplianceRecord[] = [
  {
    id: 'comp-001',
    vehicleId: 'v-001',
    vehiclePlate: getPlate('v-001'),
    documentType: 'vehicle_licence',
    documentNumber: 'LIC-MH12-998822',
    status: 'valid',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 180 days ago
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 185).toISOString(), // expires in 185 days
    reminderSentAt: null,
    notes: 'Renewed online via Vahan portal',
  },
  {
    id: 'comp-002',
    vehicleId: 'v-001',
    vehiclePlate: getPlate('v-001'),
    documentType: 'insurance',
    documentNumber: 'INS-TATA-7733441',
    status: 'expiring',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 350).toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 15).toISOString(), // expires in 15 days
    reminderSentAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    notes: 'Premium renewal quote received from HDFC Ergo',
  },
  {
    id: 'comp-003',
    vehicleId: 'v-002',
    vehiclePlate: getPlate('v-002'),
    documentType: 'roadworthy',
    documentNumber: 'FC-DL01-112233',
    status: 'valid',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 275).toISOString(),
    reminderSentAt: null,
    notes: 'Fitness Certificate cleared at Delhi RTO',
  },
  {
    id: 'comp-004',
    vehicleId: 'v-003',
    vehiclePlate: getPlate('v-003'),
    documentType: 'permit',
    documentNumber: 'NP-KA51-7890AA',
    status: 'expired',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 380).toISOString(),
    expiresAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 15).toISOString(), // expired 15 days ago
    reminderSentAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    notes: 'National Permit expired. Vehicle currently in workshop maintenance.',
  },
  {
    id: 'comp-005',
    vehicleId: 'v-004',
    vehiclePlate: getPlate('v-004'),
    documentType: 'vehicle_licence',
    documentNumber: 'LIC-HR26-224466',
    status: 'valid',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 50).toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 315).toISOString(),
    reminderSentAt: null,
    notes: null,
  },
  {
    id: 'comp-006',
    vehicleId: 'v-006',
    vehiclePlate: getPlate('v-006'),
    documentType: 'insurance',
    documentNumber: 'INS-BHAR-990088',
    status: 'valid',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 120).toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 245).toISOString(),
    reminderSentAt: null,
    notes: 'ICICI Lombard Comprehensive Plan',
  },
  {
    id: 'comp-007',
    vehicleId: 'v-007',
    vehiclePlate: getPlate('v-007'),
    documentType: 'roadworthy',
    documentNumber: 'FC-DL03-776655',
    status: 'expiring',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 340).toISOString(),
    expiresAt: new Date(now.getTime() + 1000 * 60 * 60 * 24 * 25).toISOString(), // expires in 25 days
    reminderSentAt: null,
    notes: 'Inspection slot booked for next Tuesday at RTO',
  },
  {
    id: 'comp-008',
    vehicleId: 'v-008',
    vehiclePlate: getPlate('v-008'),
    documentType: 'permit',
    documentNumber: 'NP-KA03-8888ZZ',
    status: 'expired',
    issuedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 370).toISOString(),
    expiresAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(), // expired 5 days ago
    reminderSentAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    notes: 'State permit needs renewal payment clearance',
  }
];

export default mockComplianceRecords;
