'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useClients, useActivities, useProjects } from '@/app/lib/hooks';

function Avatar({ name, color, size = 'lg' }) {
  const initials = (name || '').split(' ').map(n => n[0]).join('');
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`} style={{ backgroundColor: color || '#6366f1' }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    Prospect: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.Active}`}>
      {status}
    </span>
  );
}

function ActivityIcon({ type }) {
  const icons = {
    dollar: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    chat: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    folder: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
    file: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    calendar: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    client: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  };
  return <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">{icons[type] || icons.client}</div>;
}

function EditClientModal({ client, onClose, onSave }) {
  const [form, setForm] = useState({
    name: client.name || '',
    company: client.company || '',
    email: client.email || '',
    phone: client.phone || '',
    status: client.status || 'Active',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...client, ...form });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Edit Client</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Company</label>
            <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
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
            <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-5 w-32 bg-surface-elevated rounded animate-pulse mb-6" />
        <div className="bg-surface border border-border rounded-xl p-6 mb-6 animate-pulse">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-surface-elevated" />
            <div className="flex-1">
              <div className="h-7 w-48 bg-surface-elevated rounded mb-2" />
              <div className="h-4 w-32 bg-surface-elevated rounded mb-2" />
              <div className="h-3 w-40 bg-surface-elevated rounded" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
              <div className="h-4 w-20 bg-surface-elevated rounded mb-3" />
              <div className="h-8 w-16 bg-surface-elevated rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const tabs = ['Overview', 'Projects', 'Activity'];

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.id;
  const { clients, updateClient, loaded } = useClients();
  const { activities, loaded: activitiesLoaded } = useActivities();
  const { projects, loaded: projectsLoaded } = useProjects();
  const [activeTab, setActiveTab] = useState('Overview');
  const [newNote, setNewNote] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const client = (clients || []).find(c => String(c.id) === String(clientId));

  const clientActivities = (activities || []).filter(a =>
    (a.clientId && String(a.clientId) === String(clientId)) ||
    (a.description && client && a.description.toLowerCase().includes((client.name || '').toLowerCase()))
  ).slice(0, 10);

  const clientProjects = (projects || []).filter(p =>
    (p.clientId && String(p.clientId) === String(clientId)) ||
    (p.clientName && client && p.clientName === client.name) ||
    (p.client && client && p.client === client.name)
  );

  const handleAddNote = () => {
    if (!newNote.trim() || !client) return;
    const existingNotes = client.notes || [];
    updateClient({ ...client, notes: [{ id: Date.now(), text: newNote, date: new Date().toISOString().split('T')[0] }, ...existingNotes] });
    setNewNote('');
  };

  const handleSaveEdit = (updatedClient) => {
    updateClient(updatedClient);
  };

  if (!loaded) return <LoadingSkeleton />;

  if (!client) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/clients" className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back to Clients
          </Link>
          <div className="text-center py-16">
            <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            <p className="text-muted font-medium">Client not found</p>
            <p className="text-sm text-muted mt-1">This client may have been deleted or does not exist</p>
          </div>
        </div>
      </div>
    );
  }

  const notes = client.notes || [];
  const revenue = client.revenue || 0;
  const projectCount = clientProjects.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/clients" className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-6">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Back to Clients
        </Link>

        {/* Client header */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Avatar name={client.name} color={client.color} size="xl" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-foreground">{client.name}</h1>
                <StatusBadge status={client.status} />
              </div>
              <p className="text-muted">{client.company}</p>
              {client.joinDate && (
                <p className="text-sm text-muted mt-1">Client since {new Date(client.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowEditModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-surface-elevated transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit
              </button>
              <Link href="/messages" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Message
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted hover:text-foreground hover:border-border'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `$${revenue.toLocaleString()}`, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-emerald-500' },
                { label: 'Projects', value: projectCount, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>, color: 'text-primary' },
                { label: 'Notes', value: notes.length, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: 'text-amber-500' },
                { label: 'Activities', value: clientActivities.length, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, color: 'text-cyan-500' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={stat.color}>{stat.icon}</div>
                    <p className="text-sm text-muted">{stat.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Contact info */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Contact Information</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Email', value: client.email || 'Not set', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                    { label: 'Phone', value: client.phone || 'Not set', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                    { label: 'Company', value: client.company || 'Not set', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
                    { label: 'Status', value: client.status || 'Active', icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="text-muted mt-0.5">{item.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted">{item.label}</p>
                        <p className="text-sm text-foreground break-all">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity timeline */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
                {clientActivities.length > 0 ? (
                  <div className="space-y-4">
                    {clientActivities.map((activity, idx) => (
                      <div key={activity.id || idx} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <ActivityIcon type={activity.type || activity.icon || 'client'} />
                          {idx < clientActivities.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm text-foreground">{activity.description || activity.text}</p>
                          <p className="text-xs text-muted mt-0.5">
                            {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : activity.time || ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted">No recent activity for this client</p>
                )}
              </div>

              {/* Notes */}
              <div className="bg-surface border border-border rounded-xl p-5">
                <h3 className="font-semibold text-foreground mb-4">Notes</h3>
                <div className="mb-4">
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    rows={3}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="mt-2 px-3 py-1.5 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Note
                  </button>
                </div>
                <div className="space-y-3">
                  {notes.map(note => (
                    <div key={note.id} className="p-3 bg-surface-elevated rounded-lg">
                      <p className="text-sm text-foreground">{note.text}</p>
                      <p className="text-xs text-muted mt-1.5">{new Date(note.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                  ))}
                  {notes.length === 0 && <p className="text-sm text-muted">No notes yet</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'Projects' && (
          <div>
            {clientProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clientProjects.map(project => (
                  <div key={project.id} className="bg-surface border border-border rounded-xl p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-medium text-foreground text-sm">{project.title}</h4>
                      {project.priority && (
                        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          project.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                          project.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' :
                          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                        }`}>{project.priority}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted mb-3">{project.status}</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">Progress</span>
                        <span className="font-medium text-foreground">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted-light rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${(project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress || 0}%` }} />
                      </div>
                    </div>
                    {project.dueDate && (
                      <p className="text-xs text-muted mt-2">Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-xl p-12 text-center">
                <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <p className="text-lg font-medium text-foreground">No projects yet</p>
                <p className="text-muted mt-1">Projects associated with this client will appear here</p>
              </div>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'Activity' && (
          <div className="bg-surface border border-border rounded-xl p-5">
            <h3 className="font-semibold text-foreground mb-4">All Activity</h3>
            {clientActivities.length > 0 ? (
              <div className="space-y-4">
                {clientActivities.map((activity, idx) => (
                  <div key={activity.id || idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <ActivityIcon type={activity.type || activity.icon || 'client'} />
                      {idx < clientActivities.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-foreground">{activity.description || activity.text}</p>
                      <p className="text-xs text-muted mt-0.5">
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : activity.time || ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted">No activity recorded for this client</p>
            )}
          </div>
        )}
      </div>

      {showEditModal && <EditClientModal client={client} onClose={() => setShowEditModal(false)} onSave={handleSaveEdit} />}
    </div>
  );
}
