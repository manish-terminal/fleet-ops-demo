import React from 'react';
import { TrendingDown, Coins, Percent, Landmark } from 'lucide-react';

interface EmptyKmGridProps {
  emptyKmPercentage: number;
  revenueLost: number;
  matchRate: number;
  isLoading?: boolean;
}

export function EmptyKmGrid({
  emptyKmPercentage,
  revenueLost,
  matchRate,
  isLoading,
}: EmptyKmGridProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-panel animate-pulse h-24 rounded-xl bg-slate-900/40 border-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Empty Kilometer % */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-3 text-left relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Empty Return Kilometers</span>
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Percent className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-100">{emptyKmPercentage}%</h3>
          <p className="text-[10px] text-amber-400 font-bold mt-1">
            Ratio of unloaded backhauls
          </p>
        </div>
      </div>

      {/* Revenue Lost */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-3 text-left relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Revenue Lost (Empty runs)</span>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <TrendingDown className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-red-400">{formatCurrency(revenueLost)}</h3>
          <p className="text-[10px] text-red-400/80 font-bold mt-1">
            Lost opportunities this month
          </p>
        </div>
      </div>

      {/* Opportunity Match Rate */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-3 text-left relative overflow-hidden group hover:border-slate-700/60 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">AI Opportunity Match Rate</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Landmark className="h-4 w-4" />
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-extrabold text-slate-100">{matchRate}%</h3>
          <p className="text-[10px] text-emerald-400 font-bold mt-1">
            Trucks matched with cargo offers
          </p>
        </div>
      </div>
    </div>
  );
}
export default EmptyKmGrid;
