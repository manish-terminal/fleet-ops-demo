import React from 'react';
import type { KpiItem } from '@/types/analytics';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface KpiGridProps {
  kpis: KpiItem[];
  isLoading?: boolean;
}

export function KpiGrid({ kpis, isLoading }: KpiGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel animate-pulse h-28 rounded-xl bg-slate-900/40 border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => {
        const isUp = kpi.trend === 'up';
        const isDown = kpi.trend === 'down';
        const isNeutral = kpi.trend === 'neutral';

        // Fuel efficiency drop is a positive trend, so we color-code accordingly
        const isPositiveChange = (isUp && !kpi.label.includes('Fuel')) || (isDown && kpi.label.includes('Fuel'));

        return (
          <div
            key={idx}
            className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-4 text-left relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{kpi.label}</span>
              <div className={`p-2 rounded-lg border ${
                isPositiveChange 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : isNeutral
                  ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {isUp ? <TrendingUp className="h-4 w-4" /> : isDown ? <TrendingDown className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
              </div>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl font-extrabold text-slate-100">{kpi.value}</h3>
              <p className={`text-[10px] font-bold flex items-center gap-1 ${
                isPositiveChange ? 'text-emerald-400' : isNeutral ? 'text-slate-400' : 'text-red-400'
              }`}>
                {kpi.change > 0 ? `+${kpi.change}%` : `${kpi.change}%`}
                <span className="text-slate-500 font-medium font-sans">vs last month</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default KpiGrid;
