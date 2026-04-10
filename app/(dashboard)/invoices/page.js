'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useInvoices } from '@/app/lib/hooks';

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

/* ─── useClients (inline fallback) ─── */
function useClientsLocal() {
  const defaultClients = [
    { id: 'c1', name: 'TechFlow Inc' },
    { id: 'c2', name: 'BrightPath Labs' },
    { id: 'c3', name: 'Quantum Dynamics' },
    { id: 'c4', name: 'Apex Ventures' },
    { id: 'c5', name: 'Nova Creative' },
    { id: 'c6', name: 'Stellar Systems' },
    { id: 'c7', name: 'Luminary Design' },
    { id: 'c8', name: 'Horizon Tech' },
  ];
  const [clients, setClients] = useLocalStorage('gravitiq_clients', defaultClients);
  return { clients, loaded: true };
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

/* ─── Icons ─── */
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
  const s = status.toLowerCase();
  const styles = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    sent: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    overdue: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    draft: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[s] || styles.draft}`}>
      {label}
    </span>
  );
}

/* ─── Create / Edit Invoice Modal ─── */
function InvoiceModal({ invoice, clients, onSave, onClose }) {
  const [clientId, setClientId] = useState(invoice?.clientId || (clients[0]?.id || ''));
  const [status, setStatus] = useState(invoice?.status || 'draft');
  const [issuedDate, setIssuedDate] = useState(invoice?.issuedDate || new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(invoice?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]);
  const [items, setItems] = useState(
    invoice?.items?.length ? invoice.items : [{ description: '', quantity: 1, rate: 0, amount: 0 }]
  );

  const clientName = clients.find(c => c.id === clientId)?.name || '';
  const total = items.reduce((sum, it) => sum + (it.quantity * it.rate), 0);

  const updateItem = (idx, field, val) => {
    setItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      if (field === 'quantity' || field === 'rate') {
        next[idx].amount = next[idx].quantity * next[idx].rate;
      }
      return next;
    });
  };

  const addRow = () => setItems(prev => [...prev, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  const removeRow = (idx) => setItems(prev => prev.filter((_, i) => i !== idx));

  const handleSave = () => {
    const invNumber = invoice?.invoiceNumber || `INV-${String(Date.now()).slice(-6)}`;
    onSave({
      ...(invoice || {}),
      invoiceNumber: invNumber,
      clientId,
      clientName,
      amount: total,
      status,
      issuedDate,
      dueDate,
      items: items.map(it => ({ ...it, amount: it.quantity * it.rate })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 my-8">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          {invoice ? 'Edit Invoice' : 'Create Invoice'}
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Client</label>
            <select value={clientId} onChange={e => setClientId(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Issue Date</label>
            <input type="date" value={issuedDate} onChange={e => setIssuedDate(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Due Date</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
        </div>

        {/* Line items */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Line Items</label>
            <button onClick={addRow} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">+ Add Row</button>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              <div className="col-span-5">Description</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
              <div className="col-span-1"></div>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2">
                <input type="text" value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Description" className="col-span-5 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                <input type="number" min="1" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value) || 0)} className="col-span-2 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                <input type="number" min="0" step="0.01" value={item.rate} onChange={e => updateItem(idx, 'rate', Number(e.target.value) || 0)} className="col-span-2 rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
                <div className="col-span-2 flex items-center text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  ${(item.quantity * item.rate).toFixed(2)}
                </div>
                <div className="col-span-1 flex items-center">
                  {items.length > 1 && (
                    <button onClick={() => removeRow(idx)} className="text-red-500 hover:text-red-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Total: ${total.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
          <button onClick={handleSave} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── View Invoice Modal ─── */
function ViewModal({ invoice, onClose }) {
  if (!invoice) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900 my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{invoice.invoiceNumber}</h3>
          <StatusBadge status={invoice.status} />
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Client</span><span className="text-zinc-900 dark:text-zinc-100 font-medium">{invoice.clientName}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Issued</span><span className="text-zinc-900 dark:text-zinc-100">{invoice.issuedDate}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Due</span><span className="text-zinc-900 dark:text-zinc-100">{invoice.dueDate}</span></div>
          <div className="flex justify-between"><span className="text-zinc-500 dark:text-zinc-400">Amount</span><span className="text-zinc-900 dark:text-zinc-100 font-bold">${invoice.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></div>
        </div>
        {invoice.items?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Line Items</p>
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-800/50">
                    <th className="px-3 py-2 text-left text-xs font-medium text-zinc-500">Description</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">Qty</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">Rate</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-zinc-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((it, i) => (
                    <tr key={i} className="border-t border-zinc-100 dark:border-zinc-800">
                      <td className="px-3 py-2 text-zinc-900 dark:text-zinc-100">{it.description}</td>
                      <td className="px-3 py-2 text-right text-zinc-500">{it.quantity}</td>
                      <td className="px-3 py-2 text-right text-zinc-500">${it.rate.toFixed(2)}</td>
                      <td className="px-3 py-2 text-right font-medium text-zinc-900 dark:text-zinc-100">${it.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Close</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function InvoicesPage() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, loaded } = useInvoices();
  const { clients } = useClientsLocal();
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  const filtered = useMemo(() => {
    if (!invoices) return [];
    return invoices.filter(inv => {
      if (statusFilter !== 'All' && inv.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (dateFrom && inv.issuedDate < dateFrom) return false;
      if (dateTo && inv.issuedDate > dateTo) return false;
      return true;
    });
  }, [invoices, statusFilter, dateFrom, dateTo]);

  const summaryCards = useMemo(() => {
    if (!invoices) return [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const outstanding = invoices
      .filter(i => i.status === 'sent' || i.status === 'overdue')
      .reduce((s, i) => s + i.amount, 0);
    const overdue = invoices
      .filter(i => i.status === 'overdue')
      .reduce((s, i) => s + i.amount, 0);
    const paidThisMonth = invoices
      .filter(i => {
        if (i.status !== 'paid') return false;
        const d = new Date(i.issuedDate);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      })
      .reduce((s, i) => s + i.amount, 0);
    const draftCount = invoices.filter(i => i.status === 'draft').length;

    return [
      { label: 'Total Outstanding', value: `$${outstanding.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: 'dollar', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/40' },
      { label: 'Overdue', value: `$${overdue.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: 'alert', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/40' },
      { label: 'Paid This Month', value: `$${paidThisMonth.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, icon: 'check', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40' },
      { label: 'Draft', value: String(draftCount), icon: 'file', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/40' },
    ];
  }, [invoices]);

  const handleCreate = (data) => {
    addInvoice(data);
    setShowCreateModal(false);
    showToast('Invoice created');
  };

  const handleEdit = (data) => {
    updateInvoice(data.id, data);
    setEditInvoice(null);
    showToast('Invoice updated');
  };

  const handleDelete = () => {
    deleteInvoice(confirmDeleteId);
    setConfirmDeleteId(null);
    showToast('Invoice deleted');
  };

  const handleDownload = (inv) => {
    const itemLines = (inv.items || []).map(it => `  ${it.description}: ${it.quantity} x $${it.rate.toFixed(2)} = $${it.amount.toFixed(2)}`).join('\n');
    const text = `GRAVITIQ INVOICE\n================\nInvoice: ${inv.invoiceNumber}\nClient: ${inv.clientName}\nIssued: ${inv.issuedDate}\nDue: ${inv.dueDate}\nStatus: ${inv.status}\n\nItems:\n${itemLines || '  (no items)'}\n\nTotal: $${inv.amount.toFixed(2)}\n`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${inv.invoiceNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!loaded) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-xl bg-zinc-200 dark:bg-zinc-700" />)}
          </div>
          <div className="h-64 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Modals */}
      {showCreateModal && (
        <InvoiceModal clients={clients} onSave={handleCreate} onClose={() => setShowCreateModal(false)} />
      )}
      {editInvoice && (
        <InvoiceModal invoice={editInvoice} clients={clients} onSave={handleEdit} onClose={() => setEditInvoice(null)} />
      )}
      {viewInvoice && (
        <ViewModal invoice={viewInvoice} onClose={() => setViewInvoice(null)} />
      )}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Delete Invoice</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Are you sure you want to delete this invoice? This action cannot be undone.</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={() => setConfirmDeleteId(null)} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
              <button onClick={handleDelete} className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors dark:bg-red-500 dark:hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Invoices</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Create, manage, and track all your invoices.</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
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
                <tr key={inv.id} className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 cursor-pointer ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`} onClick={() => setViewInvoice(inv)}>
                  <td className="px-6 py-3 font-medium text-indigo-600 dark:text-indigo-400">{inv.invoiceNumber}</td>
                  <td className="px-6 py-3 text-zinc-900 dark:text-zinc-100">{inv.clientName}</td>
                  <td className="px-6 py-3 font-medium text-zinc-900 dark:text-zinc-100">${inv.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.issuedDate}</td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{inv.dueDate}</td>
                  <td className="px-6 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-6 py-3" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setViewInvoice(inv)} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button onClick={() => setEditInvoice(inv)} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDownload(inv)} className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200" title="Download">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button onClick={() => setConfirmDeleteId(inv.id)} className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" title="Delete">
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
