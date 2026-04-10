'use client';

import { useState, useMemo } from 'react';

const invoices = [
  { id: 'INV-001', client: 'TechFlow Inc', amount: 2500.00, date: 'Apr 8, 2026', dueDate: 'Apr 22, 2026', status: 'Sent' },
  { id: 'INV-002', client: 'BrightPath Labs', amount: 1850.00, date: 'Apr 5, 2026', dueDate: 'Apr 19, 2026', status: 'Paid' },
  { id: 'INV-003', client: 'Quantum Dynamics', amount: 4200.00, date: 'Apr 3, 2026', dueDate: 'Apr 17, 2026', status: 'Overdue' },
  { id: 'INV-004', client: 'Apex Ventures', amount: 850.00, date: 'Apr 1, 2026', dueDate: 'Apr 15, 2026', status: 'Overdue' },
  { id: 'INV-005', client: 'Nova Creative', amount: 3200.00, date: 'Mar 28, 2026', dueDate: 'Apr 11, 2026', status: 'Paid' },
  { id: 'INV-006', client: 'Stellar Systems', amount: 1730.00, date: 'Mar 25, 2026', dueDate: 'Apr 8, 2026', status: 'Paid' },
  { id: 'INV-007', client: 'Luminary Design', amount: 980.00, date: 'Mar 20, 2026', dueDate: 'Apr 3, 2026', status: 'Draft' },
  { id: 'INV-008', client: 'Horizon Tech', amount: 5620.00, date: 'Mar 18, 2026', dueDate: 'Apr 1, 2026', status: 'Paid' },
  { id: 'INV-009', client: 'TechFlow Inc', amount: 1200.00, date: 'Mar 15, 2026', dueDate: 'Mar 29, 2026', status: 'Draft' },
  { id: 'INV-010', client: 'BrightPath Labs', amount: 750.00, date: 'Mar 10, 2026', dueDate: 'Mar 24, 2026', status: 'Draft' },
];

const summaryCards = [
  { label: 'Total Outstanding', value: '$4,230', icon: 'dollar', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
  { label: 'Overdue', value: '$850', icon: 'alert', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
  { label: 'Paid This Month', value: '$12,400', icon: 'check', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { label: 'Draft', value: '3', icon: 'file', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
];

function SummaryIcon({ icon, className }) {
  const icons = {
    dollar: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    alert: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    file: (
      <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  };
  return icons[icon] || null;
}

function StatusBadge({ status }) {
  const styles = {
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    Overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    Draft: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = useMemo(() => {
    return invoices.filter(inv => {
      if (statusFilter !== 'All' && inv.status !== statusFilter) return false;
      return true;
    });
  }, [statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create, manage, and track all your invoices.</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Invoice
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map(card => (
          <div key={card.label} className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                <SummaryIcon icon={card.icon} className={`h-5 w-5 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{card.label}</p>
                <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status:</label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option>All</option>
            <option>Draft</option>
            <option>Sent</option>
            <option>Paid</option>
            <option>Overdue</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={e => setDateFrom(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={e => setDateTo(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {/* Invoice table */}
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Invoice #</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Client</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Amount</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Date</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Due Date</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No invoices found matching your filters.
                  </td>
                </tr>
              )}
              {filtered.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-zinc-100 dark:border-zinc-800 ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`}>
                  <td className="px-6 py-3 font-medium text-indigo-600 dark:text-indigo-400">{inv.id}</td>
                  <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">{inv.client}</td>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.date}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.dueDate}</td>
                  <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <button className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Delete">
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
    </div>
  );
}
