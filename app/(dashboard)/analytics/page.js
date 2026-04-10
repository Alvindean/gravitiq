'use client';

import { useState } from 'react';
import Link from 'next/link';

const kpis = [
  {
    label: 'Revenue',
    value: '$48,235',
    change: '+12.5%',
    positive: true,
    sparkline: [35, 42, 38, 55, 48, 62, 58, 72, 68, 78, 82, 88],
    color: 'emerald',
  },
  {
    label: 'Clients',
    value: '156',
    change: '+5.2%',
    positive: true,
    sparkline: [20, 24, 28, 30, 32, 35, 38, 40, 44, 48, 50, 56],
    color: 'blue',
  },
  {
    label: 'Conversion Rate',
    value: '3.8%',
    change: '+0.4%',
    positive: true,
    sparkline: [28, 32, 30, 35, 38, 36, 40, 42, 39, 44, 46, 48],
    color: 'violet',
  },
  {
    label: 'Avg Deal Size',
    value: '$2,150',
    change: '-2.1%',
    positive: false,
    sparkline: [60, 58, 62, 55, 50, 52, 48, 46, 50, 44, 42, 40],
    color: 'amber',
  },
  {
    label: 'Churn Rate',
    value: '1.2%',
    change: '-0.3%',
    positive: true,
    sparkline: [30, 28, 32, 26, 24, 22, 20, 18, 16, 15, 14, 12],
    color: 'rose',
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const revenueData = [32, 41, 38, 52, 48, 61, 55, 70, 64, 78, 72, 85];
const expenseData = [22, 28, 25, 35, 30, 38, 34, 42, 40, 48, 45, 52];

const revenueSources = [
  { label: 'Direct', pct: 40, color: 'bg-emerald-500' },
  { label: 'Referral', pct: 25, color: 'bg-blue-500' },
  { label: 'Organic', pct: 20, color: 'bg-violet-500' },
  { label: 'Paid', pct: 15, color: 'bg-amber-500' },
];

const topClients = [
  { name: 'Acme Corporation', revenue: 8420, pct: 85 },
  { name: 'TechVision Inc.', revenue: 6850, pct: 69 },
  { name: 'Global Dynamics', revenue: 5230, pct: 53 },
  { name: 'Pinnacle Group', revenue: 4100, pct: 41 },
  { name: 'Summit Partners', revenue: 3200, pct: 32 },
];

const clientGrowth = [82, 90, 96, 104, 108, 115, 120, 128, 134, 140, 148, 156];
const clientChurned = [4, 3, 5, 2, 4, 3, 2, 5, 3, 4, 2, 3];

const dateRanges = ['7D', '30D', '90D', '1Y', 'Custom'];

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    violet: 'bg-violet-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };
  return (
    <div className="flex items-end gap-[2px] h-8">
      {data.map((val, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full ${colorMap[color]} opacity-70`}
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState('30D');
  const [hoveredBar, setHoveredBar] = useState(null);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Analytics</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Track your business performance and growth metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-1">
              {dateRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setActiveRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeRange === range
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{kpi.label}</span>
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    kpi.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-3 w-3 mr-0.5 ${kpi.positive ? '' : 'rotate-180'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">{kpi.value}</div>
              <Sparkline data={kpi.sparkline} color={kpi.color} />
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Revenue Overview</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Monthly revenue vs expenses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Revenue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Expenses</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-zinc-400 dark:text-zinc-500 pr-3">
              <span>$100k</span>
              <span>$75k</span>
              <span>$50k</span>
              <span>$25k</span>
              <span>$0</span>
            </div>
            {/* Chart area */}
            <div className="ml-12">
              {/* Grid lines */}
              <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 w-full" />
                ))}
              </div>
              {/* Bars */}
              <div className="flex items-end justify-between gap-2 h-64 relative z-10">
                {months.map((month, i) => (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-0 relative"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg px-3 py-2 shadow-lg z-20 whitespace-nowrap">
                        <div className="font-semibold">{month} 2026</div>
                        <div className="text-emerald-300 dark:text-emerald-600">Revenue: ${revenueData[i]}k</div>
                        <div className="text-blue-300 dark:text-blue-600">Expenses: ${expenseData[i]}k</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-900 dark:bg-zinc-100" />
                      </div>
                    )}
                    <div className="flex items-end gap-1 w-full justify-center" style={{ height: '240px' }}>
                      <div
                        className="w-2/5 max-w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 hover:bg-emerald-400"
                        style={{ height: `${(revenueData[i] / 100) * 100}%` }}
                      />
                      <div
                        className="w-2/5 max-w-4 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-400"
                        style={{ height: `${(expenseData[i] / 100) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* X-axis */}
              <div className="flex justify-between mt-2">
                {months.map((month) => (
                  <span key={month} className="flex-1 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    {month}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue by Source - Donut */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Revenue by Source</h2>
            <div className="flex items-center gap-8">
              {/* Donut chart simulation */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-40 h-40 rounded-full"
                  style={{
                    background: `conic-gradient(
                      #10b981 0% 40%,
                      #3b82f6 40% 65%,
                      #8b5cf6 65% 85%,
                      #f59e0b 85% 100%
                    )`,
                  }}
                >
                  <div className="absolute inset-5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">$48.2k</div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Legend */}
              <div className="flex-1 space-y-3">
                {revenueSources.map((source) => (
                  <div key={source.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${source.color}`} />
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">{source.label}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        <div
                          className={`h-full rounded-full ${source.color}`}
                          style={{ width: `${source.pct}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 w-10 text-right">
                        {source.pct}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Clients */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Top Clients by Revenue</h2>
            <div className="space-y-4">
              {topClients.map((client, i) => (
                <div key={client.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{client.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      ${client.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                      style={{ width: `${client.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Client Growth</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">New clients vs churned over 12 months</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Total Clients</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400">Churned</span>
              </div>
            </div>
          </div>

          {/* Line chart simulation */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-zinc-400 dark:text-zinc-500 pr-3">
              <span>200</span>
              <span>150</span>
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="ml-10">
              {/* Grid */}
              <div className="absolute left-10 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 w-full" />
                ))}
              </div>

              {/* Client growth line - using connected dots with line segments */}
              <div className="h-52 relative z-10">
                {/* SVG line chart */}
                <svg viewBox="0 0 480 200" className="w-full h-full" preserveAspectRatio="none">
                  {/* Client growth area fill */}
                  <path
                    d={`M0,${200 - (clientGrowth[0] / 200) * 200} ${clientGrowth.map((v, i) => `L${(i / 11) * 480},${200 - (v / 200) * 200}`).join(' ')} L480,200 L0,200 Z`}
                    className="fill-emerald-500/10"
                  />
                  {/* Client growth line */}
                  <path
                    d={`M0,${200 - (clientGrowth[0] / 200) * 200} ${clientGrowth.map((v, i) => `L${(i / 11) * 480},${200 - (v / 200) * 200}`).join(' ')}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    className="drop-shadow-sm"
                  />
                  {/* Client growth dots */}
                  {clientGrowth.map((v, i) => (
                    <circle
                      key={`g-${i}`}
                      cx={(i / 11) * 480}
                      cy={200 - (v / 200) * 200}
                      r="4"
                      fill="#10b981"
                      stroke="white"
                      strokeWidth="2"
                      className="dark:stroke-zinc-900"
                    />
                  ))}
                  {/* Churned bars */}
                  {clientChurned.map((v, i) => (
                    <rect
                      key={`c-${i}`}
                      x={(i / 11) * 480 - 8}
                      y={200 - (v / 200) * 200}
                      width="16"
                      height={(v / 200) * 200}
                      rx="2"
                      fill="#f43f5e"
                      opacity="0.6"
                    />
                  ))}
                </svg>
              </div>

              {/* X-axis */}
              <div className="flex justify-between mt-2">
                {months.map((month) => (
                  <span key={month} className="text-xs text-zinc-400 dark:text-zinc-500">{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick link to Reports */}
        <div className="mt-8 text-center">
          <Link
            href="/analytics/reports"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
          >
            View all reports
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
