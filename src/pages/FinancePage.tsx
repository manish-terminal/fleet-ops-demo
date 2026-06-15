import React, { useState } from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import {
  useFinanceSummary,
  useRevenueEntries,
  useExpenseEntries,
  useProfitSummaries,
} from '@/hooks/useFinance';
import { ProfitSummaryCard } from '@/features/finance/components/ProfitSummaryCard';
import { RevenueTable } from '@/features/finance/components/RevenueTable';
import { ExpenseLog } from '@/features/finance/components/ExpenseLog';
import { DataTable, type Column } from '@/components/ui/DataTable/DataTable';
import { Download, Landmark, Receipt, BarChart2 } from 'lucide-react';
import { useToast } from '@/hooks/useToast';

type TabType = 'revenue' | 'expenses' | 'profitability';

export function FinancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('revenue');
  const { success } = useToast();

  const { data: summaryResponse, isLoading: isLoadingSummary } = useFinanceSummary();
  const { data: revenueResponse, isLoading: isLoadingRevenue } = useRevenueEntries();
  const { data: expenseResponse, isLoading: isLoadingExpenses } = useExpenseEntries();
  const { data: profitResponse, isLoading: isLoadingProfit } = useProfitSummaries();

  const summary = summaryResponse?.data || { totalRevenue: 0, totalExpenses: 0, profit: 0, margin: 0 };
  const revenues = revenueResponse?.data || [];
  const expenses = expenseResponse?.data || [];
  const profitSummaries = profitResponse?.data || [];

  const handleExportPDF = () => {
    success('Export Triggered', 'Successfully exported Financial Statement statement for Q2 2026.');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Columns for the truck profitability tab table
  const profitabilityColumns: Column<any>[] = [
    {
      key: 'vehiclePlate',
      header: 'Truck Plate',
      cell: (row) => <span className="font-bold text-slate-100">{row.vehiclePlate}</span>,
    },
    {
      key: 'period',
      header: 'Quarterly Period',
      cell: (row) => <span className="text-slate-400 font-mono text-xs">{row.period}</span>,
    },
    {
      key: 'totalRevenue',
      header: 'Revenue (INR)',
      cell: (row) => <span className="font-semibold text-slate-200">{formatCurrency(row.totalRevenue)}</span>,
    },
    {
      key: 'totalExpenses',
      header: 'Expenses (INR)',
      cell: (row) => <span className="font-semibold text-slate-400">{formatCurrency(row.totalExpenses)}</span>,
    },
    {
      key: 'profit',
      header: 'Net Profit (INR)',
      cell: (row) => {
        const isPositive = row.profit >= 0;
        return (
          <span className={`font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
            {formatCurrency(row.profit)}
          </span>
        );
      },
    },
    {
      key: 'margin',
      header: 'Margin %',
      cell: (row) => {
        const isPositive = row.margin >= 0;
        return (
          <span className={`font-bold ${isPositive ? 'text-blue-400' : 'text-slate-400'}`}>
            {row.margin}%
          </span>
        );
      },
    },
  ];

  return (
    <PageWrapper
      title="Financial Tracking"
      description="Operational revenues, maintenance/fuel expenses, and individual truck profitability statements."
      actions={
        <div className="flex items-center gap-3">
          <select className="bg-slate-900 border border-slate-800 text-slate-300 text-xs font-semibold px-3 py-2 rounded-lg focus:outline-none focus:border-brand-500">
            <option value="2026-q2">Q2 2026 (Active)</option>
            <option value="2026-q1">Q1 2026</option>
            <option value="2025-q4">Q4 2025</option>
          </select>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all select-none"
          >
            <Download className="h-3.5 w-3.5" /> Export PDF Statement
          </button>
        </div>
      }
    >
      <div className="space-y-8">
        
        {/* KPI Summaries */}
        <ProfitSummaryCard
          totalRevenue={summary.totalRevenue}
          totalExpenses={summary.totalExpenses}
          profit={summary.profit}
          margin={summary.margin}
          isLoading={isLoadingSummary}
        />

        {/* Tabbed content log */}
        <div className="glass-panel rounded-xl overflow-hidden border-slate-800/80">
          
          {/* Tab selector menu */}
          <div className="flex border-b border-slate-800 bg-slate-950/60 p-2 gap-1 select-none">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'revenue'
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Landmark className="h-3.5 w-3.5" /> Revenue Logs
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'expenses'
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Receipt className="h-3.5 w-3.5" /> Expense Logs
            </button>
            <button
              onClick={() => setActiveTab('profitability')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'profitability'
                  ? 'bg-brand-600/10 text-brand-400 border border-brand-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" /> Profit by Truck
            </button>
          </div>

          {/* Grid content panels */}
          <div className="p-6">
            {activeTab === 'revenue' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Invoiced Income Statement</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Total {revenues.length} payments</span>
                </div>
                <RevenueTable entries={revenues} isLoading={isLoadingRevenue} />
              </div>
            )}

            {activeTab === 'expenses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Cost Log</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Total {expenses.length} claims</span>
                </div>
                <ExpenseLog entries={expenses} isLoading={isLoadingExpenses} />
              </div>
            )}

            {activeTab === 'profitability' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center text-left">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Truck-by-Truck Yield Statement</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Calculated for 2026-Q2</span>
                </div>
                <DataTable
                  columns={profitabilityColumns}
                  data={profitSummaries}
                  isLoading={isLoadingProfit}
                />
              </div>
            )}
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
export default FinancePage;
