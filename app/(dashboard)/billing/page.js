'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTeam } from '@/app/lib/hooks';

/* ─── useLocalStorage ─── */
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {}
    setLoaded(true);
  }, [key]);

  const update = useCallback((newVal) => {
    setValue(prev => {
      const resolved = typeof newVal === 'function' ? newVal(prev) : newVal;
      try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
      return resolved;
    });
  }, [key]);

  return [value, update, loaded];
}

/* ─── Toast ─── */
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="fixed top-4 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {message}
      </div>
    </div>
  );
}

const planDefinitions = [
  {
    name: 'Starter',
    price: '$29',
    priceNum: 29,
    period: '/month',
    apiCalls: 5000,
    storage: 2,
    teamMembers: 3,
    aiGenerations: 100,
    features: ['5,000 API Calls', '2 GB Storage', '3 Team Members', '100 AI Generations', 'Email Support', 'Basic Analytics'],
  },
  {
    name: 'Pro',
    price: '$79',
    priceNum: 79,
    period: '/month',
    apiCalls: 10000,
    storage: 10,
    teamMembers: 10,
    aiGenerations: 1000,
    features: ['10,000 API Calls', '10 GB Storage', '10 Team Members', '1,000 AI Generations', 'Priority Support', 'Advanced Analytics', 'Custom Integrations', 'API Access'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    priceNum: 0,
    period: '',
    apiCalls: 999999,
    storage: 999999,
    teamMembers: 999999,
    aiGenerations: 999999,
    features: ['Unlimited API Calls', 'Unlimited Storage', 'Unlimited Team Members', 'Unlimited AI Generations', 'Dedicated Support', 'Custom Analytics', 'SSO & SAML', 'SLA Guarantee', 'Custom Contracts'],
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

function generateBillingHistory(planName, planPrice) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const history = [];
  for (let i = 0; i < 8; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    const num = String(8 - i).padStart(3, '0');
    history.push({
      id: `INV-${year}-${num}`,
      date: `${month} 1, ${year}`,
      desc: `${planName} Plan - ${month} ${year}`,
      amount: `$${planPrice}.00`,
      status: i === 0 ? 'Pending' : 'Paid',
    });
  }
  return history;
}

export default function BillingPage() {
  const { team, loaded: teamLoaded } = useTeam();
  const [currentPlan, setCurrentPlan] = useLocalStorage('gravitiq_billing_plan', 'Pro');
  const [paymentCard, setPaymentCard] = useLocalStorage('gravitiq_payment_card', { last4: '4242', expiry: '12/27' });
  const [billingEmail, setBillingEmail] = useLocalStorage('gravitiq_billing_email', 'billing@gravitiq.io');
  const [usageData, setUsageData] = useLocalStorage('gravitiq_usage', { apiCalls: 8234, storage: 4.2, aiGenerations: 847 });
  const [toast, setToast] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [cardInput, setCardInput] = useState({ last4: '', expiry: '' });

  useEffect(() => {
    setEmailInput(billingEmail);
  }, [billingEmail]);

  const showToast = useCallback((msg) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const plan = planDefinitions.find(p => p.name === currentPlan) || planDefinitions[1];
  const teamCount = teamLoaded ? team.length : 6;

  const usageMeters = useMemo(() => [
    { label: 'API Calls', used: usageData.apiCalls, total: plan.apiCalls, unit: '' },
    { label: 'Storage', used: usageData.storage, total: plan.storage, unit: 'GB' },
    { label: 'Team Members', used: teamCount, total: plan.teamMembers, unit: '' },
    { label: 'AI Generations', used: usageData.aiGenerations, total: plan.aiGenerations, unit: '' },
  ], [usageData, plan, teamCount]);

  const billingHistory = useMemo(() => generateBillingHistory(currentPlan, plan.priceNum), [currentPlan, plan.priceNum]);

  const handleChangePlan = (name) => {
    if (name === 'Enterprise') {
      showToast('Contact sales for Enterprise pricing');
      return;
    }
    setCurrentPlan(name);
    setShowPlanModal(false);
    showToast(`Switched to ${name} plan`);
  };

  const handleSaveEmail = () => {
    setBillingEmail(emailInput);
    showToast('Billing email updated');
  };

  const handleSaveCard = () => {
    if (!cardInput.last4 || cardInput.last4.length !== 4 || !cardInput.expiry) {
      showToast('Please enter valid card details');
      return;
    }
    setPaymentCard(cardInput);
    setShowPaymentModal(false);
    showToast('Payment method updated');
  };

  const handleDownload = (inv) => {
    const text = `GRAVITIQ INVOICE\n================\nInvoice: ${inv.id}\nDate: ${inv.date}\nDescription: ${inv.desc}\nAmount: ${inv.amount}\nStatus: ${inv.status}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!teamLoaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-48 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-48 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Update Payment Method</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Last 4 Digits</label>
                <input type="text" maxLength={4} placeholder="4242" value={cardInput.last4} onChange={e => setCardInput(p => ({ ...p, last4: e.target.value.replace(/\D/g, '') }))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Expiry (MM/YY)</label>
                <input type="text" maxLength={5} placeholder="12/27" value={cardInput.expiry} onChange={e => setCardInput(p => ({ ...p, expiry: e.target.value }))} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowPaymentModal(false)} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
                <button onClick={handleSaveCard} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{currentPlan} Plan</h2>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">Current Plan</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">{plan.price}{plan.period && <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">{plan.period}</span>}</p>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Next billing date: April 15, 2026</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowPlanModal(true)} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
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
            const pct = Math.min(100, Math.round((m.used / m.total) * 100));
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
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Visa ending in {paymentCard.last4}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Expires {paymentCard.expiry}</p>
            </div>
          </div>
          <button onClick={() => { setCardInput({ last4: '', expiry: '' }); setShowPaymentModal(true); }} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">
            Update Payment Method
          </button>
        </div>
        <div className="mt-6 max-w-md">
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Billing Email</label>
          <div className="flex gap-3">
            <input
              type="email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <button onClick={handleSaveEmail} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
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
              {billingHistory.map((inv, idx) => (
                <tr key={inv.id} className={`border-b border-zinc-100 dark:border-zinc-800 ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`}>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{inv.id}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.date}</td>
                  <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">{inv.desc}</td>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">{inv.amount}</td>
                  <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-3">
                    <button onClick={() => handleDownload(inv)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
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
          {planDefinitions.map(p => {
            const isCurrent = p.name === currentPlan;
            return (
              <div
                key={p.name}
                className={`relative rounded-xl border p-6 ${
                  isCurrent
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-white dark:bg-zinc-900'
                    : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
                }`}
              >
                {isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-medium text-white dark:bg-indigo-500">
                    Current Plan
                  </span>
                )}
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{p.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{p.price}</span>
                  {p.period && <span className="text-sm text-zinc-500 dark:text-zinc-400">{p.period}</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {p.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleChangePlan(p.name)}
                  className={`mt-6 w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
                      : p.name === 'Enterprise'
                        ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                  }`}
                >
                  {isCurrent ? 'Current Plan' : p.name === 'Enterprise' ? 'Contact Sales' : currentPlan === 'Enterprise' || (currentPlan === 'Pro' && p.name === 'Starter') ? 'Downgrade' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
