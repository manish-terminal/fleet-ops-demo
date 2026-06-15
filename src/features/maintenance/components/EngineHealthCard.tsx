import React from 'react';
import type { EngineHealth } from '@/types/maintenance';
import { mockVehicles } from '@/mocks/vehicles';
import { AlertTriangle, Thermometer, Battery, Disc } from 'lucide-react';

interface EngineHealthCardProps {
  health: EngineHealth;
}

const STATUS_THEME = {
  good: { dot: 'bg-emerald-500', text: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5', label: 'Good' },
  fair: { dot: 'bg-blue-500', text: 'text-blue-400 border-blue-500/20 bg-blue-500/5', label: 'Fair' },
  poor: { dot: 'bg-amber-500', text: 'text-amber-400 border-amber-500/20 bg-amber-500/5', label: 'Poor' },
  critical: { dot: 'bg-red-500 animate-pulse', text: 'text-red-400 border-red-500/20 bg-red-500/5', label: 'Critical' },
};

export function EngineHealthCard({ health }: EngineHealthCardProps) {
  const vehicle = mockVehicles.find(v => v.id === health.vehicleId);
  const theme = STATUS_THEME[health.overallStatus];

  // Helper for oil level status bars
  const getOilBarColor = (level: number) => {
    if (level < 20) return 'bg-red-500';
    if (level < 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-slate-800/80 text-left space-y-4 hover:border-slate-700/60 transition-all duration-300">
      
      {/* Header plate & overall status */}
      <div className="flex items-start justify-between border-b border-slate-800/60 pb-3">
        <div>
          <h4 className="font-extrabold text-sm text-slate-100">{vehicle?.plateNumber || health.vehicleId}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{vehicle?.make} {vehicle?.model}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${theme.text}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${theme.dot}`} /> {theme.label}
        </span>
      </div>

      <div className="space-y-3.5">
        {/* Oil Level Indicator */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Oil Quality Level</span>
            <span className="font-bold font-mono">{health.oilLevel}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-900">
            <div 
              className={`h-full ${getOilBarColor(health.oilLevel)} transition-all duration-500`}
              style={{ width: `${health.oilLevel}%` }}
            />
          </div>
        </div>

        {/* Diagnostic parameters grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          
          {/* Temperature */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 flex items-center gap-2">
            <Thermometer className={`h-4 w-4 shrink-0 ${health.engineTemp > 95 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Engine Temp</p>
              <p className="font-bold font-mono text-slate-200 mt-0.5">{health.engineTemp}°C</p>
            </div>
          </div>

          {/* Battery */}
          <div className="bg-slate-950/40 border border-slate-900 rounded-lg p-2.5 flex items-center gap-2">
            <Battery className={`h-4 w-4 shrink-0 ${health.batteryVoltage < 11.5 ? 'text-red-400 animate-pulse' : 'text-slate-500'}`} />
            <div>
              <p className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Battery Charge</p>
              <p className="font-bold font-mono text-slate-200 mt-0.5">{health.batteryVoltage} V</p>
            </div>
          </div>
        </div>

        {/* Tyre Pressures Grid */}
        <div className="bg-slate-950/30 border border-slate-900/60 rounded-xl p-3 space-y-2">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block text-center">Tyre Pressures (PSI)</span>
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-950/80 border border-slate-900 rounded p-1">
              <span className="text-[9px] text-slate-600 uppercase block font-semibold">FL</span>
              <strong className={`font-mono ${health.tyrePressure[0] < 28 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{health.tyrePressure[0]}</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-900 rounded p-1">
              <span className="text-[9px] text-slate-600 uppercase block font-semibold">FR</span>
              <strong className={`font-mono ${health.tyrePressure[1] < 28 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{health.tyrePressure[1]}</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-900 rounded p-1">
              <span className="text-[9px] text-slate-600 uppercase block font-semibold">RL</span>
              <strong className={`font-mono ${health.tyrePressure[2] < 28 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{health.tyrePressure[2]}</strong>
            </div>
            <div className="bg-slate-950/80 border border-slate-900 rounded p-1">
              <span className="text-[9px] text-slate-600 uppercase block font-semibold">RR</span>
              <strong className={`font-mono ${health.tyrePressure[3] < 28 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{health.tyrePressure[3]}</strong>
            </div>
          </div>
        </div>

        {/* Critical service warnings */}
        {health.overallStatus === 'critical' && (
          <div className="flex items-center gap-1.5 p-2 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 font-bold rounded-lg uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Immediate shutdown advised
          </div>
        )}
        {health.overallStatus === 'poor' && (
          <div className="flex items-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 text-[10px] text-amber-400 font-bold rounded-lg uppercase tracking-wider">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" /> Service booking due soon
          </div>
        )}

      </div>
    </div>
  );
}
export default EngineHealthCard;
