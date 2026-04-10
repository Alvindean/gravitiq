'use client';

import { useState } from 'react';
import Link from 'next/link';

const reportTypes = ['All', 'Revenue', 'Client', 'Performance', 'Custom'];

const reports = [
  { id: 'rpt-001', title: 'Q1 2026 Revenue Summary', type: 'Revenue', date: 'Mar 31, 2026', status: 'Ready', size: '2.4 MB' },
  { id: 'rpt-002', title: 'Client Acquisition Analysis', type: 'Client', date: 'Mar 28, 2026', status: 'Ready', size: '1.8 MB' },
  { id: 'rpt-003', title: 'Monthly Performance Review — March', type: 'Performance', date: 'Mar 25, 2026', status: 'Ready', size: '3.1 MB' },
  { id: 'rpt-004', title: 'Annual Forecast 2026', type: 'Revenue', date: 'Mar 20, 2026', status: 'Processing', size: '—' },
  { id: 'rpt-005', title: 'Client Retention Deep Dive', type: 'Client', date: 'Mar 18, 2026', status: 'Ready', size: '1.5 MB' },
  { id: 'rpt-006', title: 'Sales Pipeline Efficiency', type: 'Performance', date: 'Mar 15, 2026', status: 'Ready', size: '2.0 MB' },
  { id: 'rpt-007', title: 'Revenue by Region — Q1', type: 'Revenue', date: 'Mar 12, 2026', status: 'Scheduled', size: '—' },
  { id: 'rpt-008', title: 'Custom KPI Dashboard Export', type: 'Custom', date: 'Mar 10, 2026', status: 'Ready', size: '4.2 MB' },
  { id: 'rpt-009', title: 'Client Lifetime Value Report', type: 'Client', date: 'Mar 8, 2026', status: 'Ready', size: '1.1 MB' },
  { id: 'rpt-010', title: 'Team Performance Scorecard — Q1', type: 'Performance', date: 'Mar 5, 2026', status: 'Ready', size: '2.7 MB' },
];

const scheduledReports = [
  {
    title: 'Weekly Revenue Digest',
    frequency: 'Weekly',
    nextRun: 'Apr 14, 2026',
    recipients: ['alex@company.com', 'finance@company.com'],
  },
  {
    title: 'Monthly Client Health Report',
    frequency: 'Monthly',
    nextRun: 'May 1, 2026',
    recipients: ['team@company.com'],
  },
  {
    title: 'Quarterly Business Review',
    frequency: 'Quarterly',
    nextRun: 'Jul 1, 2026',
    recipients: ['exec@company.com', 'board@company.com', 'alex@company.com'],
  },
];

const statusStyles = {
  Ready: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20',
  Processing: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20',
  Scheduled: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-500/20',
};

const typeBadgeStyles = {
  Revenue: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Client: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Performance: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  Custom: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
};

const frequencyStyles = {
  Weekly: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  Monthly: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  Quarterly: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const filteredReports = activeTab === 'All' ? reports : reports.filter((r) => r.type === activeTab);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/analytics"
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
              >
                Analytics
              </Link>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-sm text-zinc-900 dark:text-zinc-100 font-medium">Reports</span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Reports</h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Generate, manage, and schedule automated reports.
            </p>
          </div>
          <button
            onClick={() => setShowGenerateModal(!showGenerateModal)}
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Generate Report
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-zinc-200 dark:border-zinc-700 mb-6">
          {reportTypes.map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === type
                  ? 'border-zinc-900 text-zinc-900 dark:border-zinc-100 dark:text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900 mb-8 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Report
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Type
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Date
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Size
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/analytics/reports/${report.id}`}
                        className="text-sm font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                      >
                        {report.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeStyles[report.type]}`}>
                        {report.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {report.date}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${statusStyles[report.status]}`}>
                        {report.status === 'Processing' && (
                          <svg className="mr-1.5 h-3 w-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        )}
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500 dark:text-zinc-400">
                      {report.size}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* Download */}
                        <button
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={report.status !== 'Ready'}
                          title="Download"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                        {/* Share */}
                        <button
                          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:hover:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                          title="Share"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        {/* Delete */}
                        <button
                          className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Reports */}
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Scheduled Reports</h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                  Automated reports delivered to your team.
                </p>
              </div>
              <button className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors">
                + Add Schedule
              </button>
            </div>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {scheduledReports.map((sr, i) => (
              <div key={i} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">{sr.title}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${frequencyStyles[sr.frequency]}`}>
                      {sr.frequency}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Next: {sr.nextRun}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {sr.recipients.length} recipient{sr.recipients.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
