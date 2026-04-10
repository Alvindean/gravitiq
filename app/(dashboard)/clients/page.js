'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useClients, useActivities } from '@/app/lib/hooks';

function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || styles.Active}`}>
      {status}
    </span>
  );
}

function Avatar({ name, color, size = 'md' }) {
  const initials = (name || '').split(' ').map(n => n[0]).join('');
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0`} style={{ backgroundColor: color || '#6366f1' }}>
      {initials}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-32 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 w-24 bg-surface-elevated rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-32 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 h-10 bg-surface-elevated rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-surface-elevated rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-surface-elevated" />
                <div className="flex-1">
                  <div className="h-4 w-28 bg-surface-elevated rounded mb-2" />
                  <div className="h-3 w-20 bg-surface-elevated rounded" />
                </div>
              </div>
              <div className="h-3 w-40 bg-surface-elevated rounded mb-3" />
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="h-4 w-16 bg-surface-elevated rounded" />
                <div className="h-4 w-16 bg-surface-elevated rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddClientModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', status: 'Active' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#f59e0b', '#ec4899', '#10b981', '#f97316', '#6366f1'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    onAdd({
      ...form,
      color,
      revenue: 0,
      lastActivity: new Date().toISOString().split('T')[0],
      notes: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Add New Client</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Company</label>
            <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Company name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="email@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Prospect">Prospect</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-surface-elevated transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">Add Client</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const { clients, addClient, loaded } = useClients();
  const { addActivity } = useActivities();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const perPage = 6;

  const filtered = useMemo(() => {
    let list = (clients || []).filter(c => {
      const q = search.toLowerCase();
      const matchSearch = (c.name || '').toLowerCase().includes(q) || (c.company || '').toLowerCase().includes(q) || (c.email || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
    list.sort((a, b) => {
      if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'revenue') return (b.revenue || 0) - (a.revenue || 0);
      if (sortBy === 'recent') return new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0);
      return 0;
    });
    return list;
  }, [clients, search, statusFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleAddClient = (clientData) => {
    addClient(clientData);
    if (addActivity) {
      addActivity({ description: `New client ${clientData.name} added`, type: 'client', timestamp: new Date().toISOString() });
    }
  };

  if (!loaded) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-muted mt-1">{filtered.length} total clients</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Add Client
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Prospect">Prospect</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-surface border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="name">Sort by Name</option>
            <option value="revenue">Sort by Revenue</option>
            <option value="recent">Sort by Recent</option>
          </select>
          {/* View toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map(client => (
              <Link key={client.id} href={`/clients/${client.id}`} className="group block bg-surface border border-border rounded-xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <Avatar name={client.name} color={client.color} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{client.name}</h3>
                    <p className="text-sm text-muted truncate">{client.company}</p>
                  </div>
                  <StatusBadge status={client.status} />
                </div>
                <p className="text-sm text-muted mb-3 truncate">{client.email}</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-xs text-muted">Revenue</p>
                    <p className="text-sm font-semibold text-foreground">${(client.revenue || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">Last Activity</p>
                    <p className="text-sm text-foreground">{client.lastActivity ? new Date(client.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* List / Table View */
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Email</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Revenue</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {paginated.map(client => (
                    <tr key={client.id} className="hover:bg-surface-elevated transition-colors">
                      <td className="px-5 py-4">
                        <Link href={`/clients/${client.id}`} className="flex items-center gap-3 group">
                          <Avatar name={client.name} color={client.color} size="sm" />
                          <div>
                            <p className="font-medium text-foreground group-hover:text-primary transition-colors">{client.name}</p>
                            <p className="text-sm text-muted">{client.company}</p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted hidden sm:table-cell">{client.email}</td>
                      <td className="px-5 py-4"><StatusBadge status={client.status} /></td>
                      <td className="px-5 py-4 text-sm text-foreground text-right font-medium">${(client.revenue || 0).toLocaleString()}</td>
                      <td className="px-5 py-4 text-sm text-muted text-right hidden md:table-cell">{client.lastActivity ? new Date(client.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {paginated.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            <p className="text-muted font-medium">No clients found</p>
            <p className="text-sm text-muted mt-1">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted">
              Showing {(currentPage - 1) * perPage + 1} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-surface text-foreground hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'border border-border bg-surface text-foreground hover:bg-surface-elevated'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-lg bg-surface text-foreground hover:bg-surface-elevated disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddClientModal onClose={() => setShowAddModal(false)} onAdd={handleAddClient} />}
    </div>
  );
}
