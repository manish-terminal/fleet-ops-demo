import React from 'react';
import type { ReturnTripOpportunity } from '@/types/route';
import { Sparkles, Landmark, Coins, TrendingUp } from 'lucide-react';

interface RouteSuggestionCardProps {
  opportunity: ReturnTripOpportunity;
  outboundRevenue: number;
  isActive: boolean;
  onSelect: () => void;
  onDispatch?: () => void;
  isDispatching?: boolean;
  isBooked?: boolean;
}

export function RouteSuggestionCard({
  opportunity,
  outboundRevenue,
  isActive,
  onSelect,
  onDispatch,
  isDispatching,
  isBooked,
}: RouteSuggestionCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const combinedRevenue = outboundRevenue + opportunity.revenue;

  return (
    <div
      onClick={onSelect}
      className={`glass-panel p-5 rounded-xl border text-left cursor-pointer transition-all duration-300 relative overflow-hidden group select-none ${
        isActive 
          ? 'border-brand-500 bg-brand-600/5 shadow-lg shadow-brand-500/5' 
          : 'border-slate-800/80 hover:border-slate-700/60'
      }`}
    >
      {/* Background glow for active */}
      {isActive && (
        <div className="absolute right-0 top-0 h-16 w-16 bg-brand-500/10 blur-xl pointer-events-none rounded-full" />
      )}

      <div className="space-y-4">
        {/* Header criteria tags */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border-brand-500/20">
            <Sparkles className="h-3 w-3" /> return cargo match
          </span>
          <span className="text-[10px] text-slate-500 font-semibold font-mono">
            AI Match Score: <strong className="text-brand-400">{opportunity.score}%</strong>
          </span>
        </div>

        {/* Cargo info */}
        <div>
          <h4 className="text-sm font-extrabold text-slate-100">{opportunity.customerName}</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Cargo: {opportunity.loadType}</p>
        </div>

        {/* Primary readouts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Return Distance</p>
            <p className="text-base font-extrabold text-slate-200">{opportunity.distanceKm} km</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Backhaul Yield</p>
            <p className="text-base font-extrabold text-emerald-400">{formatCurrency(opportunity.revenue)}</p>
          </div>
        </div>

        {/* Comparison panel */}
        <div className="bg-slate-950/40 rounded-lg border border-slate-900/60 p-3 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="text-left space-y-0.5">
            <span className="text-[9px] text-slate-500 uppercase block">Outbound Only</span>
            <strong className="text-slate-300">{formatCurrency(outboundRevenue)}</strong>
          </div>
          
          <TrendingUp className="h-4 w-4 text-emerald-500 animate-pulse" />

          <div className="text-right space-y-0.5">
            <span className="text-[9px] text-emerald-500 uppercase block font-bold">Combined Revenue</span>
            <strong className="text-emerald-400 text-sm font-extrabold">{formatCurrency(combinedRevenue)}</strong>
          </div>
        </div>

        {/* Action Button */}
        {isActive && onDispatch && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDispatch();
            }}
            disabled={isDispatching || isBooked}
            className={`w-full py-2.5 rounded-lg text-xs font-extrabold border transition-all duration-200 ${
              isBooked
                ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-brand-600 border-brand-500 text-white hover:bg-brand-500 shadow-md shadow-brand-500/20'
            }`}
          >
            {isBooked ? 'Cargo Matches Dispatched' : 'Dispatch Return Load'}
          </button>
        )}

      </div>
    </div>
  );
}
export default RouteSuggestionCard;
