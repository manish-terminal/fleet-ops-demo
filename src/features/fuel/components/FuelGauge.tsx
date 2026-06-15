import React from 'react';

interface FuelGaugeProps {
  percentage: number;
  litres: number;
  capacity?: number;
}

export function FuelGauge({ percentage, litres, capacity = 300 }: FuelGaugeProps) {
  // Calculate SVG circle properties
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on fuel level percentage
  const getGaugeColor = (pct: number) => {
    if (pct < 20) return 'stroke-red-500 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
    if (pct < 50) return 'stroke-amber-500 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]';
    return 'stroke-emerald-500 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900/40 border border-slate-800/80 rounded-xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-slate-950 via-slate-900 to-slate-950 opacity-50 pointer-events-none" />
      
      <div className="relative h-32 w-32 flex items-center justify-center">
        <svg className="h-full w-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Inner circle border track */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
          />
          {/* Active progress arc */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            className={`transition-all duration-500 ease-out ${getGaugeColor(percentage)}`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        {/* Readout overlay inside the gauge */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-slate-100">{percentage}%</span>
          <span className="text-[10px] font-semibold text-slate-500 tracking-wider uppercase">Capacity</span>
        </div>
      </div>
      
      <div className="mt-4 text-center space-y-1 z-10">
        <p className="text-sm font-bold text-slate-200">{litres} Litres remaining</p>
        <p className="text-xs text-slate-500">of {capacity}L tank limit</p>
      </div>
    </div>
  );
}
export default FuelGauge;
