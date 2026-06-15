import { ListParams } from './api';

export type VehicleStatus = 'in_transit' | 'idle' | 'maintenance' | 'offline';

export interface GeoPoint {
  lat:      number;
  lng:      number;
  heading?: number;   // degrees 0-360
  speed?:   number;   // km/h
}

export interface Vehicle {
  id:              string;
  plateNumber:     string;
  make:            string;
  model:           string;
  year:            number;
  color:           string;
  status:          VehicleStatus;
  currentLocation: GeoPoint | null;
  assignedDriverId: string | null;
  fuelLevel:       number;     // 0-100 %
  mileage:         number;     // total km
  lastSeen:        string;     // ISO 8601
  createdAt:       string;
}

export interface VehicleListParams extends ListParams {
  status?: VehicleStatus;
  driverId?: string;
}
