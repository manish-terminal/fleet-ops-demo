import React from 'react';
import type { Booking } from '@/types/booking';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { BookingStatusBadge } from './BookingStatusBadge';
import { ArrowRight } from 'lucide-react';

interface BookingListProps {
  bookings: Booking[];
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowClick?: (booking: Booking) => void;
}

export function BookingList({
  bookings,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onRowClick,
}: BookingListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const columns: Column<Booking>[] = [
    {
      key: 'bookingNumber',
      header: 'Booking Ref',
      cell: (row) => <span className="font-bold text-slate-100">{row.bookingNumber}</span>,
      width: 'w-24',
    },
    {
      key: 'customerName',
      header: 'Customer',
      cell: (row) => (
        <div>
          <p className="font-semibold text-slate-200">{row.customerName}</p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{row.customerPhone}</p>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Route Details',
      cell: (row) => (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-300 font-semibold">{row.origin.label}</span>
          <ArrowRight className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-300 font-semibold">{row.destination.label}</span>
        </div>
      ),
    },
    {
      key: 'scheduledAt',
      header: 'Scheduled Date',
      cell: (row) => <span className="text-slate-400">{new Date(row.scheduledAt).toLocaleDateString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <BookingStatusBadge status={row.status} />,
    },
    {
      key: 'cost',
      header: 'Fare (INR)',
      cell: (row) => <span className="font-bold text-emerald-400">{formatCurrency(row.cost.total)}</span>,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={bookings}
      isLoading={isLoading}
      onRowClick={onRowClick}
      pagination={{
        page,
        pageSize,
        total,
        onChange: onPageChange,
      }}
    />
  );
}
export default BookingList;
