import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import type { BookingTrend } from '@/types/analytics';

interface BookingTrendChartProps {
  data: BookingTrend[];
  isLoading?: boolean;
}

export function BookingTrendChart({ data, isLoading }: BookingTrendChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
  }));

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-center text-slate-500 font-medium">
        Loading booking trend...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bookings Volume Trend</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Daily volume of dispatched and completed bookings over the last 15 days.</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="bookingAreaColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis 
              dataKey="formattedDate" 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid #334155',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#E2E8F0',
              }}
              labelClassName="font-bold text-slate-400"
            />
            <Area 
              type="monotone" 
              dataKey="bookings" 
              name="Bookings"
              stroke="#10B981" 
              fillOpacity={1} 
              fill="url(#bookingAreaColor)" 
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default BookingTrendChart;
