import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Vehicle } from '@/types/vehicle';
import 'leaflet/dist/leaflet.css';
import { TruckStatusBadge } from './TruckStatusBadge';

interface FleetMapProps {
  vehicles: Vehicle[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

const STATUS_HEX = {
  in_transit: '#3B82F6', 
  idle: '#F59E0B',       
  maintenance: '#EF4444',
  offline: '#94A3B8',    
};

function createTruckIcon(status: keyof typeof STATUS_HEX) {
  const color = STATUS_HEX[status] || STATUS_HEX.offline;
  
  const svgMarkup = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="none">
      <circle cx="12" cy="12" r="9" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="${color}"/>
    </svg>
  `;
  
  return L.divIcon({
    html: svgMarkup,
    className: 'custom-truck-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -10]
  });
}

// Controller component to center the map when selectedVehicleId changes
function MapController({ selectedVehicle }: { selectedVehicle: Vehicle | null }) {
  const map = useMap();

  useEffect(() => {
    if (selectedVehicle?.currentLocation) {
      const { lat, lng } = selectedVehicle.currentLocation;
      map.setView([lat, lng], 10, { animate: true, duration: 1 });
    }
  }, [selectedVehicle, map]);

  return null;
}

export function FleetMap({ vehicles, selectedVehicleId, onSelectVehicle }: FleetMapProps) {
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
  
  // Default coordinates to center of India (Nagpur)
  const defaultCenter: [number, number] = [21.1458, 79.0882];
  const defaultZoom = 5;

  const activeVehicles = vehicles.filter(v => v.currentLocation !== null);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border border-slate-800/80 bg-slate-950 relative min-h-[400px]">
      <MapContainer
        // @ts-ignore
        center={defaultCenter}
        zoom={defaultZoom}
        zoomControl={true}
        className="w-full h-full z-0 bg-slate-950"
      >
        <TileLayer
          // Premium dark-mode themed openstreetmap style map tiling (CartoDB Dark Matter)
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {activeVehicles.map((vehicle) => {
          const loc = vehicle.currentLocation!;
          return (
            <Marker
              key={vehicle.id}
              position={[loc.lat, loc.lng]}
              icon={createTruckIcon(vehicle.status)}
              eventHandlers={{
                click: () => onSelectVehicle(vehicle.id),
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-2 text-slate-200">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-sm text-slate-100">{vehicle.plateNumber}</span>
                    <TruckStatusBadge status={vehicle.status} />
                  </div>
                  <p className="text-xs text-slate-400">{vehicle.make} {vehicle.model}</p>
                  <div className="text-[10px] space-y-1 text-slate-400 font-mono">
                    <p>Speed: {loc.speed || 0} km/h</p>
                    <p>Fuel: {vehicle.fuelLevel}%</p>
                    {loc.heading !== undefined && <p>Heading: {loc.heading}°</p>}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        <MapController selectedVehicle={selectedVehicle} />
      </MapContainer>
    </div>
  );
}
export default FleetMap;
