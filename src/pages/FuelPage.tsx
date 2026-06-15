import React, { useState } from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useVehicles } from '@/hooks/useVehicles';
import { useFuelReadings, useFuelAlerts } from '@/hooks/useFuelData';
import { FuelTable } from '@/features/fuel/components/FuelTable';
import { FuelGauge } from '@/features/fuel/components/FuelGauge';
import { FuelTrendChart } from '@/features/fuel/components/FuelTrendChart';
import { FuelAlertBanner } from '@/features/fuel/components/FuelAlertBanner';
import { Fuel, RefreshCw, AlertOctagon } from 'lucide-react';

export function FuelPage() {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>('v-001'); // default selection

  const { data: vehiclesData, isLoading: isLoadingVehicles } = useVehicles({ limit: 100 });
  const { data: readingsResponse, isLoading: isLoadingReadings } = useFuelReadings(selectedVehicleId || undefined);
  const { data: alertsResponse, isLoading: isLoadingAlerts, refetch: refetchAlerts } = useFuelAlerts();

  const vehicles = vehiclesData?.data || [];
  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || null;
  const readings = readingsResponse?.data || [];
  const alerts = alertsResponse?.data || [];
  
  // Filter alerts specifically for the selected vehicle
  const selectedVehicleAlerts = alerts.filter(a => a.vehicleId === selectedVehicleId);

  return (
    <PageWrapper
      title="Fuel Monitor"
      description="Per-truck fuel levels, live efficiency metrics, and automatic anomaly tracking."
      actions={
        <button
          onClick={() => refetchAlerts()}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all select-none"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Force Refresh Alerts
        </button>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Side: Fleet List table */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Fuel className="h-5 w-5 text-brand-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Fleet Fuel Logs</h2>
            </div>
            <FuelTable
              vehicles={vehicles}
              isLoading={isLoadingVehicles}
              selectedVehicleId={selectedVehicleId}
              onSelectVehicle={setSelectedVehicleId}
            />
          </div>
        </div>

        {/* Right Side: Visualiser Panel for Selected Truck */}
        <div className="space-y-6">
          {selectedVehicle ? (
            <div className="space-y-6">
              {/* Info panel */}
              <div className="glass-panel p-5 rounded-xl text-left border-slate-800 space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Focus</p>
                <h2 className="text-lg font-bold text-slate-100">{selectedVehicle.plateNumber}</h2>
                <p className="text-xs text-slate-400">{selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})</p>
              </div>

              {/* Gauge */}
              <FuelGauge
                percentage={selectedVehicle.fuelLevel}
                litres={Math.round((selectedVehicle.fuelLevel / 100) * 300)}
                capacity={300}
              />

              {/* Alerts banner specific to this truck */}
              {selectedVehicleAlerts.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-red-400 flex items-center gap-1.5 uppercase tracking-wider text-left">
                    <AlertOctagon className="h-4 w-4" /> Active Anomalies
                  </h3>
                  <FuelAlertBanner alerts={selectedVehicleAlerts} />
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400 text-xs text-left">
                  No active fuel consumption anomalies detected for this vehicle.
                </div>
              )}

              {/* Historical graph */}
              <FuelTrendChart
                readings={readings}
                isLoading={isLoadingReadings}
              />
            </div>
          ) : (
            <div className="glass-panel p-8 text-center text-slate-500 rounded-xl">
              Select a vehicle from the table to view its fuel gauge and consumption telemetry.
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
export default FuelPage;
