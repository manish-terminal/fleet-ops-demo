import React from 'react';
import type { ExpenseEntry, ExpenseCategory } from '@/types/finance';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { mockVehicles } from '@/mocks/vehicles';
import { Receipt } from 'lucide-react';

interface ExpenseLogProps {
  entries: ExpenseEntry[];
  isLoading?: boolean;
}

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  fuel: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  maintenance: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  toll: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  driver_wage: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  insurance: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

export function ExpenseLog({ entries, isLoading }: ExpenseLogProps) {
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

  const columns: Column<ExpenseEntry>[] = [
    {
      key: 'category',
      header: 'Category',
      cell: (row) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${CATEGORY_COLORS[row.category]}`}>
          {row.category.replace('_', ' ')}
        </span>
      ),
      width: 'w-32',
    },
    {
      key: 'description',
      header: 'Description',
      cell: (row) => <span className="text-slate-300 font-medium text-xs">{row.description}</span>,
    },
    {
      key: 'vehicleId',
      header: 'Vehicle Plate',
      cell: (row) => <span className="text-slate-400 text-xs">{getVehiclePlate(row.vehicleId)}</span>,
    },
    {
      key: 'recordedAt',
      header: 'Expense Date',
      cell: (row) => <span className="text-slate-400 text-xs">{new Date(row.recordedAt).toLocaleDateString()}</span>,
    },
    {
      key: 'amount',
      header: 'Amount (INR)',
      cell: (row) => <span className="font-bold text-red-400">{formatCurrency(row.amount)}</span>,
    },
    {
      key: 'receiptUrl',
      header: 'Receipt',
      cell: (row) => row.receiptUrl ? (
        <a 
          href={row.receiptUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-brand-400 hover:text-brand-300 font-bold text-xs inline-flex items-center gap-1"
        >
          <Receipt className="h-3.5 w-3.5" /> View
        </a>
      ) : (
        <span className="text-slate-600 text-xs">-</span>
      ),
      width: 'w-24',
    }
  ];

  return <DataTable columns={columns} data={entries} isLoading={isLoading} />;
}
export default ExpenseLog;
