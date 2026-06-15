import { ListParams } from './api';
import { GeoPoint } from './vehicle';

export type BookingStatus = 'draft' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface RoutePoint {
  label:   string;
  address: string;
  coords:  GeoPoint;
}

export interface BookingCost {
  baseFare:       number;
  fuelSurcharge:  number;
  tollFees:       number;
  driverWage:     number;
  total:          number;
  currency:       string;
}

export interface Booking {
  id:             string;
  bookingNumber:  string;     // BK-YYYYMMDD-XXX
  customerId:     string;
  customerName:   string;
  customerPhone:  string;
  vehicleId:      string;
  driverId:       string;
  origin:         RoutePoint;
  destination:    RoutePoint;
  stops:          RoutePoint[];
  status:         BookingStatus;
  cost:           BookingCost;
  scheduledAt:    string;     // ISO 8601
  completedAt:    string | null;
  notes:          string | null;
  createdAt:      string;
  updatedAt:      string;
}

export interface BookingListParams extends ListParams {
  status?: BookingStatus;
  vehicleId?: string;
  driverId?: string;
}
