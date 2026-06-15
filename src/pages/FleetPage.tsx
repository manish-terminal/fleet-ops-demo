import React, { useState } from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useVehicles } from '@/hooks/useVehicles';
import { useVehicleLocations } from '@/hooks/useVehicleLocations';
import { FleetMap } from '@/features/fleet/components/FleetMap';
import { TruckCard } from '@/features/fleet/components/TruckCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Search } from 'lucide-react';
import type { VehicleStatus } from '@/types/vehicle';

export function FleetPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');

  const { data: vehiclesData, isLoading, error, refetch } = useVehicles({
    limit: 100, // Load all for map plotting
  });

  const { data: liveLocations } = useVehicleLocations();

  if (error) {
    return (
      <PageWrapper title="Fleet Dashboard">
        <ErrorState message={error.message || 'Failed to load vehicles'} onRetry={refetch} />
      </PageWrapper>
    );
  }

  const vehicles = vehiclesData?.data || [];
  const mergedVehicles = vehicles.map((v) => {
    const liveLoc = liveLocations?.find((l) => l.id === v.id);
    return liveLoc 
      ? { ...v, currentLocation: liveLoc.currentLocation } 
      : v;
  });

  const filteredVehicles = mergedVehicles.filter((v) => {
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchesSearch =
      search === '' ||
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.make.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <PageWrapper
      title="Fleet Dashboard"
      description="Live GPS tracking, vehicle statuses, and speed telemetry."
      actions={
        <Button variant="secondary" size="sm" onClick={() => refetch()}>
          Refresh Telemetry
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
        {/* Map View - Left Column */}
        <div className="lg:col-span-2 h-full min-h-[400px] lg:min-h-0">
          <FleetMap
            vehicles={mergedVehicles}
            selectedVehicleId={selectedId}
            onSelectVehicle={setSelectedId}
          />
        </div>

        {/* Sidebar Listings & Filters - Right Column */}
        <div className="flex flex-col h-full bg-slate-900/40 rounded-xl border border-slate-800/80 p-4 space-y-4 overflow-hidden">
          {/* Controls */}
          <div className="space-y-3 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search plate number, make..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-brand-500"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs shrink-0 select-none">
              {(['all', 'in_transit', 'idle', 'maintenance', 'offline'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg border font-semibold capitalize whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? 'bg-brand-600/10 border-brand-500/30 text-brand-400'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* List content */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-slate-800/50 h-28 rounded-xl" />
              ))
            ) : filteredVehicles.length === 0 ? (
              <EmptyState title="No Vehicles" description="No trucks match the selected status filter or query." />
            ) : (
              filteredVehicles.map((vehicle) => (
                <TruckCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  isSelected={vehicle.id === selectedId}
                  onSelect={setSelectedId}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
export default FleetPage;
