'use client';

import { useState } from 'react';
import Link from 'next/link';

const stats = [
  {
    label: 'Total Generations',
    value: '1,247',
    change: '+12%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    label: 'Tokens Used',
    value: '2.4M',
    change: '+8%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
  },
  {
    label: 'Time Saved',
    value: '86 hrs',
    change: '+23%',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
  },
  {
    label: 'Avg Rating',
    value: '4.7/5',
    change: '+0.2',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
];

const historyData = [
  { id: 1, date: 'Apr 10, 2026', prompt: 'Generate a summary of Q1 performance including revenue, client metrics, and team highlights', model: 'Gravitiq AI', tokens: 1842, rating: 5, type: 'Report' },
  { id: 2, date: 'Apr 9, 2026', prompt: 'Draft a follow-up email to Acme Corp after our product demo meeting yesterday', model: 'GPT-4o', tokens: 924, rating: 4, type: 'Email' },
  { id: 3, date: 'Apr 9, 2026', prompt: 'Create a competitive analysis comparing our platform against HubSpot and Salesforce', model: 'Claude 3.5', tokens: 3201, rating: 5, type: 'Analysis' },
  { id: 4, date: 'Apr 8, 2026', prompt: 'Write a LinkedIn post announcing our new AI-powered analytics feature launch', model: 'Gravitiq AI', tokens: 687, rating: 4, type: 'Social' },
  { id: 5, date: 'Apr 8, 2026', prompt: 'Summarize the notes from today\'s all-hands meeting including key decisions and action items', model: 'Gravitiq AI', tokens: 1456, rating: 5, type: 'Summary' },
  { id: 6, date: 'Apr 7, 2026', prompt: 'Generate an invoice reminder email for client Bright Solutions with payment 15 days overdue', model: 'GPT-4o', tokens: 543, rating: 4, type: 'Email' },
  { id: 7, date: 'Apr 7, 2026', prompt: 'Create a project brief for the mobile app redesign initiative starting next quarter', model: 'Claude 3.5', tokens: 2108, rating: 5, type: 'Document' },
  { id: 8, date: 'Apr 6, 2026', prompt: 'Analyze customer churn data from last quarter and suggest retention strategies', model: 'Gravitiq AI', tokens: 2876, rating: 4, type: 'Analysis' },
  { id: 9, date: 'Apr 5, 2026', prompt: 'Draft a client proposal for TechStart Inc for our enterprise analytics package', model: 'Gravitiq AI', tokens: 3442, rating: 5, type: 'Proposal' },
  { id: 10, date: 'Apr 4, 2026', prompt: 'Write a weekly team update email highlighting sprint progress and upcoming milestones', model: 'GPT-4o', tokens: 798, rating: 3, type: 'Email' },
];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-border'}`}
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ))}
    </div>
  );
}

export default function AIHistoryPage() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [modelFilter, setModelFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  const filtered = historyData.filter((row) => {
    const matchesModel = modelFilter === 'All' || row.model === modelFilter;
    const matchesType = typeFilter === 'All' || row.type === typeFilter;
    return matchesModel && matchesType;
  });

  const models = ['All', ...new Set(historyData.map((r) => r.model))];
  const types = ['All', ...new Set(historyData.map((r) => r.type))];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted mb-2">
              <Link href="/ai" className="hover:text-foreground transition-colors">
                AI Assistant
              </Link>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
              <span className="text-foreground">History</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">AI Usage History</h1>
            <p className="text-muted mt-1">Track your AI generations, usage, and performance</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-elevated border border-border text-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">{stat.icon}</div>
                <span className="text-xs font-medium text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-surface border border-border rounded-xl">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">Date Range:</label>
            <input
              type="date"
              defaultValue="2026-04-01"
              className="text-sm bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span className="text-muted">to</span>
            <input
              type="date"
              defaultValue="2026-04-10"
              className="text-sm bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">Model:</label>
            <select
              value={modelFilter}
              onChange={(e) => setModelFilter(e.target.value)}
              className="text-sm bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {models.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted">Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-sm bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              {types.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Date</th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Prompt</th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Model</th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Tokens</th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Rating</th>
                  <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((row) => (
                  <tr key={row.id} className="group">
                    <td className="px-5 py-4">
                      <span className="text-sm text-foreground whitespace-nowrap">{row.date}</span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <button
                        onClick={() => setExpandedRow(expandedRow === row.id ? null : row.id)}
                        className="text-left cursor-pointer"
                      >
                        <p className={`text-sm text-foreground ${expandedRow === row.id ? '' : 'truncate max-w-[320px]'}`}>
                          {row.prompt}
                        </p>
                        <span className="text-xs text-primary hover:text-primary-hover mt-0.5 inline-block">
                          {expandedRow === row.id ? 'Show less' : 'Show more'}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                        row.model === 'Gravitiq AI'
                          ? 'bg-primary/10 text-primary'
                          : row.model === 'GPT-4o'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                      }`}>
                        {row.model}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-muted font-mono">{row.tokens.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StarRating rating={row.rating} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-foreground transition-colors cursor-pointer" title="View">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          </svg>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-foreground transition-colors cursor-pointer" title="Reuse">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                          </svg>
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-surface-elevated text-muted hover:text-red-500 transition-colors cursor-pointer" title="Delete">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">No history entries match your filters</p>
            </div>
          )}
        </div>

        {/* Pagination hint */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted">
          <p>Showing {filtered.length} of {historyData.length} entries</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground transition-colors cursor-pointer">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium cursor-pointer">1</button>
            <button className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border text-muted hover:text-foreground transition-colors cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
