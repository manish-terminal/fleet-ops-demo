import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { GeoPoint } from '@/types/vehicle';
import 'leaflet/dist/leaflet.css';

interface RouteMapProps {
  outboundWaypoints: GeoPoint[];
  returnWaypoints: GeoPoint[];
}

// Controller component to center the map viewport on the combined route bounds
function RouteBoundsController({ waypoints }: { waypoints: GeoPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (waypoints.length > 0) {
      const bounds = L.latLngBounds(waypoints.map(w => [w.lat, w.lng]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.2 });
    }
  }, [waypoints, map]);

  return null;
}

export function RouteMap({ outboundWaypoints, returnWaypoints }: RouteMapProps) {
  const defaultCenter: [number, number] = [21.1458, 79.0882]; // Nagpur
  const defaultZoom = 5;

  const outboundPositions = outboundWaypoints.map(w => [w.lat, w.lng] as [number, number]);
  const returnPositions = returnWaypoints.map(w => [w.lat, w.lng] as [number, number]);

  // Combine waypoints for bounds calculation
  const allWaypoints = [...outboundWaypoints, ...returnWaypoints];

  const startOutbound = outboundWaypoints[0];
  const endOutbound = outboundWaypoints[outboundWaypoints.length - 1];

  const startReturn = returnWaypoints[0];
  const endReturn = returnWaypoints[returnWaypoints.length - 1];

  const markerIcon = (bgColor: string, text: string) => L.divIcon({
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="none">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${bgColor}" stroke="#0F172A" stroke-width="2"/>
          <circle cx="12" cy="9" r="3" fill="#0F172A"/>
        </svg>
        <span style="position: absolute; top: -14px; background: #0F172A; border: 1px solid #1E293B; border-radius: 4px; padding: 1px 4px; font-size: 8px; font-weight: bold; color: ${bgColor}; white-space: nowrap;">
          ${text}
        </span>
      </div>
    `,
    className: 'custom-route-marker',
    iconSize: [28, 40],
    iconAnchor: [14, 28],
  });

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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        {/* Draw Outbound Path */}
        {outboundPositions.length > 0 && (
          <Polyline positions={outboundPositions} color="#3B82F6" weight={4} opacity={0.8} />
        )}

        {/* Draw Return Path */}
        {returnPositions.length > 0 && (
          <Polyline positions={returnPositions} color="#10B981" weight={4} opacity={0.8} dashArray="5, 5" />
        )}

        {/* Outbound Markers */}
        {startOutbound && (
          <Marker position={[startOutbound.lat, startOutbound.lng]} icon={markerIcon('#3B82F6', 'Outbound Start')}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-slate-100 block">Outbound Origin</strong>
                <span className="text-slate-400">Lat: {startOutbound.lat}, Lng: {startOutbound.lng}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {endOutbound && (
          <Marker position={[endOutbound.lat, endOutbound.lng]} icon={markerIcon('#3B82F6', 'Outbound Destination')}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-slate-100 block">Outbound Destination</strong>
                <span className="text-slate-400">Lat: {endOutbound.lat}, Lng: {endOutbound.lng}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Return Markers */}
        {startReturn && (
          <Marker position={[startReturn.lat, startReturn.lng]} icon={markerIcon('#10B981', 'Return Pickup')}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-slate-100 block">Return Load Cargo Pickup</strong>
                <span className="text-slate-400">Lat: {startReturn.lat}, Lng: {startReturn.lng}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {endReturn && (
          <Marker position={[endReturn.lat, endReturn.lng]} icon={markerIcon('#10B981', 'Return Dropoff')}>
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-slate-100 block">Return Dropoff Point</strong>
                <span className="text-slate-400">Lat: {endReturn.lat}, Lng: {endReturn.lng}</span>
              </div>
            </Popup>
          </Marker>
        )}

        {allWaypoints.length > 0 && <RouteBoundsController waypoints={allWaypoints} />}
      </MapContainer>
    </div>
  );
}
export default RouteMap;
