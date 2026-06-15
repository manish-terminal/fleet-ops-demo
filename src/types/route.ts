import { GeoPoint } from './vehicle';

export interface ReturnTripOpportunity {
  id:                string;
  origin:            string;
  destination:       string;
  customerName:      string;
  loadType:          string;
  revenue:           number; // in INR
  distanceKm:        number;
  estimatedDuration: number; // in minutes
  score:             number; // match score (0-100)
  waypoints:         GeoPoint[];
}

export interface TruckRouteOptimisation {
  vehicleId:     string;
  plateNumber:   string;
  currentTrip: {
    origin:      string;
    destination: string;
    revenue:     number;
    distanceKm:  number;
    waypoints:   GeoPoint[];
  } | null;
  emptyReturnKm: number;
  revenueLost:   number;
  opportunities: ReturnTripOpportunity[];
  returnLoadBooked?: boolean;
  bookedOpportunityId?: string | null;
}
