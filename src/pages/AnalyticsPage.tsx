import React from 'react';
import { PageWrapper } from '@/layouts/PageWrapper';
import { useAnalytics } from '@/hooks/useAnalytics';
import { KpiGrid } from '@/features/analytics/components/KpiGrid';
import { BookingTrendChart } from '@/features/analytics/components/BookingTrendChart';
import { FuelEfficiencyChart } from '@/features/analytics/components/FuelEfficiencyChart';
import { RoutePerformanceTable } from '@/features/analytics/components/RoutePerformanceTable';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, RefreshCw } from 'lucide-react';

const PIE_COLORS = ['#10B981', '#3B82F6', '#EF4444'];

export function AnalyticsPage() {
  const { data: analyticsResponse, isLoading, refetch } = useAnalytics();

  const analytics = analyticsResponse?.data || {
    kpis: [],
    bookingTrend: [],
    financialTrend: [],
    fuelEfficiency: [],
    routePerformance: [],
    successRate: [],
    utilisation: [],
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <PageWrapper
      title="Analytics & Reporting"
      description="Fleet performance analytics, booking volumes, financial statements, and vehicle diagnostics trends."
      actions={
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-slate-100 transition-all select-none"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Reload Data
        </button>
      }
    >
      <div className="space-y-8">
        
        {/* KPI Grid */}
        <KpiGrid kpis={analytics.kpis} isLoading={isLoading} />

        {/* First Row: Bookings & Fuel efficiency */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BookingTrendChart data={analytics.bookingTrend} isLoading={isLoading} />
          <FuelEfficiencyChart data={analytics.fuelEfficiency} isLoading={isLoading} />
        </div>

        {/* Second Row: Monthly P&L and Distributions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue vs Expenses */}
          <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4 text-left">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Revenue vs Expenses</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Quarterly breakdown of gross billing against operational outgoings.</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.financialTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    formatter={(val: number) => [formatCurrency(val), '']}
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#E2E8F0',
                    }}
                    labelClassName="font-bold text-slate-400"
                  />
                  <Legend verticalAlign="top" height={36} iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="revenue" name="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Success rate & Utilisation */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4 text-left flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Trip Success Breakdown</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Success rates of bookings over the current cycle.</p>
            </div>
            <div className="h-44 w-full flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.successRate}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.successRate.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#E2E8F0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-extrabold text-slate-100">92%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Success</span>
              </div>
            </div>
            {/* Legend guide */}
            <div className="flex items-center justify-around gap-2 text-[10px] text-slate-400 font-medium">
              {analytics.successRate.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                  <span>{entry.name} ({entry.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Third Row: Route Performance corridors table */}
        <div className="glass-panel p-6 rounded-xl space-y-4 text-left">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="h-5 w-5 text-brand-400" />
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Route Corridor Performance Yields</h2>
          </div>
          <RoutePerformanceTable data={analytics.routePerformance} isLoading={isLoading} />
        </div>

      </div>
    </PageWrapper>
  );
}
export default AnalyticsPage;
