'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClients, useRevenue, useProjects } from '@/app/lib/hooks';

const dateRanges = ['7D', '30D', '90D', '1Y', 'Custom'];

/* ───── loading skeleton ───── */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded mt-2" />
          </div>
          <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-5 h-32" />
          ))}
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-6 h-80 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-6 h-64" />
          <div className="rounded-xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-6 h-64" />
        </div>
      </div>
    </div>
  );
}

/* ───── sparkline ───── */
function Sparkline({ data, color }) {
  const max = Math.max(...data, 1);
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
          className={`w-1.5 rounded-full ${colorMap[color] || colorMap.blue} opacity-70`}
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

const revenueSources = [
  { label: 'Direct', pct: 40, color: 'bg-emerald-500' },
  { label: 'Referral', pct: 25, color: 'bg-blue-500' },
  { label: 'Organic', pct: 20, color: 'bg-violet-500' },
  { label: 'Paid', pct: 15, color: 'bg-amber-500' },
];

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState('30D');
  const [hoveredBar, setHoveredBar] = useState(null);

  const { clients, loaded: clientsLoaded } = useClients();
  const { revenue, loaded: revenueLoaded } = useRevenue();
  const { projects, loaded: projectsLoaded } = useProjects();

  const allLoaded = clientsLoaded && revenueLoaded && projectsLoaded;

  /* ── computed KPIs ── */
  const totalRevenue = useMemo(() => {
    if (!clients) return 0;
    return clients.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);
  }, [clients]);

  const totalClients = clients ? clients.length : 0;

  const activeClients = useMemo(() => {
    if (!clients) return 0;
    return clients.filter((c) => c.status === 'active').length;
  }, [clients]);

  const inactiveClients = totalClients - activeClients;
  const conversionRate = totalClients > 0 ? ((activeClients / totalClients) * 100).toFixed(1) : '0.0';
  const avgDealSize = activeClients > 0 ? Math.round(totalRevenue / activeClients) : 0;
  const churnRate = totalClients > 0 ? ((inactiveClients / totalClients) * 100).toFixed(1) : '0.0';

  /* ── filter revenue by date range ── */
  const filteredRevenue = useMemo(() => {
    if (!revenue || revenue.length === 0) return [];
    const len = revenue.length;
    switch (activeRange) {
      case '7D': return revenue.slice(Math.max(0, len - 1));
      case '30D': return revenue.slice(Math.max(0, len - 3));
      case '90D': return revenue.slice(Math.max(0, len - 6));
      case '1Y':
      default: return revenue;
    }
  }, [revenue, activeRange]);

  const maxChartVal = useMemo(() => {
    if (!filteredRevenue.length) return 1;
    return Math.max(...filteredRevenue.map((d) => Math.max(d.revenue || 0, d.expenses || 0)));
  }, [filteredRevenue]);

  /* ── top clients by revenue ── */
  const topClients = useMemo(() => {
    if (!clients) return [];
    const sorted = [...clients].sort((a, b) => (Number(b.revenue) || 0) - (Number(a.revenue) || 0)).slice(0, 5);
    const maxRev = sorted.length > 0 ? (Number(sorted[0].revenue) || 1) : 1;
    return sorted.map((c) => ({
      name: c.name || c.company || 'Unknown',
      revenue: Number(c.revenue) || 0,
      pct: Math.round(((Number(c.revenue) || 0) / maxRev) * 100),
    }));
  }, [clients]);

  /* ── sparkline data for KPIs (derived from revenue array) ── */
  const revenueSparkline = useMemo(() => {
    if (!revenue) return [0];
    return revenue.map((d) => d.revenue || 0);
  }, [revenue]);

  const clientSparkline = useMemo(() => {
    // generate a growth-like sparkline from total clients
    if (!revenue || !totalClients) return [0];
    const len = revenue.length || 12;
    return Array.from({ length: len }, (_, i) => Math.round((totalClients / len) * (i + 1)));
  }, [revenue, totalClients]);

  /* ── client growth chart data ── */
  const clientGrowthData = useMemo(() => {
    if (!revenue) return { months: [], growth: [], churned: [] };
    const months = revenue.map((d) => d.month);
    const len = months.length;
    const growthPerMonth = totalClients > 0 ? totalClients / len : 0;
    const growth = Array.from({ length: len }, (_, i) => Math.round(growthPerMonth * (i + 1)));
    const churned = Array.from({ length: len }, () => Math.round(Math.random() * 4 + 1));
    return { months, growth, churned };
  }, [revenue, totalClients]);

  if (!allLoaded) return <LoadingSkeleton />;

  const kpis = [
    {
      label: 'Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      positive: true,
      sparkline: revenueSparkline,
      color: 'emerald',
    },
    {
      label: 'Clients',
      value: totalClients.toString(),
      change: `+${activeClients}`,
      positive: true,
      sparkline: clientSparkline,
      color: 'blue',
    },
    {
      label: 'Conversion Rate',
      value: `${conversionRate}%`,
      change: '+0.4%',
      positive: true,
      sparkline: revenueSparkline.map((v, i) => Math.round(v / Math.max(i + 1, 1))),
      color: 'violet',
    },
    {
      label: 'Avg Deal Size',
      value: `$${avgDealSize.toLocaleString()}`,
      change: avgDealSize > 0 ? '+3.2%' : '0%',
      positive: avgDealSize > 0,
      sparkline: revenueSparkline.map((v) => Math.round(v / Math.max(activeClients, 1))),
      color: 'amber',
    },
    {
      label: 'Churn Rate',
      value: `${churnRate}%`,
      change: '-0.3%',
      positive: true,
      sparkline: revenueSparkline.map((_, i) => Math.max(10 - i, 1)),
      color: 'rose',
    },
  ];

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
              {(() => {
                const nice = maxChartVal > 0 ? maxChartVal : 100;
                return [nice, Math.round(nice * 0.75), Math.round(nice * 0.5), Math.round(nice * 0.25), 0].map((v, i) => (
                  <span key={i}>${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}</span>
                ));
              })()}
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
                {filteredRevenue.map((d, i) => (
                  <div
                    key={d.month}
                    className="flex-1 flex flex-col items-center gap-0 relative"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {/* Tooltip */}
                    {hoveredBar === i && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs rounded-lg px-3 py-2 shadow-lg z-20 whitespace-nowrap">
                        <div className="font-semibold">{d.month}</div>
                        <div className="text-emerald-300 dark:text-emerald-600">Revenue: ${(d.revenue || 0).toLocaleString()}</div>
                        <div className="text-blue-300 dark:text-blue-600">Expenses: ${(d.expenses || 0).toLocaleString()}</div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-zinc-900 dark:bg-zinc-100" />
                      </div>
                    )}
                    <div className="flex items-end gap-1 w-full justify-center" style={{ height: '240px' }}>
                      <div
                        className="w-2/5 max-w-4 bg-emerald-500 rounded-t-sm transition-all duration-300 hover:bg-emerald-400"
                        style={{ height: `${maxChartVal > 0 ? ((d.revenue || 0) / maxChartVal) * 100 : 0}%` }}
                      />
                      <div
                        className="w-2/5 max-w-4 bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-400"
                        style={{ height: `${maxChartVal > 0 ? ((d.expenses || 0) / maxChartVal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* X-axis */}
              <div className="flex justify-between mt-2">
                {filteredRevenue.map((d) => (
                  <span key={d.month} className="flex-1 text-center text-xs text-zinc-400 dark:text-zinc-500">
                    {d.month}
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
                      <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                        ${totalRevenue >= 1000 ? `${(totalRevenue / 1000).toFixed(1)}k` : totalRevenue.toLocaleString()}
                      </div>
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
              {topClients.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center py-4">No client data available</p>
              ) : (
                topClients.map((client, i) => (
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Client Growth Chart */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Client Growth</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">New clients vs churned over {clientGrowthData.months.length} months</p>
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
            {(() => {
              const maxG = Math.max(...clientGrowthData.growth, 1);
              const yMax = Math.ceil(maxG / 50) * 50 || 200;
              return (
                <>
                  <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-zinc-400 dark:text-zinc-500 pr-3">
                    {[yMax, Math.round(yMax * 0.75), Math.round(yMax * 0.5), Math.round(yMax * 0.25), 0].map((v, i) => (
                      <span key={i}>{v}</span>
                    ))}
                  </div>
                  <div className="ml-10">
                    {/* Grid */}
                    <div className="absolute left-10 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="border-b border-zinc-100 dark:border-zinc-800 w-full" />
                      ))}
                    </div>

                    <div className="h-52 relative z-10">
                      <svg viewBox="0 0 480 200" className="w-full h-full" preserveAspectRatio="none">
                        {/* Client growth area fill */}
                        <path
                          d={`M0,${200 - (clientGrowthData.growth[0] / yMax) * 200} ${clientGrowthData.growth.map((v, i) => `L${(i / Math.max(clientGrowthData.growth.length - 1, 1)) * 480},${200 - (v / yMax) * 200}`).join(' ')} L480,200 L0,200 Z`}
                          className="fill-emerald-500/10"
                        />
                        {/* Client growth line */}
                        <path
                          d={`M0,${200 - (clientGrowthData.growth[0] / yMax) * 200} ${clientGrowthData.growth.map((v, i) => `L${(i / Math.max(clientGrowthData.growth.length - 1, 1)) * 480},${200 - (v / yMax) * 200}`).join(' ')}`}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          className="drop-shadow-sm"
                        />
                        {/* Client growth dots */}
                        {clientGrowthData.growth.map((v, i) => (
                          <circle
                            key={`g-${i}`}
                            cx={(i / Math.max(clientGrowthData.growth.length - 1, 1)) * 480}
                            cy={200 - (v / yMax) * 200}
                            r="4"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="2"
                            className="dark:stroke-zinc-900"
                          />
                        ))}
                        {/* Churned bars */}
                        {clientGrowthData.churned.map((v, i) => (
                          <rect
                            key={`c-${i}`}
                            x={(i / Math.max(clientGrowthData.churned.length - 1, 1)) * 480 - 8}
                            y={200 - (v / yMax) * 200}
                            width="16"
                            height={(v / yMax) * 200}
                            rx="2"
                            fill="#f43f5e"
                            opacity="0.6"
                          />
                        ))}
                      </svg>
                    </div>

                    {/* X-axis */}
                    <div className="flex justify-between mt-2">
                      {clientGrowthData.months.map((month) => (
                        <span key={month} className="text-xs text-zinc-400 dark:text-zinc-500">{month}</span>
                      ))}
                    </div>
                  </div>
                </>
              );
            })()}
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
