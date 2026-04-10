'use client';

import { useState } from 'react';
import Link from 'next/link';

const clientData = {
  id: 1,
  name: 'Sarah Mitchell',
  company: 'TechFlow Inc',
  email: 'sarah@techflow.io',
  phone: '+1 (415) 555-0142',
  address: '456 Innovation Blvd, San Francisco, CA 94107',
  website: 'https://techflow.io',
  status: 'Active',
  color: '#4f46e5',
  joinDate: '2025-06-15',
  stats: { revenue: 12450, projects: 5, invoices: 12, messages: 34 },
  activities: [
    { id: 1, type: 'invoice', text: 'Invoice #INV-0042 was paid', time: '2 hours ago', icon: 'dollar' },
    { id: 2, type: 'message', text: 'Sent a message about project timeline', time: '5 hours ago', icon: 'chat' },
    { id: 3, type: 'project', text: 'Project "Website Redesign" moved to Review', time: '1 day ago', icon: 'folder' },
    { id: 4, type: 'file', text: 'Uploaded brand guidelines PDF', time: '2 days ago', icon: 'file' },
    { id: 5, type: 'meeting', text: 'Completed quarterly review meeting', time: '4 days ago', icon: 'calendar' },
  ],
  notes: [
    { id: 1, text: 'Prefers bi-weekly check-ins on Tuesdays. Very detail-oriented on deliverables.', date: '2026-04-05' },
    { id: 2, text: 'Interested in expanding scope to include mobile app development in Q3.', date: '2026-03-22' },
  ],
};

function Avatar({ name, color, size = 'lg' }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-16 h-16 text-xl', xl: 'w-20 h-20 text-2xl' };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`} style={{ backgroundColor: color }}>
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
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
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
  };
  return <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center text-primary shrink-0">{icons[type]}</div>;
}

const tabs = ['Overview', 'Projects', 'Invoices', 'Messages', 'Files'];

export default function ClientDetailPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(clientData.notes);
  const client = clientData;

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [{ id: Date.now(), text: newNote, date: new Date().toISOString().split('T')[0] }, ...prev]);
    setNewNote('');
  };

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
              <p className="text-sm text-muted mt-1">Client since {new Date(client.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-surface-elevated transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                Edit
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Message
              </button>
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
                { label: 'Total Revenue', value: `$${client.stats.revenue.toLocaleString()}`, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: 'text-emerald-500' },
                { label: 'Projects', value: client.stats.projects, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>, color: 'text-primary' },
                { label: 'Invoices', value: client.stats.invoices, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>, color: 'text-amber-500' },
                { label: 'Messages', value: client.stats.messages, icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>, color: 'text-cyan-500' },
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
                    { label: 'Email', value: client.email, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                    { label: 'Phone', value: client.phone, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
                    { label: 'Address', value: client.address, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                    { label: 'Website', value: client.website, icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg> },
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
                <div className="space-y-4">
                  {client.activities.map((activity, idx) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <ActivityIcon type={activity.icon} />
                        {idx < client.activities.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-foreground">{activity.text}</p>
                        <p className="text-xs text-muted mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'Overview' && (
          <div className="bg-surface border border-border rounded-xl p-12 text-center">
            <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            <p className="text-lg font-medium text-foreground">{activeTab}</p>
            <p className="text-muted mt-1">This section is coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
