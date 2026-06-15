import React, { useState } from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import {
  useEngineHealth,
  useMaintenanceAlerts,
  useServiceLogs,
  usePerformService,
} from '@/hooks/useMaintenance';
import { EngineHealthCard } from '@/features/maintenance/components/EngineHealthCard';
import { MaintenanceAlertList } from '@/features/maintenance/components/MaintenanceAlertList';
import { ServiceLogTable } from '@/features/maintenance/components/ServiceLogTable';
import { useToast } from '@/hooks/useToast';
import { Wrench, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export function MaintenancePage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { success, error } = useToast();

  const { data: healthResponse, isLoading: isLoadingHealth } = useEngineHealth();
  const { data: alertsResponse, isLoading: isLoadingAlerts } = useMaintenanceAlerts();
  const { data: logsResponse, isLoading: isLoadingLogs } = useServiceLogs();
  const { mutateAsync: performService, isPending: isPerforming } = usePerformService();

  const healthRecords = healthResponse?.data || [];
  const alerts = alertsResponse?.data || [];
  const serviceLogs = logsResponse?.data || [];

  const handleDispatchRepair = async (vehicleId: string, alertId: string) => {
    try {
      const response = await performService({ vehicleId, alertId });
      success(
        'Repair Dispatched',
        `Successfully reset engine health logs and resolved alert for vehicle ${vehicleId}.`
      );
    } catch (err: any) {
      error('Repair Failed', err.message || 'Something went wrong');
    }
  };

  const filteredHealth = healthRecords.filter((rec) => {
    if (filterStatus === 'all') return true;
    return rec.overallStatus === filterStatus;
  });

  return (
    <PageWrapper
      title="Predictive Maintenance"
      description="Real-time OBD diagnostics, oil levels, battery conditions, and pending service checklists."
    >
      <div className="space-y-8">
        
        {/* Alerts & Action items list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Maintenance Alerts */}
          <div className="glass-panel p-6 rounded-xl space-y-4 text-left lg:col-span-1 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="h-5 w-5 text-red-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Due Diagnostics</h2>
            </div>
            <MaintenanceAlertList
              alerts={alerts}
              onPerformService={handleDispatchRepair}
              isPerforming={isPerforming}
            />
          </div>

          {/* Engine health vitals grid section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                Predictive Vitals Dashboard ({filteredHealth.length} trucks)
              </h3>
              
              {/* Filter controls */}
              <div className="flex gap-2">
                {['all', 'good', 'fair', 'poor', 'critical'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-md border transition-all uppercase tracking-wider ${
                      filterStatus === st
                        ? 'bg-brand-600/10 border-brand-500/30 text-brand-400 font-extrabold'
                        : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {isLoadingHealth ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel animate-pulse h-56 rounded-xl bg-slate-900/40 border-slate-800" />
                ))}
              </div>
            ) : filteredHealth.length === 0 ? (
              <div className="p-8 text-center text-slate-500 bg-slate-900/10 border border-slate-900 rounded-xl">
                No vehicles matching status "{filterStatus}" found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredHealth.map((health) => (
                  <EngineHealthCard key={health.vehicleId} health={health} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Historical Service Logs */}
        <div className="glass-panel p-6 rounded-xl space-y-4 text-left">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <FileText className="h-5 w-5 text-brand-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Historical Workshop Repairs</h2>
          </div>
          <ServiceLogTable logs={serviceLogs} isLoading={isLoadingLogs} />
        </div>

      </div>
    </PageWrapper>
  );
}
export default MaintenancePage;
