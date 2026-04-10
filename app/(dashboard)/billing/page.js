'use client';

import { useState } from 'react';

const usageMeters = [
  { label: 'API Calls', used: 8234, total: 10000, unit: '' },
  { label: 'Storage', used: 4.2, total: 10, unit: 'GB' },
  { label: 'Team Members', used: 6, total: 10, unit: '' },
  { label: 'AI Generations', used: 847, total: 1000, unit: '' },
];

const invoices = [
  { id: 'INV-2026-008', date: 'Mar 1, 2026', desc: 'Pro Plan - March 2026', amount: '$79.00', status: 'Paid' },
  { id: 'INV-2026-007', date: 'Feb 1, 2026', desc: 'Pro Plan - February 2026', amount: '$79.00', status: 'Paid' },
  { id: 'INV-2026-006', date: 'Jan 1, 2026', desc: 'Pro Plan - January 2026', amount: '$79.00', status: 'Paid' },
  { id: 'INV-2025-005', date: 'Dec 1, 2025', desc: 'Pro Plan - December 2025', amount: '$79.00', status: 'Paid' },
  { id: 'INV-2025-004', date: 'Nov 1, 2025', desc: 'Pro Plan - November 2025', amount: '$79.00', status: 'Paid' },
  { id: 'INV-2025-003', date: 'Oct 1, 2025', desc: 'Pro Plan - October 2025', amount: '$79.00', status: 'Pending' },
  { id: 'INV-2025-002', date: 'Sep 1, 2025', desc: 'API Overage - September 2025', amount: '$12.50', status: 'Failed' },
  { id: 'INV-2025-001', date: 'Aug 1, 2025', desc: 'Pro Plan - August 2025', amount: '$79.00', status: 'Paid' },
];

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    features: ['5,000 API Calls', '2 GB Storage', '3 Team Members', '100 AI Generations', 'Email Support', 'Basic Analytics'],
    current: false,
  },
  {
    name: 'Pro',
    price: '$79',
    period: '/month',
    features: ['10,000 API Calls', '10 GB Storage', '10 Team Members', '1,000 AI Generations', 'Priority Support', 'Advanced Analytics', 'Custom Integrations', 'API Access'],
    current: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Unlimited API Calls', 'Unlimited Storage', 'Unlimited Team Members', 'Unlimited AI Generations', 'Dedicated Support', 'Custom Analytics', 'SSO & SAML', 'SLA Guarantee', 'Custom Contracts'],
    current: false,
  },
];

function getBarColor(pct) {
  if (pct >= 90) return 'bg-red-500';
  if (pct >= 70) return 'bg-amber-500';
  return 'bg-indigo-500';
}

function StatusBadge({ status }) {
  const styles = {
    Paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    Failed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function BillingPage() {
  const [billingEmail, setBillingEmail] = useState('billing@gravitiq.io');

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Billing</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your subscription, payment methods, and billing history.</p>
      </div>

      {/* Current Plan */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Pro Plan</h2>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">Current Plan</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">$79<span className="text-base font-normal text-zinc-500 dark:text-zinc-400">/month</span></p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Next billing date: April 15, 2026</p>
          </div>
          <div className="flex gap-3">
            <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Change Plan
            </button>
            <button className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
              Cancel
            </button>
          </div>
        </div>

        {/* Usage meters */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {usageMeters.map(m => {
            const pct = Math.round((m.used / m.total) * 100);
            const display = m.unit
              ? `${m.used} ${m.unit} / ${m.total} ${m.unit}`
              : `${m.used.toLocaleString()} / ${m.total.toLocaleString()}`;
            return (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{m.label}</span>
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">{display}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-700">
                  <div className={`h-2 rounded-full transition-all ${getBarColor(pct)}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{pct}% used</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Payment Method</h2>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-16 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-10" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#1A1F71" />
                <text x="8" y="21" fill="white" fontSize="12" fontWeight="bold" fontFamily="sans-serif">VISA</text>
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Visa ending in 4242</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Expires 12/27</p>
            </div>
          </div>
          <button className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Update Payment Method
          </button>
        </div>
        <div className="mt-6 max-w-md">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Billing Email</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={billingEmail}
              onChange={e => setBillingEmail(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Billing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Invoice</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Date</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Description</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Amount</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400"></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-zinc-100 dark:border-zinc-800 ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`}>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{inv.id}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.date}</td>
                  <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">{inv.desc}</td>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{inv.amount}</td>
                  <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-3">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Compare Plans</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`relative rounded-xl border p-6 ${
                plan.current
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-zinc-900'
                  : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
              }`}
            >
              {plan.current && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white dark:bg-indigo-500">
                  Current Plan
                </span>
              )}
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{plan.price}</span>
                {plan.period && <span className="text-sm text-zinc-500 dark:text-zinc-400">{plan.period}</span>}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  plan.current
                    ? 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    : plan.name === 'Enterprise'
                      ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                }`}
              >
                {plan.current ? 'Current Plan' : plan.name === 'Enterprise' ? 'Contact Sales' : 'Upgrade'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
