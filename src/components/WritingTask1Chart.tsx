'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'table';
  title: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function WritingTask1Chart({ data }: { data: ChartData }) {
  const formattedData = data.labels.map((label, index) => {
    const entry: any = { name: label };
    data.datasets.forEach((dataset) => {
      entry[dataset.label] = dataset.data[index];
    });
    return entry;
  });

  if (data.type === 'table') {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{data.title}</h3>
          <div className="h-1 w-8 bg-indigo-500 rounded-full mt-1.5" />
        </div>
        <div className="flex-1 overflow-auto border border-slate-700/50 rounded-2xl bg-slate-900 shadow-sm transition-colors">
          <table className="min-w-full divide-y divide-slate-800">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Mục
              </th>
              {data.datasets.map((ds: any) => (
                <th key={ds.label} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  {ds.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-900 divide-y divide-slate-800">
            {data.labels.map((label, idx) => (
              <tr key={label} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200">
                  {label}
                </td>
                {data.datasets.map((ds: any) => (
                  <td key={ds.label} className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">
                    {ds.data[idx]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{data.title}</h3>
          <div className="h-1 w-8 bg-indigo-500 rounded-full mt-1.5" />
        </div>
      </div>
      
      <div className="flex-1 min-h-0 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {data.type === 'bar' ? (
            <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontSize: '11px', fontWeight: 700, padding: '2px 0' }}
                labelStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                height={30} 
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '10px', color: '#94a3b8' }}
              />
              {data.datasets.map((ds, idx) => (
                <Bar 
                  key={ds.label} 
                  dataKey={ds.label} 
                  fill={COLORS[idx % COLORS.length]} 
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              ))}
            </BarChart>
          ) : data.type === 'line' ? (
            <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontSize: '11px', fontWeight: 700, padding: '2px 0' }}
                labelStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                height={30} 
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingBottom: '10px', color: '#94a3b8' }}
              />
              {data.datasets.map((ds, idx) => (
                <Line 
                  key={ds.label} 
                  type="monotone" 
                  dataKey={ds.label} 
                  stroke={COLORS[idx % COLORS.length]} 
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: COLORS[idx % COLORS.length] }}
                />
              ))}
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data.datasets[0].data.map((val, i) => ({ name: data.labels[i], value: val }))}
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.datasets[0].data.map((_, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-80 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  padding: '8px 12px'
                }}
                itemStyle={{ fontSize: '11px', fontWeight: 700, padding: '2px 0' }}
                labelStyle={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px', color: 'rgba(255, 255, 255, 0.5)' }}
              />
              <Legend 
                verticalAlign="bottom" 
                align="center"
                iconType="circle"
                wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '20px', color: '#94a3b8' }}
              />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
