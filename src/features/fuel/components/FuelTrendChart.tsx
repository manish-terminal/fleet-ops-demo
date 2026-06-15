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
import type { FuelReading } from '@/types/fuel';

interface FuelTrendChartProps {
  readings: FuelReading[];
  isLoading?: boolean;
}

export function FuelTrendChart({ readings, isLoading }: FuelTrendChartProps) {
  // Sort readings by date to render left-to-right correctly
  const data = [...readings]
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())
    .slice(-48) // Limit to the last 48 readings (~2 days of hourly data) for readability
    .map((r) => ({
      time: new Date(r.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date(r.recordedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      'Fuel Level (%)': r.percentage,
      'Consumption (L/100km)': r.consumption,
    }));

  if (isLoading) {
    return (
      <div className="h-64 w-full bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-center text-slate-500 font-medium">
        Loading historical fuel trend...
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 w-full bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-center text-slate-500 font-medium">
        No fuel telemetry data available.
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Telemetry Trend (Last 48 Hours)</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Tracks fuel level depletion/refueling cycles and consumption spikes.</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fuelColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="consumeColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis 
              dataKey="time" 
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
              domain={[0, 100]}
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
              dataKey="Fuel Level (%)" 
              stroke="#3B82F6" 
              fillOpacity={1} 
              fill="url(#fuelColor)" 
              strokeWidth={2}
            />
            <Area 
              type="monotone" 
              dataKey="Consumption (L/100km)" 
              stroke="#EF4444" 
              fillOpacity={1} 
              fill="url(#consumeColor)" 
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default FuelTrendChart;
