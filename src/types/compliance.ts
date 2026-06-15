export type LicenceStatus = 'valid' | 'expiring' | 'expired';
export type DocumentType = 'vehicle_licence' | 'roadworthy' | 'insurance' | 'permit';

export interface ComplianceRecord {
  id:           string;
  vehicleId:    string;
  vehiclePlate: string;
  documentType: DocumentType;
  documentNumber: string;
  status:       LicenceStatus;
  issuedAt:     string;
  expiresAt:    string;
  reminderSentAt: string | null;
  notes:        string | null;
}
