import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Landmark, Receipt } from 'lucide-react';

interface ProfitSummaryCardProps {
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  margin: number;
  isLoading?: boolean;
}

export function ProfitSummaryCard({
  totalRevenue,
  totalExpenses,
  profit,
  margin,
  isLoading,
}: ProfitSummaryCardProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-panel animate-pulse h-28 rounded-xl bg-slate-900/40 border-slate-800" />
        ))}
      </div>
    );
  }

  const isProfitPositive = profit >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Revenue */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-4 text-left relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Revenue</span>
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Landmark className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold text-slate-100">{formatCurrency(totalRevenue)}</h3>
          <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Billing logs invoices
          </p>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-4 text-left relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Expenses</span>
          <div className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
            <Receipt className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold text-slate-100">{formatCurrency(totalExpenses)}</h3>
          <p className="text-[10px] text-red-400 font-bold flex items-center gap-1">
            <TrendingDown className="h-3 w-3" /> Operational debits
          </p>
        </div>
      </div>

      {/* Net Profit */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-4 text-left relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Net Profit</span>
          <div className={`p-2 rounded-lg border ${
            isProfitPositive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            <IndianRupee className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className={`text-2xl font-extrabold ${isProfitPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(profit)}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            Revenue minus expenses
          </p>
        </div>
      </div>

      {/* Profit Margin */}
      <div className="glass-panel rounded-xl p-5 border-slate-800/80 space-y-4 text-left relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Profit Margin</span>
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-2xl font-extrabold text-slate-100">{margin}%</h3>
          <p className="text-[10px] text-blue-400 font-bold">
            Average return rate
          </p>
        </div>
      </div>
    </div>
  );
}
export default ProfitSummaryCard;
