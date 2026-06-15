import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { mockVehicles } from '@/mocks/vehicles';
import { mockUserProfiles } from '@/mocks/users';
import { useBooking } from '@/hooks/useBooking';
import { useToast } from '@/hooks/useToast';
import { MapPin, Calculator, Info } from 'lucide-react';

// Cost calculator utility (copied here for self-containment or helper reuse)
export function calculateBookingCost(params: {
  distanceKm:     number;
  fuelPricePerL:  number;
  consumptionL100: number;
  driverRatePerKm: number;
  tollFees:       number;
}) {
  const fuelSurcharge = (params.distanceKm / 100) * params.consumptionL100 * params.fuelPricePerL;
  const driverWage    = params.distanceKm * params.driverRatePerKm;
  const baseFare      = params.distanceKm * 35; // ₹35/km base rate
  return {
    baseFare:      Math.round(baseFare),
    fuelSurcharge: Math.round(fuelSurcharge),
    tollFees:      params.tollFees,
    driverWage:    Math.round(driverWage),
    total:         Math.round(baseFare + fuelSurcharge + params.tollFees + driverWage),
    currency:      'INR',
  };
}

const bookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(5, 'Phone number is required'),
  vehicleId: z.string().min(1, 'Please select a vehicle'),
  driverId: z.string().min(1, 'Please select a driver'),
  originLabel: z.string().min(2, 'Origin label is required'),
  originAddress: z.string().min(2, 'Origin address is required'),
  destinationLabel: z.string().min(2, 'Destination label is required'),
  destinationAddress: z.string().min(2, 'Destination address is required'),
  distanceKm: z.number({ coerce: true }).min(1, 'Distance must be positive'),
  tollFees: z.number({ coerce: true }).nonnegative('Toll fees cannot be negative'),
  scheduledAt: z.string().min(1, 'Scheduled date/time is required'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function BookingForm({ onSuccess, onCancel }: BookingFormProps) {
  const { createBooking, isCreating } = useBooking();
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      vehicleId: '',
      driverId: '',
      originLabel: '',
      originAddress: '',
      destinationLabel: '',
      destinationAddress: '',
      distanceKm: 850,
      tollFees: 1500,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString().slice(0, 16), // tomorrow
      notes: '',
    },
  });

  const watchDistance = watch('distanceKm');
  const watchTolls = watch('tollFees');

  // Interactive calculations
  const costCalculations = calculateBookingCost({
    distanceKm: watchDistance || 0,
    fuelPricePerL: 104.50,      // Mock fuel price INR
    consumptionL100: 35,       // Avg truck consumption
    driverRatePerKm: 7.50,     // Driver wage rate INR
    tollFees: watchTolls || 0,
  });

  const onSubmit = async (values: BookingFormValues) => {
    try {
      const selectedVehicle = mockVehicles.find(v => v.id === values.vehicleId);
      const selectedDriver = mockUserProfiles['driver@fleetops.demo']; // Default fallback driver details
      
      const payload = {
        customerId: `cust-${Date.now()}`,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        vehicleId: values.vehicleId,
        driverId: values.driverId,
        origin: {
          label: values.originLabel,
          address: values.originAddress,
          coords: selectedVehicle?.currentLocation || { lat: 19.0760, lng: 72.8777 },
        },
        destination: {
          label: values.destinationLabel,
          address: values.destinationAddress,
          coords: { lat: 28.6139, lng: 77.2090 }, // Mock destination coordinates (Delhi)
        },
        stops: [],
        status: 'draft' as const,
        cost: costCalculations,
        scheduledAt: new Date(values.scheduledAt).toISOString(),
        completedAt: null,
        notes: values.notes || null,
      };

      await createBooking(payload);
      success('Booking Created', `Successfully dispatched booking BK-${Date.now().toString().slice(-4)}`);
      onSuccess?.();
    } catch (err: any) {
      error('Failed to create booking', err.message || 'Validation error');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer & Route Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Customer & Details</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Customer Name</label>
                <input
                  {...register('customerName')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="Acme Logistics"
                />
                {errors.customerName && <p className="text-[10px] text-red-400 mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Customer Phone</label>
                <input
                  {...register('customerPhone')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="+91 98765 43210"
                />
                {errors.customerPhone && <p className="text-[10px] text-red-400 mt-1">{errors.customerPhone.message}</p>}
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 font-semibold mb-1 block">Scheduled Date & Time</label>
              <input
                {...register('scheduledAt')}
                type="datetime-local"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
              />
              {errors.scheduledAt && <p className="text-[10px] text-red-400 mt-1">{errors.scheduledAt.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Assign Truck</label>
                <select
                  {...register('vehicleId')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select Truck</option>
                  {mockVehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plateNumber} ({v.make})
                    </option>
                  ))}
                </select>
                {errors.vehicleId && <p className="text-[10px] text-red-400 mt-1">{errors.vehicleId.message}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Assign Driver</label>
                <select
                  {...register('driverId')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                >
                  <option value="">Select Driver</option>
                  <option value="d-001">Vikram Singh</option>
                  <option value="d-002">Amit Patel</option>
                  <option value="d-003">Priya Nair</option>
                  <option value="d-004">Rajesh Sharma</option>
                </select>
                {errors.driverId && <p className="text-[10px] text-red-400 mt-1">{errors.driverId.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Distance (km)</label>
                <input
                  {...register('distanceKm', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                />
                {errors.distanceKm && <p className="text-[10px] text-red-400 mt-1">{errors.distanceKm.message}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Toll Fees (INR)</label>
                <input
                  {...register('tollFees', { valueAsNumber: true })}
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-brand-500"
                />
                {errors.tollFees && <p className="text-[10px] text-red-400 mt-1">{errors.tollFees.message}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Route Address & Cost Calculators */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2">Route & Pricing</h3>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Origin Name</label>
                <input
                  {...register('originLabel')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="Mumbai Port Terminal"
                />
                {errors.originLabel && <p className="text-[10px] text-red-400 mt-1">{errors.originLabel.message}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Origin Address</label>
                <input
                  {...register('originAddress')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="Sector 10, JNPT, Navi Mumbai"
                />
                {errors.originAddress && <p className="text-[10px] text-red-400 mt-1">{errors.originAddress.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Destination Name</label>
                <input
                  {...register('destinationLabel')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="Delhi Fulfillment Centre"
                />
                {errors.destinationLabel && <p className="text-[10px] text-red-400 mt-1">{errors.destinationLabel.message}</p>}
              </div>
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Destination Address</label>
                <input
                  {...register('destinationAddress')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
                  placeholder="Tuglakabad Container Depot"
                />
                {errors.destinationAddress && <p className="text-[10px] text-red-400 mt-1">{errors.destinationAddress.message}</p>}
              </div>
            </div>

            {/* Live calculated cost preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5"><Calculator className="h-4 w-4" /> Live Fare Estimation</span>
                <span className="font-mono">Rate ₹35/km</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono text-slate-400">
                <div>Base Fare:</div>
                <div className="text-right text-slate-300">{formatCurrency(costCalculations.baseFare)}</div>
                <div>Fuel Surcharge:</div>
                <div className="text-right text-slate-300">{formatCurrency(costCalculations.fuelSurcharge)}</div>
                <div>Driver Wage:</div>
                <div className="text-right text-slate-300">{formatCurrency(costCalculations.driverWage)}</div>
                <div>Toll Fees:</div>
                <div className="text-right text-slate-300">{formatCurrency(costCalculations.tollFees)}</div>
              </div>
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Total Price (INR):</span>
                <span className="text-emerald-400 font-extrabold text-base">{formatCurrency(costCalculations.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-400 font-semibold mb-1 block">Delivery Notes</label>
        <textarea
          {...register('notes')}
          rows={2}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500 resize-none"
          placeholder="Fragile loading instructions or gate codes..."
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" isLoading={isCreating}>
          Confirm & Dispatch
        </Button>
      </div>
    </form>
  );
}
export default BookingForm;
