import React from 'react';
import type { TruckRouteOptimisation } from '@/types/route';
import { Truck, ArrowRight, AlertTriangle, BadgeAlert, Landmark } from 'lucide-react';

interface RouteFormProps {
  optimisations: TruckRouteOptimisation[];
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
  isLoading?: boolean;
}

export function RouteForm({
  optimisations,
  selectedVehicleId,
  onSelectVehicle,
  isLoading,
}: RouteFormProps) {
  const selectedOpt = optimisations.find(o => o.vehicleId === selectedVehicleId) || null;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-5 text-left bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 relative overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Truck className="h-5 w-5 text-brand-400" />
        <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">Select Vehicle for Backhaul</h3>
      </div>

      <div className="space-y-4">
        {/* Dropdown Selector */}
        <div className="space-y-1">
          <label className="text-xs text-slate-400 font-semibold block">Select Active Outbound Truck</label>
          <select
            value={selectedVehicleId || ''}
            onChange={(e) => onSelectVehicle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
          >
            <option value="">Choose a Truck</option>
            {optimisations.map((opt) => (
              <option key={opt.vehicleId} value={opt.vehicleId}>
                {opt.plateNumber} ({opt.currentTrip ? `${opt.currentTrip.origin.split(',')[0]} ➔ ${opt.currentTrip.destination.split(',')[0]}` : 'Idle'})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Truck Outbound Vitals Details */}
        {selectedOpt && selectedOpt.currentTrip && (
          <div className="space-y-3.5 border-t border-slate-800/60 pt-4">
            
            {/* Outbound route info */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Outbound Segment</span>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <span className="text-brand-400">{selectedOpt.currentTrip.origin.split(',')[0]}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                <span className="text-emerald-400">{selectedOpt.currentTrip.destination.split(',')[0]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                <div>Distance: {selectedOpt.currentTrip.distanceKm} km</div>
                <div className="text-right text-emerald-400 font-bold">Revenue: {formatCurrency(selectedOpt.currentTrip.revenue)}</div>
              </div>
            </div>

            {/* Empty backhaul warning */}
            {!selectedOpt.returnLoadBooked ? (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-red-300 text-xs">
                <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold uppercase text-[10px] tracking-wider">Empty Backhaul Alert</p>
                  <p className="text-red-400/80 leading-relaxed">
                    This truck will return empty from <strong>{selectedOpt.currentTrip.destination.split(',')[0]}</strong>, wasting {selectedOpt.emptyReturnKm} km and causing <strong className="text-red-300">{formatCurrency(selectedOpt.revenueLost)}</strong> in lost yield.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs">
                <BadgeAlert className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold uppercase text-[10px] tracking-wider">Backhaul Optimized</p>
                  <p className="text-emerald-400/80 leading-relaxed">
                    A return cargo match has been successfully dispatched for this truck! No empty kilometers scheduled.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default RouteForm;
