'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

/* ───── greeting helper ───── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ───── stat card ───── */
function StatCard({ label, value, change, changeLabel, color, icon }) {
  const colorMap = {
    green: {
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      icon: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      icon: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-500/10',
      icon: 'text-violet-600 dark:text-violet-400',
      badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-500/10',
      icon: 'text-indigo-600 dark:text-indigo-400',
      badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
    },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-black/5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}>
          <span className={c.icon}>{icon}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
          {change.startsWith('+') && (
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          )}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted mt-1">{label}</p>
      <p className="text-xs text-muted mt-0.5">{changeLabel}</p>
    </div>
  );
}

/* ───── activity data ───── */
const activities = [
  {
    id: 1,
    text: 'New client John Smith added',
    time: '2 minutes ago',
    type: 'Client',
    typeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  },
  {
    id: 2,
    text: 'Invoice #1234 paid',
    time: '15 minutes ago',
    type: 'Invoice',
    typeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
  },
  {
    id: 3,
    text: 'AI Report generated for Q1',
    time: '1 hour ago',
    type: 'AI',
    typeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400',
  },
  {
    id: 4,
    text: 'Project Alpha milestone completed',
    time: '3 hours ago',
    type: 'Project',
    typeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  },
  {
    id: 5,
    text: 'Team meeting scheduled',
    time: '5 hours ago',
    type: 'Team',
    typeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
  },
];

/* ───── upcoming tasks ───── */
const tasks = [
  {
    id: 1,
    title: 'Client onboarding call with Acme Corp',
    due: 'Today, 2:00 PM',
    priority: 'high',
    assignee: 'AW',
    assigneeColor: 'from-indigo-400 to-violet-500',
  },
  {
    id: 2,
    title: 'Review Q1 financial report',
    due: 'Tomorrow, 10:00 AM',
    priority: 'high',
    assignee: 'SM',
    assigneeColor: 'from-emerald-400 to-teal-500',
  },
  {
    id: 3,
    title: 'Update project roadmap for Beta launch',
    due: 'Apr 12, 9:00 AM',
    priority: 'medium',
    assignee: 'JD',
    assigneeColor: 'from-amber-400 to-orange-500',
  },
  {
    id: 4,
    title: 'Send monthly newsletter to subscribers',
    due: 'Apr 14, 12:00 PM',
    priority: 'low',
    assignee: 'LK',
    assigneeColor: 'from-pink-400 to-rose-500',
  },
];

const priorityStyles = {
  high: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
};

/* ───── fake chart bars ───── */
const revenueData = [
  { month: 'Jul', height: 45 },
  { month: 'Aug', height: 62 },
  { month: 'Sep', height: 55 },
  { month: 'Oct', height: 78 },
  { month: 'Nov', height: 68 },
  { month: 'Dec', height: 85 },
  { month: 'Jan', height: 72 },
  { month: 'Feb', height: 90 },
  { month: 'Mar', height: 95 },
  { month: 'Apr', height: 88 },
];

const clientActivityData = [
  { month: 'Jul', value: 30 },
  { month: 'Aug', value: 45 },
  { month: 'Sep', value: 38 },
  { month: 'Oct', value: 60 },
  { month: 'Nov', value: 52 },
  { month: 'Dec', value: 70 },
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 80 },
  { month: 'Mar', value: 75 },
  { month: 'Apr', value: 85 },
];

/* ───── page ───── */
export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Welcome banner ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-6 lg:p-8">
        {/* decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {greeting}, Alvin
            </h1>
            <p className="mt-1.5 text-indigo-100 text-sm lg:text-base max-w-lg">
              Here&apos;s what&apos;s happening with your business today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Add Client
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value="$48,235"
          change="+12.5%"
          changeLabel="from last month"
          color="green"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Active Clients"
          value="156"
          change="+8 new"
          changeLabel="this month"
          color="blue"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          }
        />
        <StatCard
          label="Projects"
          value="34"
          change="12 active"
          changeLabel="in progress"
          color="violet"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          }
        />
        <StatCard
          label="AI Tasks"
          value="1,247"
          change="86 hrs saved"
          changeLabel="this month"
          color="indigo"
          icon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
            </svg>
          }
        />
      </div>

      {/* ── Charts section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue chart */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Revenue Overview</h2>
              <p className="text-sm text-muted mt-0.5">Monthly revenue for the past 10 months</p>
            </div>
            <select className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-surface-elevated text-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last 10 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48 px-1">
            {revenueData.map((d, i) => (
              <div key={d.month} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex justify-center">
                  <div
                    className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ${
                      i === revenueData.length - 2
                        ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                        : 'bg-indigo-200 dark:bg-indigo-500/30 hover:bg-indigo-300 dark:hover:bg-indigo-500/50'
                    }`}
                    style={{ height: `${d.height}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted font-medium">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Client activity chart */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Client Activity</h2>
              <p className="text-sm text-muted mt-0.5">Active clients per month</p>
            </div>
            <select className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-surface-elevated text-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last 10 months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          {/* Fake line chart using connected dots */}
          <div className="relative h-48 px-1">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="border-t border-border/50 w-full" />
              ))}
            </div>
            {/* SVG line */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area fill */}
              <path
                d={`M0,${180 - clientActivityData[0].value * 1.8} ${clientActivityData.map((d, i) => `L${i * (400 / (clientActivityData.length - 1))},${180 - d.value * 1.8}`).join(' ')} L400,180 L0,180 Z`}
                fill="url(#lineGrad)"
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="rgb(99 102 241)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={clientActivityData.map((d, i) => `${i * (400 / (clientActivityData.length - 1))},${180 - d.value * 1.8}`).join(' ')}
              />
              {/* Dots */}
              {clientActivityData.map((d, i) => (
                <circle
                  key={d.month}
                  cx={i * (400 / (clientActivityData.length - 1))}
                  cy={180 - d.value * 1.8}
                  r="4"
                  fill="rgb(99 102 241)"
                  stroke="white"
                  strokeWidth="2"
                />
              ))}
            </svg>
            {/* Month labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between translate-y-6">
              {clientActivityData.map((d) => (
                <span key={d.month} className="text-[10px] text-muted font-medium">{d.month}</span>
              ))}
            </div>
          </div>
          <div className="h-6" /> {/* spacer for labels */}
        </div>
      </div>

      {/* ── Recent activity + Upcoming tasks ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent activity */}
        <div className="xl:col-span-2 bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <Link href="/activity" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-elevated/50 transition-colors">
                {/* Icon dot */}
                <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{activity.text}</p>
                  <p className="text-xs text-muted mt-0.5">{activity.time}</p>
                </div>
                <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${activity.typeColor}`}>
                  {activity.type}
                </span>
                <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors shrink-0">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming tasks */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-base font-semibold text-foreground">Upcoming Tasks</h2>
            <Link href="/tasks" className="text-sm text-primary hover:text-primary-hover font-medium transition-colors">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {tasks.map((task) => (
              <div key={task.id} className="px-5 py-3.5 hover:bg-surface-elevated/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${task.assigneeColor} flex items-center justify-center shrink-0 mt-0.5`}>
                    <span className="text-[10px] font-bold text-white">{task.assignee}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-muted">{task.due}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
