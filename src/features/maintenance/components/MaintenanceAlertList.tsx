import React from 'react';
import type { MaintenanceAlert } from '@/types/maintenance';
import { mockVehicles } from '@/mocks/vehicles';
import { AlertCircle, Wrench, CalendarClock } from 'lucide-react';

interface MaintenanceAlertListProps {
  alerts: MaintenanceAlert[];
  onPerformService?: (vehicleId: string, alertId: string) => void;
  isPerforming?: boolean;
}

export function MaintenanceAlertList({
  alerts,
  onPerformService,
  isPerforming,
}: MaintenanceAlertListProps) {
  const getVehiclePlate = (vId: string) => {
    return mockVehicles.find(v => v.id === vId)?.plateNumber || vId;
  };

  if (alerts.length === 0) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 text-xs text-left">
        <CalendarClock className="h-5 w-5 text-emerald-400 shrink-0" />
        <div>
          <p className="font-bold">Zero Diagnostic Errors</p>
          <p className="text-emerald-400/80 mt-0.5">All fleet vehicles passed the rolling predictive diagnostics check.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'critical';
        const plate = getVehiclePlate(alert.vehicleId);

        let typeLabel = alert.type.replace('_', ' ');
        typeLabel = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);

        return (
          <div
            key={alert.id}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
              isCritical
                ? 'bg-red-500/10 border-red-500/30 text-red-200'
                : alert.severity === 'high'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              isCritical 
                ? 'bg-red-500/20 text-red-400 animate-pulse' 
                : alert.severity === 'high'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <AlertCircle className="h-5 w-5" />
            </div>

            <div className="flex-1 space-y-2 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <span className={`inline-flex w-fit items-center px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider ${
                  isCritical 
                    ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                    : alert.severity === 'high'
                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {typeLabel} Alert
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Due: {new Date(alert.dueDate).toLocaleDateString()}</span>
              </div>

              <div>
                <p className="text-sm font-bold text-slate-100">Vehicle: {plate}</p>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">{alert.message}</p>
              </div>

              {onPerformService && (
                <button
                  onClick={() => onPerformService(alert.vehicleId, alert.id)}
                  disabled={isPerforming}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-bold transition-all duration-200 disabled:opacity-50 select-none ${
                    isCritical
                      ? 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                      : alert.severity === 'high'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-brand-600/10 border-brand-500/30 text-brand-400 hover:bg-brand-600/20'
                  }`}
                >
                  <Wrench className="h-3.5 w-3.5" /> Dispatch Workshop Repair
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default MaintenanceAlertList;
