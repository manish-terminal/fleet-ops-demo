import React from 'react';
import { cn } from '@/utils/cn';
import { Skeleton } from '../Skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key:       keyof T | string;
  header:    string;
  cell:      (row: T) => React.ReactNode;
  sortable?: boolean;
  width?:    string;
}

interface DataTableProps<T> {
  columns:     Column<T>[];
  data:        T[];
  isLoading?:  boolean;
  emptyState?: React.ReactNode;
  pagination?: {
    page:      number;
    pageSize:  number;
    total:     number;
    onChange:  (page: number) => void;
  };
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  emptyState,
  pagination,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 0;

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
        <table className="min-w-full divide-y divide-slate-855/40 text-left text-sm text-slate-300">
          <thead className="bg-slate-950/40 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  scope="col"
                  className={cn("px-6 py-4 font-semibold select-none", col.width)}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 bg-transparent">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8">
                  <Skeleton.Table rows={5} />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12">
                  {emptyState || (
                    <div className="text-center text-slate-500 py-4">No records found.</div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors duration-150",
                    onRowClick ? "hover:bg-slate-800/40 cursor-pointer" : "hover:bg-slate-900/10",
                    rowClassName?.(row)
                  )}
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {col.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-1 text-slate-400">
          <div className="text-xs">
            Showing <span className="font-semibold text-slate-200">{(pagination.page - 1) * pagination.pageSize + 1}</span> to{' '}
            <span className="font-semibold text-slate-200">
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}
            </span> of <span className="font-semibold text-slate-200">{pagination.total}</span> entries
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => pagination.onChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === pagination.page;
              return (
                <button
                  key={pageNum}
                  onClick={() => pagination.onChange(pageNum)}
                  className={cn(
                    "h-8 px-3 text-xs font-semibold rounded-lg border transition-colors select-none",
                    isCurrent
                      ? "bg-brand-600/10 border-brand-500/30 text-brand-400"
                      : "bg-slate-900 border-slate-800 hover:text-slate-200 hover:bg-slate-800"
                  )}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => pagination.onChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 disabled:pointer-events-none disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default DataTable;
