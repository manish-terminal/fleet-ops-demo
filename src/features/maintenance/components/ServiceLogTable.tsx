import React from 'react';
import type { ServiceLog } from '@/types/maintenance';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { mockVehicles } from '@/mocks/vehicles';

interface ServiceLogTableProps {
  logs: ServiceLog[];
  isLoading?: boolean;
}

export function ServiceLogTable({ logs, isLoading }: ServiceLogTableProps) {
  const getVehiclePlate = (vId: string) => {
    return mockVehicles.find(v => v.id === vId)?.plateNumber || vId;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const columns: Column<ServiceLog>[] = [
    {
      key: 'performedAt',
      header: 'Service Date',
      cell: (row) => <span className="text-slate-400 text-xs">{new Date(row.performedAt).toLocaleDateString()}</span>,
    },
    {
      key: 'serviceType',
      header: 'Service Type',
      cell: (row) => {
        let label = row.serviceType.replace('_', ' ');
        label = label.charAt(0).toUpperCase() + label.slice(1);
        return <span className="text-slate-300 font-bold text-xs">{label}</span>;
      },
    },
    {
      key: 'description',
      header: 'Description details',
      cell: (row) => <span className="text-slate-400 text-xs leading-relaxed max-w-xs block truncate">{row.description}</span>,
    },
    {
      key: 'vehicleId',
      header: 'Vehicle',
      cell: (row) => <span className="text-slate-300 font-semibold text-xs">{getVehiclePlate(row.vehicleId)}</span>,
    },
    {
      key: 'mileageAt',
      header: 'Odometer',
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.mileageAt.toLocaleString()} km</span>,
    },
    {
      key: 'cost',
      header: 'Cost (INR)',
      cell: (row) => <span className="font-bold text-slate-200">{formatCurrency(row.cost)}</span>,
    },
    {
      key: 'provider',
      header: 'Workshop Provider',
      cell: (row) => <span className="text-slate-500 text-xs">{row.provider}</span>,
    },
  ];

  return <DataTable columns={columns} data={logs} isLoading={isLoading} />;
}
export default ServiceLogTable;
