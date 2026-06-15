import React from 'react';
import type { ComplianceRecord } from '@/types/compliance';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { LicenceBadge } from './LicenceBadge';
import { differenceInDays } from 'date-fns';
import { RefreshCw } from 'lucide-react';

interface ComplianceTableProps {
  records: ComplianceRecord[];
  isLoading?: boolean;
  onRenew?: (id: string) => void;
  isRenewing?: boolean;
}

export function ComplianceTable({
  records,
  isLoading,
  onRenew,
  isRenewing,
}: ComplianceTableProps) {
  const columns: Column<ComplianceRecord>[] = [
    {
      key: 'vehiclePlate',
      header: 'Plate Number',
      cell: (row) => <span className="font-bold text-slate-100">{row.vehiclePlate}</span>,
      width: 'w-32',
    },
    {
      key: 'documentType',
      header: 'Document Type',
      cell: (row) => {
        let label = row.documentType.replace('_', ' ');
        label = label.charAt(0).toUpperCase() + label.slice(1);
        return <span className="text-slate-300 font-semibold text-xs">{label}</span>;
      },
    },
    {
      key: 'documentNumber',
      header: 'Doc Number',
      cell: (row) => <span className="font-mono text-slate-400 text-xs">{row.documentNumber}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <LicenceBadge status={row.status} />,
      width: 'w-36',
    },
    {
      key: 'expiresAt',
      header: 'Expiry Date',
      cell: (row) => <span className="text-slate-400 text-xs">{new Date(row.expiresAt).toLocaleDateString()}</span>,
    },
    {
      key: 'daysLeft',
      header: 'Days Left',
      cell: (row) => {
        const days = differenceInDays(new Date(row.expiresAt), new Date());
        const isExpired = days < 0;
        
        return (
          <span className={`font-bold font-mono text-xs ${isExpired ? 'text-red-400' : days <= 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {isExpired ? `Expired (${Math.abs(days)})` : `${days} days`}
          </span>
        );
      },
    },
    {
      key: 'actions',
      header: 'Actions',
      cell: (row) => {
        const isCompliant = row.status === 'valid';
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRenew?.(row.id);
            }}
            disabled={isRenewing}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] font-bold transition-all duration-200 select-none ${
              isCompliant
                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                : 'bg-brand-600/10 border-brand-500/30 text-brand-400 hover:bg-brand-600/20'
            }`}
          >
            <RefreshCw className="h-3 w-3" /> Renew
          </button>
        );
      },
      width: 'w-24',
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={records}
      isLoading={isLoading}
    />
  );
}
export default ComplianceTable;
