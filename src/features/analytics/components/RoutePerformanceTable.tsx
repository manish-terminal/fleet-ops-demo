import React from 'react';
import type { RoutePerformance } from '@/types/analytics';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { Clock } from 'lucide-react';

interface RoutePerformanceTableProps {
  data: RoutePerformance[];
  isLoading?: boolean;
}

export function RoutePerformanceTable({ data, isLoading }: RoutePerformanceTableProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const columns: Column<RoutePerformance>[] = [
    {
      key: 'route',
      header: 'Route Corridor',
      cell: (row) => <span className="font-bold text-slate-100">{row.route}</span>,
    },
    {
      key: 'revenue',
      header: 'Revenue',
      cell: (row) => <span className="font-medium text-slate-300">{formatCurrency(row.revenue)}</span>,
    },
    {
      key: 'expenses',
      header: 'Expenses',
      cell: (row) => <span className="text-slate-400">{formatCurrency(row.expenses)}</span>,
    },
    {
      key: 'profitability',
      header: 'Profit Margin',
      cell: (row) => {
        const isHigh = row.profitability >= 35;
        return (
          <span className={`font-bold ${isHigh ? 'text-emerald-400' : 'text-blue-400'}`}>
            {row.profitability}%
          </span>
        );
      },
    },
    {
      key: 'delays',
      header: 'Avg Traffic Delay',
      cell: (row) => (
        <span className="text-slate-400 font-medium inline-flex items-center gap-1">
          <Clock className="h-3 w-3 text-slate-500" /> {row.delays} mins
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}
export default RoutePerformanceTable;
