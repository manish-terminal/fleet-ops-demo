import React from 'react';
import type { Booking, BookingStatus } from '@/types/booking';
import { BookingStatusBadge } from './BookingStatusBadge';
import { Button } from '@/components/ui/Button';
import { BOOKING_TRANSITIONS } from '@/utils/constants';
import { useBooking } from '@/hooks/useBooking';
import { useToast } from '@/hooks/useToast';
import { Calendar, User, Phone, MapPin, IndianRupee, Clock, ArrowRight } from 'lucide-react';

interface BookingDetailProps {
  booking: Booking;
  onStatusChanged?: () => void;
}

const TRANSITION_LABELS: Record<BookingStatus, string> = {
  draft: 'Draft',
  confirmed: 'Confirm Booking',
  in_progress: 'Dispatch / Start Transit',
  completed: 'Mark Completed',
  cancelled: 'Cancel Booking',
};

export function BookingDetail({ booking, onStatusChanged }: BookingDetailProps) {
  const { updateStatus, isUpdatingStatus } = useBooking(booking.id);
  const { success, error } = useToast();

  const allowedTransitions = BOOKING_TRANSITIONS[booking.status] || [];

  const handleTransition = async (nextStatus: BookingStatus) => {
    try {
      await updateStatus({ status: nextStatus });
      success('Booking Updated', `Booking ${booking.bookingNumber} is now ${nextStatus}`);
      onStatusChanged?.();
    } catch (err: any) {
      error('Transition failed', err.message || 'Unable to update status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <div className="glass-panel rounded-xl p-6 border-slate-800/80 space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-slate-100">{booking.bookingNumber}</h3>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">ID: {booking.id}</p>
        </div>
        
        {/* Dynamic transition actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {allowedTransitions.map((nextStatus) => (
            <Button
              key={nextStatus}
              variant={nextStatus === 'cancelled' ? 'danger' : 'primary'}
              size="sm"
              isLoading={isUpdatingStatus}
              onClick={() => handleTransition(nextStatus as BookingStatus)}
            >
              {TRANSITION_LABELS[nextStatus as BookingStatus]}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid segments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer & Schedule */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Customer Details</h4>
          <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-900 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="h-4 w-4 text-slate-500" />
              <span className="font-semibold text-slate-200">{booking.customerName}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Phone className="h-4 w-4 text-slate-500" />
              <span>{booking.customerPhone}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Calendar className="h-4 w-4 text-slate-500" />
              <span>Scheduled: {new Date(booking.scheduledAt).toLocaleString()}</span>
            </div>
            {booking.completedAt && (
              <div className="flex items-center gap-3 text-xs text-emerald-400">
                <Clock className="h-4 w-4 text-emerald-500" />
                <span>Completed: {new Date(booking.completedAt).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Route Details</h4>
          <div className="bg-slate-950/40 rounded-lg p-4 border border-slate-900 space-y-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-500 mt-1" />
                <div className="w-0.5 h-10 bg-slate-800" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-bold text-slate-300">{booking.origin.label}</p>
                  <p className="text-slate-500 mt-0.5">{booking.origin.address}</p>
                </div>
                <div>
                  <p className="font-bold text-slate-300">{booking.destination.label}</p>
                  <p className="text-slate-500 mt-0.5">{booking.destination.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost calculations */}
      <div className="space-y-4">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Calculations</h4>
        <div className="bg-slate-950/60 rounded-lg border border-slate-900 p-5 divide-y divide-slate-900 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm font-medium text-slate-400 pb-3">
            <div>Base Fare:</div>
            <div className="text-right text-slate-200">{formatCurrency(booking.cost.baseFare)}</div>
            <div>Fuel Surcharge:</div>
            <div className="text-right text-slate-200">{formatCurrency(booking.cost.fuelSurcharge)}</div>
            <div>Toll Fees:</div>
            <div className="text-right text-slate-200">{formatCurrency(booking.cost.tollFees)}</div>
            <div>Driver Wage:</div>
            <div className="text-right text-slate-200">{formatCurrency(booking.cost.driverWage)}</div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-base font-bold text-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-4.5 w-4.5 text-emerald-400" /> Total Cost:
            </div>
            <div className="text-right text-emerald-400 text-lg">{formatCurrency(booking.cost.total)}</div>
          </div>
        </div>
      </div>

      {/* Booking Notes */}
      {booking.notes && (
        <div className="space-y-2 border-t border-slate-800/60 pt-4">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes</h4>
          <p className="text-xs bg-slate-950/30 border border-slate-900 rounded-lg p-3 text-slate-400 italic leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}
    </div>
  );
}
export default BookingDetail;
