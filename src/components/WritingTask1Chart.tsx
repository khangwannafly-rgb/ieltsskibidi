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

const COLORS = ['#0f172a', '#1d4ed8', '#0d9488', '#d97706', '#4f46e5', '#64748b'];

export default function WritingTask1Chart({ data }: { data: ChartData }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderSingleChart = (chart: any, index?: number) => {
    if (!chart || !chart.labels || !chart.datasets) {
      return (
        <div key={index} className="w-full h-full flex items-center justify-center p-8 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">Đang chuẩn bị dữ liệu biểu đồ...</p>
        </div>
      );
    }

    const formattedData = chart.labels.map((label: string, i: number) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entry: any = { name: label };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      chart.datasets.forEach((dataset: any) => {
        if (dataset && dataset.data) {
          const raw = dataset.data[i];
          const num = typeof raw === 'number' ? raw : parseFloat(String(raw ?? '').replace(/[^0-9.-]/g, ''));
          entry[dataset.label] = Number.isFinite(num) ? num : 0;
        }
      });
      return entry;
    });

    if (chart.type === 'table') {
      return (
        <div key={index} className="w-full h-full flex flex-col">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">{chart.title}</h3>
          </div>
          <div className="flex-1 overflow-auto border border-slate-200 rounded-xl bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Hạng mục</th>
                  {chart.datasets.map((ds: { label: string }) => (
                    <th key={ds.label} className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">{ds.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {chart.labels.map((label: string, idx: number) => (
                  <tr key={label} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-slate-900">{label}</td>
                    {chart.datasets.map((ds: { label: string; data?: (number | string)[] }) => (
                      <td key={ds.label} className="px-5 py-3 whitespace-nowrap text-sm text-slate-700 font-mono">{ds.data ? ds.data[idx] : '-'}</td>
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
      <div key={index} className="w-full h-full min-h-[290px] flex flex-col">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">{chart.title}</h3>
        </div>
        <div className="flex-1 min-h-0 w-full">
          {isMounted && (
            <ResponsiveContainer width="100%" height="100%">
              {chart.type === 'bar' ? (
                <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(29, 78, 216, 0.04)' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '12px' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" height={30} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                  {chart.datasets.map((ds: { label: string }, idx: number) => (
                    <Bar key={ds.label} dataKey={ds.label} fill={COLORS[idx % COLORS.length]} radius={[3, 3, 0, 0]} barSize={22} />
                  ))}
                </BarChart>
              ) : chart.type === 'line' ? (
                <LineChart data={formattedData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} dy={8} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '12px' }} />
                  <Legend verticalAlign="top" align="right" iconType="circle" height={30} wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                  {chart.datasets.map((ds: { label: string }, idx: number) => (
                    <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={COLORS[idx % COLORS.length]} strokeWidth={2.5} dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }} />
                  ))}
                </LineChart>
              ) : chart.type === 'pie' && chart.datasets?.[0]?.data ? (
                <PieChart>
                  <Pie data={chart.datasets[0].data.map((val: number | string, i: number) => ({ name: chart.labels[i], value: typeof val === 'number' ? val : parseFloat(String(val ?? '').replace(/[^0-9.-]/g, '')) || 0 }))} cx="50%" cy="50%" innerRadius="55%" outerRadius="78%" paddingAngle={3} dataKey="value" stroke="#ffffff" strokeWidth={2}>
                    {chart.datasets[0].data.map((_: unknown, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-85 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" align="center" iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569', paddingTop: '10px' }} />
                </PieChart>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-slate-500 text-xs font-medium">Dữ liệu không khả dụng</p>
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
      <div className="w-full h-full flex flex-col space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 border border-blue-200">
            <Layout className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{data.title}</h3>
            <p className="text-xs font-medium text-slate-500">Dạng bài: Biểu đồ kết hợp (Multiple Charts)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {data.charts.map((chart, idx) => (
            <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              {renderSingleChart(chart, idx)}
            </div>
          ))}
        </div>

        {data.description && (
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <p className="text-xs text-slate-600 leading-relaxed">{data.description}</p>
          </div>
        )}
      </div>
    );
  }

  if (data.type === 'map' || data.type === 'process') {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 border border-blue-200">
              {data.type === 'map' ? <MapIcon className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{data.title}</h3>
              <p className="text-xs font-medium text-slate-500">
                Dạng bài: {data.type === 'map' ? 'Sơ đồ / Bản đồ (Map Comparison)' : 'Quy trình (Process Diagram)'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-between space-y-6">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider mb-1">
              Mô tả Sơ đồ / Quy trình
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">
              {data.description || 'Đang tải dữ liệu mô tả trực quan cho sơ đồ...'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            {data.labels?.map((label, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-white rounded-lg border border-slate-200 text-left hover:border-blue-300 transition-all flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
                    <span>{data.type === 'map' ? 'Khu vực / Thay đổi' : `Bước ${idx + 1}`}</span>
                    {data.type === 'process' && idx < (data.labels?.length || 0) - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 leading-snug block">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return renderSingleChart(data);
}
