import React from 'react';
import type { RevenueEntry } from '@/types/finance';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { mockVehicles } from '@/mocks/vehicles';

interface RevenueTableProps {
  entries: RevenueEntry[];
  isLoading?: boolean;
}

export function RevenueTable({ entries, isLoading }: RevenueTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getVehiclePlate = (vId: string) => {
    return mockVehicles.find(v => v.id === vId)?.plateNumber || vId;
  };

  const columns: Column<RevenueEntry>[] = [
    {
      key: 'id',
      header: 'Invoice ID',
      cell: (row) => <span className="font-bold font-mono text-slate-100 text-xs">{row.id.toUpperCase()}</span>,
    },
    {
      key: 'bookingId',
      header: 'Booking Ref',
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.bookingId}</span>,
    },
    {
      key: 'vehicleId',
      header: 'Assigned Truck',
      cell: (row) => <span className="text-slate-300 font-semibold text-xs">{getVehiclePlate(row.vehicleId)}</span>,
    },
    {
      key: 'recordedAt',
      header: 'Receipt Date',
      cell: (row) => <span className="text-slate-400 text-xs">{new Date(row.recordedAt).toLocaleDateString()}</span>,
    },
    {
      key: 'amount',
      header: 'Amount (INR)',
      cell: (row) => <span className="font-bold text-emerald-400">{formatCurrency(row.amount)}</span>,
    },
  ];

  return <DataTable columns={columns} data={entries} isLoading={isLoading} />;
}
export default RevenueTable;
