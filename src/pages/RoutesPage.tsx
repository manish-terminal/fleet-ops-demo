import React, { useState, useEffect } from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { RouteForm } from '@/features/routes/components/RouteForm';
import { RouteMap } from '@/features/routes/components/RouteMap';
import { RouteSuggestionCard } from '@/features/routes/components/RouteSuggestionCard';
import { EmptyKmGrid } from '@/features/routes/components/EmptyKmGrid';
import { useTruckOptimisations, useRouteMetrics, useDispatchReturnLoad } from '@/hooks/useRoutes';
import { useToast } from '@/hooks/useToast';
import { Compass, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

export function RoutesPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const { success, error } = useToast();

  const { data: optimisationsResponse, isLoading: isLoadingList, refetch: refetchList } = useTruckOptimisations();
  const { data: metricsResponse, isLoading: isLoadingMetrics } = useRouteMetrics();
  const { mutateAsync: dispatchReturn, isPending: isDispatching } = useDispatchReturnLoad();

  const optimisations = optimisationsResponse?.data || [];
  const metrics = metricsResponse?.data || { emptyKmPercentage: 34.5, revenueLost: 184500, matchRate: 88 };

  const selectedOpt = optimisations.find(o => o.vehicleId === selectedVehicleId) || null;
  const opportunities = selectedOpt?.opportunities || [];
  
  // Find active selected return opportunity
  const activeOpportunity = opportunities.find(opp => opp.id === selectedOpportunityId) || opportunities[0] || null;

  // Auto select first vehicle on load if not set
  useEffect(() => {
    if (optimisations.length > 0 && !selectedVehicleId) {
      setSelectedVehicleId(optimisations[0].vehicleId);
    }
  }, [optimisations, selectedVehicleId]);

  // Reset selected opportunity when vehicle changes
  useEffect(() => {
    setSelectedOpportunityId(null);
  }, [selectedVehicleId]);

  const handleDispatch = async () => {
    if (!selectedVehicleId || !activeOpportunity) return;
    try {
      await dispatchReturn({
        vehicleId: selectedVehicleId,
        opportunityId: activeOpportunity.id,
      });
      success(
        'Return Load Dispatched',
        `Successfully dispatched return load cargo of ${activeOpportunity.loadType} for vehicle ${selectedOpt?.plateNumber}.`
      );
    } catch (err: any) {
      error('Dispatch Failed', err.message || 'Unable to book return load');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <PageWrapper
      title="Empty Return Trip Optimization"
      description="Maximize fleet yields by finding return cargo loads and eliminating empty backhaul runs."
      actions={
        <button
          onClick={() => refetchList()}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all select-none"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Matchings
        </button>
      }
    >
      <div className="space-y-8">
        
        {/* Global Backhaul Metrics */}
        <EmptyKmGrid
          emptyKmPercentage={metrics.emptyKmPercentage}
          revenueLost={metrics.revenueLost}
          matchRate={metrics.matchRate}
          isLoading={isLoadingMetrics}
        />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Left Column: Dropdown selector & opportunities list */}
          <div className="space-y-6">
            <RouteForm
              optimisations={optimisations}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
              isLoading={isLoadingList}
            />

            {selectedOpt && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-left">
                  <Compass className="h-4 w-4 text-brand-400 font-semibold" />
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {selectedOpt.returnLoadBooked 
                      ? 'Dispatched Backhaul Cargo' 
                      : `Available Return Cargo (${opportunities.length})`}
                  </h3>
                </div>

                {selectedOpt.returnLoadBooked ? (
                  <div className="p-5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs text-left">
                    <p className="font-bold">Return leg matches complete.</p>
                    <p className="mt-1 opacity-80">
                      The truck has been allocated to a loaded return trip. Double-run revenue locked.
                    </p>
                  </div>
                ) : opportunities.length === 0 ? (
                  <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/10 text-slate-500 text-xs text-left">
                    No active return load matches found for this vehicle.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {opportunities.map((opp) => (
                      <RouteSuggestionCard
                        key={opp.id}
                        opportunity={opp}
                        outboundRevenue={selectedOpt.currentTrip?.revenue || 0}
                        isActive={activeOpportunity?.id === opp.id}
                        onSelect={() => setSelectedOpportunityId(opp.id)}
                        onDispatch={handleDispatch}
                        isDispatching={isDispatching}
                        isBooked={selectedOpt.returnLoadBooked}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Routing Map Canvas */}
          <div className="xl:col-span-2 flex flex-col justify-between h-full min-h-[500px]">
            <RouteMap
              outboundWaypoints={selectedOpt?.currentTrip?.waypoints || []}
              returnWaypoints={
                activeOpportunity && !selectedOpt?.returnLoadBooked 
                  ? activeOpportunity.waypoints 
                  : selectedOpt?.returnLoadBooked && selectedOpt?.bookedOpportunityId
                  ? selectedOpt.opportunities.find(o => o.id === selectedOpt.bookedOpportunityId)?.waypoints || []
                  : []
              }
            />

            {/* Selected active match summary details */}
            {selectedOpt && activeOpportunity && (
              <div className="mt-4 glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 border-slate-800 text-left">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Return Load Route</p>
                  <p className="text-sm font-bold text-slate-200 mt-0.5">
                    {activeOpportunity.origin.split(',')[0]} ➔ {activeOpportunity.destination.split(',')[0]}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-xs font-mono text-slate-400">
                  <div>
                    <span className="text-slate-500">Outbound Fare:</span>{' '}
                    <strong className="text-slate-200 font-semibold">{formatCurrency(selectedOpt.currentTrip?.revenue || 0)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Return Fare:</span>{' '}
                    <strong className="text-emerald-400 font-semibold">+{formatCurrency(activeOpportunity.revenue)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">Combined:</span>{' '}
                    <strong className="text-emerald-400 font-extrabold">{formatCurrency((selectedOpt.currentTrip?.revenue || 0) + activeOpportunity.revenue)}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
export default RoutesPage;
