'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useClients, useProjects, useActivities, useTasks, useRevenue } from '@/app/lib/hooks';

/* ───── greeting helper ───── */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

/* ───── loading skeleton ───── */
function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
      <div className="rounded-2xl bg-indigo-600/30 h-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-5 h-32">
            <div className="w-11 h-11 rounded-xl bg-muted/20 mb-4" />
            <div className="h-6 w-24 bg-muted/20 rounded" />
            <div className="h-4 w-16 bg-muted/20 rounded mt-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-surface border border-border rounded-2xl p-5 h-72" />
        <div className="bg-surface border border-border rounded-2xl p-5 h-72" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-surface border border-border rounded-2xl h-64" />
        <div className="bg-surface border border-border rounded-2xl h-64" />
      </div>
    </div>
  );
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

/* ───── priority styles ───── */
const priorityStyles = {
  high: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
  low: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400',
};

/* ───── activity type styling ───── */
function getActivityTypeStyle(description) {
  const d = (description || '').toLowerCase();
  if (d.includes('client')) return { type: 'Client', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' };
  if (d.includes('invoice') || d.includes('paid')) return { type: 'Invoice', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' };
  if (d.includes('ai') || d.includes('report')) return { type: 'AI', color: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-400' };
  if (d.includes('project') || d.includes('milestone')) return { type: 'Project', color: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' };
  if (d.includes('task')) return { type: 'Task', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400' };
  return { type: 'Activity', color: 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-400' };
}

/* ───── relative time helper ───── */
function timeAgo(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

/* ───── format currency ───── */
function formatCurrency(val) {
  if (val >= 1000) return `$${(val / 1000).toFixed(val >= 10000 ? 0 : 1)}k`;
  return `$${val.toLocaleString()}`;
}

/* ───── Modal overlay ───── */
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface border border-border rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ───── page ───── */
export default function DashboardPage() {
  const [greeting, setGreeting] = useState('Good morning');
  const { clients, addClient, loaded: clientsLoaded } = useClients();
  const { projects, addProject, loaded: projectsLoaded } = useProjects();
  const { activities, addActivity, loaded: activitiesLoaded } = useActivities();
  const { tasks, toggleTask, loaded: tasksLoaded } = useTasks();
  const { revenue, loaded: revenueLoaded } = useRevenue();

  const [showNewProject, setShowNewProject] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  // New Client form state
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');

  // New Project form state
  const [projTitle, setProjTitle] = useState('');
  const [projClient, setProjClient] = useState('');
  const [projPriority, setProjPriority] = useState('medium');
  const [projDueDate, setProjDueDate] = useState('');

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

  const allLoaded = clientsLoaded && projectsLoaded && activitiesLoaded && tasksLoaded && revenueLoaded;

  /* ── computed stats ── */
  const totalRevenue = useMemo(() => {
    if (!clients) return 0;
    return clients.reduce((sum, c) => sum + (Number(c.revenue) || 0), 0);
  }, [clients]);

  const activeClients = useMemo(() => {
    if (!clients) return 0;
    return clients.filter((c) => c.status === 'active').length;
  }, [clients]);

  const totalProjects = projects ? projects.length : 0;
  const inProgressProjects = useMemo(() => {
    if (!projects) return 0;
    return projects.filter((p) => p.status === 'in_progress').length;
  }, [projects]);

  /* ── revenue chart data ── */
  const revenueChartData = useMemo(() => {
    if (!revenue || revenue.length === 0) return [];
    return revenue;
  }, [revenue]);

  const maxRevenue = useMemo(() => {
    if (!revenueChartData.length) return 1;
    return Math.max(...revenueChartData.map((d) => d.revenue || 0));
  }, [revenueChartData]);

  /* ── client activity chart data (using revenue data months) ── */
  const clientActivityData = useMemo(() => {
    if (!revenueChartData.length) return [];
    // derive activity from revenue data: scale revenue to a 0-100 range
    const maxVal = Math.max(...revenueChartData.map((d) => d.revenue || 0), 1);
    return revenueChartData.map((d) => ({
      month: d.month,
      value: Math.round(((d.revenue || 0) / maxVal) * 100),
    }));
  }, [revenueChartData]);

  /* ── recent activities ── */
  const recentActivities = useMemo(() => {
    if (!activities) return [];
    return [...activities]
      .sort((a, b) => new Date(b.timestamp || b.date || 0) - new Date(a.timestamp || a.date || 0))
      .slice(0, 5);
  }, [activities]);

  /* ── upcoming tasks ── */
  const upcomingTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks
      .filter((t) => !t.completed)
      .sort((a, b) => new Date(a.dueDate || a.due || 0) - new Date(b.dueDate || b.due || 0))
      .slice(0, 5);
  }, [tasks]);

  /* ── handlers ── */
  function handleAddClient(e) {
    e.preventDefault();
    if (!clientName.trim()) return;
    addClient({
      name: clientName,
      company: clientCompany,
      email: clientEmail,
      status: 'active',
      revenue: 0,
    });
    addActivity({
      description: `New client ${clientName} added`,
      timestamp: new Date().toISOString(),
    });
    setClientName('');
    setClientCompany('');
    setClientEmail('');
    setShowAddClient(false);
  }

  function handleAddProject(e) {
    e.preventDefault();
    if (!projTitle.trim()) return;
    addProject({
      title: projTitle,
      clientId: projClient,
      priority: projPriority,
      dueDate: projDueDate,
      status: 'in_progress',
    });
    addActivity({
      description: `New project "${projTitle}" created`,
      timestamp: new Date().toISOString(),
    });
    setProjTitle('');
    setProjClient('');
    setProjPriority('medium');
    setProjDueDate('');
    setShowNewProject(false);
  }

  function handleGenerateReport() {
    alert('Report generated!');
  }

  /* ── assignee colors rotation ── */
  const assigneeColors = [
    'from-indigo-400 to-violet-500',
    'from-emerald-400 to-teal-500',
    'from-amber-400 to-orange-500',
    'from-pink-400 to-rose-500',
    'from-blue-400 to-cyan-500',
  ];

  if (!allLoaded) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Add Client Modal ── */}
      <Modal open={showAddClient} onClose={() => setShowAddClient(false)} title="Add Client">
        <form onSubmit={handleAddClient} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="John Smith"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Company</label>
            <input
              type="text"
              value={clientCompany}
              onChange={(e) => setClientCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="john@acme.com"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddClient(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Add Client
            </button>
          </div>
        </form>
      </Modal>

      {/* ── New Project Modal ── */}
      <Modal open={showNewProject} onClose={() => setShowNewProject(false)} title="New Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
            <input
              type="text"
              value={projTitle}
              onChange={(e) => setProjTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Project Alpha"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client</label>
            <select
              value={projClient}
              onChange={(e) => setProjClient(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">Select a client...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.company ? `(${c.company})` : ''}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select
              value={projPriority}
              onChange={(e) => setProjPriority(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
            <input
              type="date"
              value={projDueDate}
              onChange={(e) => setProjDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-surface-elevated text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowNewProject(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-muted hover:text-foreground transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
              Create Project
            </button>
          </div>
        </form>
      </Modal>

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
            <button
              onClick={() => setShowNewProject(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-700 text-sm font-semibold hover:bg-indigo-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
            <button
              onClick={() => setShowAddClient(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <line x1="20" y1="8" x2="20" y2="14" />
                <line x1="23" y1="11" x2="17" y2="11" />
              </svg>
              Add Client
            </button>
            <button
              onClick={handleGenerateReport}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 text-white text-sm font-semibold hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20"
            >
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
          value={`$${totalRevenue.toLocaleString()}`}
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
          value={activeClients.toString()}
          change={`${clients.length} total`}
          changeLabel="in database"
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
          value={totalProjects.toString()}
          change={`${inProgressProjects} active`}
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
              <p className="text-sm text-muted mt-0.5">Monthly revenue for the past {revenueChartData.length} months</p>
            </div>
            <select className="text-xs border border-border rounded-lg px-2.5 py-1.5 bg-surface-elevated text-muted focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Last {revenueChartData.length} months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="flex items-end justify-between gap-2 h-48 px-1">
            {revenueChartData.map((d, i) => {
              const heightPct = maxRevenue > 0 ? (d.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={d.month} className="flex flex-col items-center gap-2 flex-1 group relative">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[10px] rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    ${(d.revenue || 0).toLocaleString()}
                  </div>
                  <div className="w-full flex justify-center">
                    <div
                      className={`w-full max-w-[32px] rounded-t-lg transition-all duration-500 ${
                        i === revenueChartData.length - 2
                          ? 'bg-gradient-to-t from-indigo-600 to-indigo-400'
                          : 'bg-indigo-200 dark:bg-indigo-500/30 hover:bg-indigo-300 dark:hover:bg-indigo-500/50'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-muted font-medium">{d.month}</span>
                </div>
              );
            })}
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
              <option>Last {clientActivityData.length} months</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          {clientActivityData.length > 0 ? (
            <>
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
                    d={`M0,${180 - clientActivityData[0].value * 1.8} ${clientActivityData.map((d, i) => `L${i * (400 / Math.max(clientActivityData.length - 1, 1))},${180 - d.value * 1.8}`).join(' ')} L400,180 L0,180 Z`}
                    fill="url(#lineGrad)"
                  />
                  {/* Line */}
                  <polyline
                    fill="none"
                    stroke="rgb(99 102 241)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={clientActivityData.map((d, i) => `${i * (400 / Math.max(clientActivityData.length - 1, 1))},${180 - d.value * 1.8}`).join(' ')}
                  />
                  {/* Dots */}
                  {clientActivityData.map((d, i) => (
                    <circle
                      key={d.month}
                      cx={i * (400 / Math.max(clientActivityData.length - 1, 1))}
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
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-muted text-sm">No data available</div>
          )}
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
            {recentActivities.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">No recent activity</div>
            ) : (
              recentActivities.map((activity, idx) => {
                const { type, color } = getActivityTypeStyle(activity.description || activity.text || '');
                return (
                  <div key={activity.id || idx} className="flex items-center gap-4 px-5 py-3.5 hover:bg-surface-elevated/50 transition-colors">
                    {/* Icon dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-primary/60 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{activity.description || activity.text}</p>
                      <p className="text-xs text-muted mt-0.5">{timeAgo(activity.timestamp || activity.date)}</p>
                    </div>
                    <span className={`hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${color}`}>
                      {type}
                    </span>
                    <button className="text-sm text-primary hover:text-primary-hover font-medium transition-colors shrink-0">
                      View
                    </button>
                  </div>
                );
              })
            )}
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
            {upcomingTasks.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-muted">No upcoming tasks</div>
            ) : (
              upcomingTasks.map((task, idx) => {
                const colorIdx = idx % assigneeColors.length;
                const initials = (task.title || '')
                  .split(' ')
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join('')
                  .toUpperCase();
                const dueLabel = task.dueDate || task.due || '';
                const priority = task.priority || 'medium';

                return (
                  <div key={task.id || idx} className="px-5 py-3.5 hover:bg-surface-elevated/50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-5 h-5 rounded border-2 border-border hover:border-primary flex items-center justify-center shrink-0 transition-colors"
                        title="Mark as complete"
                      >
                        {task.completed && (
                          <svg className="w-3 h-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${assigneeColors[colorIdx]} flex items-center justify-center shrink-0 mt-0.5`}>
                        <span className="text-[10px] font-bold text-white">{initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-snug">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs text-muted">{dueLabel}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[priority] || priorityStyles.medium}`}>
                            {priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
