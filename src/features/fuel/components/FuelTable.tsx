import React from 'react';
import type { Vehicle } from '@/types/vehicle';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { TruckStatusBadge } from '@/features/fleet/components/TruckStatusBadge';

interface FuelTableProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  selectedVehicleId: string | null;
  onSelectVehicle: (id: string) => void;
}

export function FuelTable({
  vehicles,
  isLoading,
  selectedVehicleId,
  onSelectVehicle,
}: FuelTableProps) {
  const columns: Column<Vehicle>[] = [
    {
      key: 'plateNumber',
      header: 'Plate Number',
      cell: (row) => <span className="font-bold text-slate-100">{row.plateNumber}</span>,
      width: 'w-32',
    },
    {
      key: 'make',
      header: 'Vehicle Model',
      cell: (row) => <span className="text-slate-300 font-medium">{row.make} {row.model}</span>,
    },
    {
      key: 'fuelLevel',
      header: 'Fuel level (%)',
      cell: (row) => {
        const isLow = row.fuelLevel < 20;
        const isMedium = row.fuelLevel >= 20 && row.fuelLevel < 50;
        
        let barColor = 'bg-emerald-500';
        let textColor = 'text-emerald-400';
        if (isLow) {
          barColor = 'bg-red-500';
          textColor = 'text-red-400';
        } else if (isMedium) {
          barColor = 'bg-amber-500';
          textColor = 'text-amber-400';
        }

        return (
          <div className="flex items-center gap-3 min-w-[120px]">
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className={`h-full ${barColor} transition-all duration-500`} 
                style={{ width: `${row.fuelLevel}%` }} 
              />
            </div>
            <span className={`text-xs font-mono font-bold ${textColor} w-10 shrink-0`}>
              {row.fuelLevel}%
            </span>
          </div>
        );
      },
    },
    {
      key: 'mileage',
      header: 'Total Mileage',
      cell: (row) => <span className="font-mono text-slate-400">{row.mileage.toLocaleString()} km</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <TruckStatusBadge status={row.status} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={vehicles}
      isLoading={isLoading}
      onRowClick={(row) => onSelectVehicle(row.id)}
      rowClassName={(row: Vehicle) => 
        selectedVehicleId === row.id 
          ? 'bg-brand-600/10 border-brand-500/20 hover:bg-brand-600/15' 
          : ''
      }
    />
  );
}
export default FuelTable;
