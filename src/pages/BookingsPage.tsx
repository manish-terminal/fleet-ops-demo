import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useBookings } from '@/hooks/useBookings';
import { BookingList } from '@/features/bookings/components/BookingList';
import { BookingForm } from '@/features/bookings/components/BookingForm';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Plus, Search, X } from 'lucide-react';
import type { BookingStatus } from '@/types/booking';

export function BookingsPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bookingsData, isLoading, error, refetch } = useBookings({
    page,
    limit: 10,
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  if (error) {
    return (
      <PageWrapper title="Bookings">
        <ErrorState message={error.message || 'Failed to load bookings'} onRetry={refetch} />
      </PageWrapper>
    );
  }

  const bookings = bookingsData?.data || [];
  const totalBookings = bookingsData?.total || 0;

  return (
    <PageWrapper
      title="Bookings"
      description="Create, dispatch, and complete delivery bookings across your fleet."
      actions={
        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsModalOpen(true)}
        >
          New Booking
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search booking ref, customer..."
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 select-none">
            {(['all', 'draft', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg border font-semibold capitalize whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-brand-600/10 border-brand-500/30 text-brand-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table List */}
        <BookingList
          bookings={bookings}
          isLoading={isLoading}
          page={page}
          pageSize={10}
          total={totalBookings}
          onPageChange={setPage}
          onRowClick={(row) => navigate(`/bookings/${row.id}`)}
        />
      </div>

      {/* Modal dialog overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl max-w-4xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-slate-100 mb-6">Create New Delivery Booking</h2>
            <BookingForm
              onSuccess={() => {
                setIsModalOpen(false);
                refetch();
              }}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
export default BookingsPage;
