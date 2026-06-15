import React from 'react';
import type { FuelAlert } from '@/types/fuel';
import { AlertTriangle, ShieldAlert } from 'lucide-react';
import { mockVehicles } from '@/mocks/vehicles';

interface FuelAlertBannerProps {
  alerts: FuelAlert[];
}

export function FuelAlertBanner({ alerts }: FuelAlertBannerProps) {
  const getPlateNumber = (vId: string) => {
    return mockVehicles.find(v => v.id === vId)?.plateNumber || vId;
  };

  const getVehicleModel = (vId: string) => {
    const v = mockVehicles.find(v => v.id === vId);
    return v ? `${v.make} ${v.model}` : '';
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const plate = getPlateNumber(alert.vehicleId);
        const model = getVehicleModel(alert.vehicleId);

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
              isCritical
                ? 'bg-red-500/10 border-red-500/30 text-red-200 shadow-lg shadow-red-500/5 hover:bg-red-500/15'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-200 hover:bg-amber-500/15'
            }`}
          >
            <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-amber-500/20 text-amber-400'}`}>
              {isCritical ? <ShieldAlert className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
            </div>
            
            <div className="flex-1 space-y-1 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  {isCritical ? 'Critical Anomaly Detected' : 'High Fuel Consumption Warning'}
                </h4>
                <span className="text-[10px] font-mono opacity-60">
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-100">
                Vehicle: {plate} ({model})
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {alert.message}. Recorded consumption: <strong className="text-slate-200">{alert.actual} L/100km</strong> (expected threshold: {alert.threshold} L/100km).
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default FuelAlertBanner;
