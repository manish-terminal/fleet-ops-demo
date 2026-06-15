import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import type { FuelEfficiency } from '@/types/analytics';

interface FuelEfficiencyChartProps {
  data: FuelEfficiency[];
  isLoading?: boolean;
}

export function FuelEfficiencyChart({ data, isLoading }: FuelEfficiencyChartProps) {
  if (isLoading) {
    return (
      <div className="h-64 w-full bg-slate-900/20 border border-slate-800/80 rounded-xl flex items-center justify-center text-slate-500 font-medium">
        Loading fuel efficiency data...
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fuel Consumption by Truck</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Average fuel efficiency rate (L/100km) per vehicle. Lower values are better.</p>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis 
              dataKey="plateNumber" 
              stroke="#64748B" 
              fontSize={9} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(tick) => tick.slice(0, 7)} // truncate long plate numbers
            />
            <YAxis 
              stroke="#64748B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
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
            <Bar 
              dataKey="efficiency" 
              name="Avg L/100km"
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default FuelEfficiencyChart;
