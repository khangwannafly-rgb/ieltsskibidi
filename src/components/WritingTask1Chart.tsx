'use client';

import React, { useState, useEffect } from 'react';
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
import { Map as MapIcon, RefreshCw, Layout, ArrowRight } from 'lucide-react';

interface ChartData {
  type: 'bar' | 'line' | 'pie' | 'table' | 'map' | 'process' | 'multiple';
  title: string;
  labels?: string[];
  datasets?: {
    label: string;
    data: number[];
  }[];
  description?: string;
  charts?: {
    type: 'bar' | 'line' | 'pie' | 'table';
    title: string;
    labels: string[];
    datasets: {
      label: string;
      data: number[];
    }[];
  }[];
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function WritingTask1Chart({ data }: { data: ChartData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderSingleChart = (chart: any, index?: number) => {
    if (!chart || !chart.labels || !chart.datasets) {
      return (
        <div key={index} className="w-full h-full flex items-center justify-center p-8 bg-slate-900/50 rounded-2xl border border-white/5">
          <p className="text-slate-400 text-sm italic">Đang chuẩn bị dữ liệu biểu đồ...</p>
        </div>
      );
    }

    const formattedData = chart.labels.map((label: string, i: number) => {
      const entry: any = { name: label };
      chart.datasets.forEach((dataset: any) => {
        if (dataset && dataset.data) {
          entry[dataset.label] = dataset.data[i];
        }
      });
      return entry;
    });

    if (chart.type === 'table') {
      return (
        <div key={index} className="w-full h-full flex flex-col">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{chart.title}</h3>
            <div className="h-1 w-8 bg-indigo-500 rounded-full mt-1.5" />
          </div>
          <div className="flex-1 overflow-auto border border-slate-700/50 rounded-2xl bg-slate-900 shadow-sm">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Mục</th>
                  {chart.datasets.map((ds: any) => (
                    <th key={ds.label} className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{ds.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-slate-900 divide-y divide-slate-800">
                {chart.labels.map((label: string, idx: number) => (
                  <tr key={label} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-200">{label}</td>
                    {chart.datasets.map((ds: any) => (
                      <td key={ds.label} className="px-6 py-4 whitespace-nowrap text-sm text-slate-400 font-medium">{ds.data ? ds.data[idx] : '-'}</td>
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
      <div key={index} className="w-full h-full min-h-[300px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{chart.title}</h3>
          <div className="h-1 w-8 bg-indigo-500 rounded-full mt-1.5" />
        </div>
        <div className="flex-1 min-h-0 w-full">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              {chart.type === 'bar' ? (
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0f172a', color: '#fff' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" height={30} wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }} />
                  {chart.datasets.map((ds: any, idx: number) => (
                    <Bar key={ds.label} dataKey={ds.label} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} barSize={24} />
                  ))}
                </BarChart>
              ) : chart.type === 'line' ? (
                <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0f172a', color: '#fff' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" height={30} wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8' }} />
                  {chart.datasets.map((ds: any, idx: number) => (
                    <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={COLORS[idx % COLORS.length]} strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#0f172a' }} />
                  ))}
                </LineChart>
              ) : chart.type === 'pie' && chart.datasets?.[0]?.data ? (
                <PieChart>
                  <Pie data={chart.datasets[0].data.map((val: number, i: number) => ({ name: chart.labels[i], value: val }))} cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5} dataKey="value" stroke="none">
                    {chart.datasets[0].data.map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', backgroundColor: '#0f172a', color: '#fff' }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#94a3b8', paddingTop: '10px' }} />
                </PieChart>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Dữ liệu không khả dụng</p>
                </div>
              )}
            </ResponsiveContainer>
          )}
        </div>
      </div>
    );
  };

  if (data.type === 'multiple' && data.charts) {
    return (
      <div className="w-full h-full flex flex-col space-y-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{data.title}</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Dạng bài: Kết hợp (Multiple Charts)</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-12">
          {data.charts.map((chart, idx) => (
            <div key={idx} className="bg-slate-900/40 p-8 rounded-[2rem] border border-white/5">
              {renderSingleChart(chart, idx)}
            </div>
          ))}
        </div>

        {data.description && (
          <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/10 text-center">
            <p className="text-sm text-slate-400 font-medium italic">"{data.description}"</p>
          </div>
        )}
      </div>
    );
  }

  if (data.type === 'map' || data.type === 'process') {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
              {data.type === 'map' ? <MapIcon className="w-5 h-5" /> : <RefreshCw className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-200 tracking-wider uppercase">{data.title}</h3>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Dạng bài: {data.type === 'map' ? 'Bản đồ (Map)' : 'Quy trình (Process)'}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-900/40 rounded-[2.5rem] border border-white/5 p-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="w-28 h-28 bg-slate-800/80 rounded-[2.5rem] flex items-center justify-center border border-white/10 relative z-10 shadow-2xl group-hover:scale-110 transition-transform duration-500">
            {data.type === 'map' ? (
              <Layout className="w-12 h-12 text-indigo-400" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <ArrowRight className="w-10 h-10 text-indigo-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/30" />
              </div>
            )}
          </div>

          <div className="max-w-xl space-y-6 relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-black text-indigo-400 uppercase tracking-widest">
              Thông tin chi tiết
            </div>
            <p className="text-lg text-slate-300 font-medium leading-relaxed italic">
              "{data.description || "Đang tải dữ liệu mô tả trực quan cho biểu đồ..."}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl relative z-10">
            {data.labels?.map((label, idx) => (
              <div key={idx} className="p-5 bg-slate-800/40 rounded-2xl border border-white/5 text-left hover:bg-slate-800/60 transition-colors group/item">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/20 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {data.type === 'map' ? 'Giai đoạn / Vị trí' : 'Bước thực hiện'}
                  </span>
                </div>
                <span className="text-sm font-bold text-slate-200 block pl-9">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return renderSingleChart(data);
}
