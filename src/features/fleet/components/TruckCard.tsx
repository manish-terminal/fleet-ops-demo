import React from 'react';
import type { Vehicle } from '@/types/vehicle';
import { TruckStatusBadge } from './TruckStatusBadge';
import { Fuel, Milestone, Clock, User } from 'lucide-react';
import { cn } from '@/utils/cn';

interface TruckCardProps {
  vehicle: Vehicle;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function TruckCard({ vehicle, isSelected, onSelect }: TruckCardProps) {
  return (
    <div
      onClick={() => onSelect?.(vehicle.id)}
      className={cn(
        'glass-panel rounded-xl p-5 cursor-pointer select-none transition-all duration-200 border text-left',
        isSelected
          ? 'border-brand-500 bg-slate-900 shadow-lg shadow-brand-500/5'
          : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700/80'
      )}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-100">{vehicle.plateNumber}</h4>
          <p className="text-xs text-slate-400 mt-0.5">{vehicle.make} {vehicle.model}</p>
        </div>
        <TruckStatusBadge status={vehicle.status} />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-medium mb-4">
        <div className="flex items-center gap-2">
          <Milestone className="h-3.5 w-3.5 text-slate-500" />
          <span>{vehicle.mileage.toLocaleString()} km</span>
        </div>
        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-slate-500" />
          <span className="truncate">{vehicle.assignedDriverId || 'Unassigned'}</span>
        </div>
      </div>

      {/* Fuel indicator */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-bold">
          <span className="flex items-center gap-1 text-slate-500">
            <Fuel className="h-3 w-3" /> Fuel Level
          </span>
          <span className={cn(
            vehicle.fuelLevel < 20 ? 'text-red-400 font-extrabold' : 'text-slate-300'
          )}>
            {vehicle.fuelLevel}%
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-900">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              vehicle.fuelLevel < 20
                ? 'bg-red-500'
                : vehicle.fuelLevel < 50
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            )}
            style={{ width: `${vehicle.fuelLevel}%` }}
          />
        </div>
      </div>

      {/* Last seen */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
        <Clock className="h-3 w-3 shrink-0" />
        <span>Seen: {new Date(vehicle.lastSeen).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
export default TruckCard;
