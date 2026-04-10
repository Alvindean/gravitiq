'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProfile, useNotifications } from '@/app/lib/hooks';

const tabs = ['Profile', 'Notifications', 'Security', 'Integrations'];

const timezones = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai',
  'Australia/Sydney', 'Pacific/Auckland',
];

const emailNotificationsMeta = [
  { key: 'emailNewClient', label: 'New client', desc: 'Get notified when a new client is added to your workspace' },
  { key: 'emailInvoicePaid', label: 'Invoice paid', desc: 'Receive alerts when clients pay their invoices' },
  { key: 'emailProjectUpdate', label: 'Project update', desc: 'Stay informed about project milestones and changes' },
  { key: 'emailAiComplete', label: 'AI task complete', desc: 'Know when AI-powered tasks finish processing' },
  { key: 'emailWeeklyDigest', label: 'Weekly digest', desc: 'A weekly summary of your workspace activity' },
];

const pushNotificationsMeta = [
  { key: 'pushMentions', label: 'Mentions', desc: 'When someone mentions you in a comment or message' },
  { key: 'pushDirectMessages', label: 'Direct messages', desc: 'Receive push notifications for new direct messages' },
  { key: 'pushTaskAssignments', label: 'Task assignments', desc: 'When a task is assigned to you or updated' },
];

const defaultSessions = [
  { id: 1, device: 'MacBook Pro - Chrome', location: 'San Francisco, CA', lastActive: '2 minutes ago', current: true },
  { id: 2, device: 'iPhone 15 - Safari', location: 'San Francisco, CA', lastActive: '1 hour ago', current: false },
  { id: 3, device: 'Windows PC - Firefox', location: 'New York, NY', lastActive: '3 days ago', current: false },
];

const defaultIntegrations = {
  slack: true,
  google: true,
  stripe: false,
  quickbooks: false,
  hubspot: true,
  zapier: false,
  github: false,
  jira: false,
};

const integrationsList = [
  { id: 'slack', name: 'Slack', desc: 'Send notifications and updates to Slack channels' },
  { id: 'google', name: 'Google Workspace', desc: 'Sync contacts, calendar, and drive files' },
  { id: 'stripe', name: 'Stripe', desc: 'Process payments and manage subscriptions' },
  { id: 'quickbooks', name: 'QuickBooks', desc: 'Sync invoices and financial data' },
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync CRM contacts and deal pipelines' },
  { id: 'zapier', name: 'Zapier', desc: 'Automate workflows with 5,000+ apps' },
  { id: 'github', name: 'GitHub', desc: 'Link repositories and track development' },
  { id: 'jira', name: 'Jira', desc: 'Sync issues and project boards' },
];

/* ─── Toast ─── */
function Toast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className="fixed top-4 right-4 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg animate-slide-in">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        {message}
      </div>
    </div>
  );
}

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

/* ─── Toggle ─── */
function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onToggle}
      className={[
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-zinc-200 dark:bg-zinc-700',
      ].join(' ')}
    >
      <span
        className={[
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200',
          enabled ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  );
}

/* ─── IntegrationIcon ─── */
function IntegrationIcon({ name }) {
  const colors = {
    Slack: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
    'Google Workspace': 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400',
    Stripe: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
    QuickBooks: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400',
    HubSpot: 'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400',
    Zapier: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    GitHub: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300',
    Jira: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  };
  return (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${colors[name] || 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
      {name.charAt(0)}
    </div>
  );
}

/* ─── Loading Skeleton ─── */
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-20 w-20 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="grid grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-20 rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Profile Tab ─── */
function ProfileTab({ showToast }) {
  const { profile, updateProfile, loaded } = useProfile();
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', jobTitle: '', timezone: '' });

  useEffect(() => {
    if (loaded && profile) {
      setForm({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        company: profile.company || '',
        jobTitle: profile.jobTitle || '',
        timezone: profile.timezone || 'America/New_York',
      });
    }
  }, [loaded, profile]);

  if (!loaded) return <LoadingSkeleton />;

  const initials = (form.name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleSave = () => {
    updateProfile(form);
    showToast('Profile saved successfully');
  };

  const handleChange = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-8">
      {/* Avatar */}
      <div className="flex items-center gap-6">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            {initials}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Profile photo</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
          <input type="text" value={form.name} onChange={handleChange('name')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
          <input type="email" value={form.email} onChange={handleChange('email')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone</label>
          <input type="tel" value={form.phone} onChange={handleChange('phone')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Company</label>
          <input type="text" value={form.company} onChange={handleChange('company')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Job Title</label>
          <input type="text" value={form.jobTitle} onChange={handleChange('jobTitle')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Timezone</label>
          <select value={form.timezone} onChange={handleChange('timezone')} className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
            {timezones.map(tz => <option key={tz} value={tz}>{tz.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Notifications Tab ─── */
function NotificationsTab({ showToast }) {
  const { notifications, updateNotifications, loaded } = useNotifications();

  if (!loaded) return <LoadingSkeleton />;

  const handleToggle = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    updateNotifications(updated);
    showToast('Notification preference updated');
  };

  return (
    <div className="space-y-8">
      {/* Email notifications */}
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Email Notifications</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Choose which emails you want to receive.</p>
        <div className="mt-4 space-y-4">
          {emailNotificationsMeta.map(n => (
            <div key={n.key} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{n.label}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{n.desc}</p>
              </div>
              <Toggle enabled={!!notifications[n.key]} onToggle={() => handleToggle(n.key)} />
            </div>
          ))}
        </div>
      </div>

      {/* Push notifications */}
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Push Notifications</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Configure your push notification preferences.</p>
        <div className="mt-4 space-y-4">
          {pushNotificationsMeta.map(n => (
            <div key={n.key} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{n.label}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{n.desc}</p>
              </div>
              <Toggle enabled={!!notifications[n.key]} onToggle={() => handleToggle(n.key)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Security Tab ─── */
function SecurityTab({ showToast }) {
  const [twoFactor, setTwoFactor] = useLocalStorage('gravitiq_2fa', false);
  const [sessions, setSessions] = useLocalStorage('gravitiq_sessions', defaultSessions);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');

  const handlePasswordUpdate = () => {
    setPwError('');
    if (!currentPw.trim()) { setPwError('Current password is required.'); return; }
    if (!newPw.trim()) { setPwError('New password is required.'); return; }
    if (newPw.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return; }
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    showToast('Password updated successfully');
  };

  const handle2FAToggle = () => {
    setTwoFactor(!twoFactor);
    showToast(twoFactor ? '2FA disabled' : '2FA enabled');
  };

  const revokeSession = (id) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    showToast('Session revoked');
  };

  return (
    <div className="space-y-8">
      {/* Change password */}
      <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Change Password</h3>
        <div className="mt-4 space-y-4 max-w-md">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="Enter current password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Enter new password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Confirm new password" className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
          </div>
          {pwError && <p className="text-sm text-red-600 dark:text-red-400">{pwError}</p>}
          <button onClick={handlePasswordUpdate} className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
            Update Password
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Two-Factor Authentication</h3>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Add an extra layer of security to your account.</p>
          </div>
          <Toggle enabled={twoFactor} onToggle={handle2FAToggle} />
        </div>
        {twoFactor && (
          <div className="mt-6 flex items-center gap-6">
            <div className="w-40 h-40 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 14.625v2.25m0 2.25h2.25m2.25 0h-2.25m0 0v-2.25m0 0h-2.25" />
                </svg>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">QR Code</p>
              </div>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
              <p>Scan this QR code with your authenticator app.</p>
              <p className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded-lg">GRAV-2FA-XXXX-XXXX-XXXX</p>
            </div>
          </div>
        )}
      </div>

      {/* Active sessions */}
      <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-700">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Active Sessions</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your active sessions across devices.</p>
        <div className="mt-4 space-y-3">
          {sessions.map(s => (
            <div key={s.id} className="flex items-center justify-between rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-zinc-500 dark:text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {s.device}
                    {s.current && <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">Current</span>}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{s.location} &middot; {s.lastActive}</p>
                </div>
              </div>
              {!s.current && (
                <button onClick={() => revokeSession(s.id)} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Revoke</button>
              )}
            </div>
          ))}
          {sessions.length === 0 && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4 text-center">No active sessions.</p>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-900/10">
        <h3 className="text-base font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
        <p className="mt-1 text-sm text-red-700 dark:text-red-400/80">Once you delete your account, there is no going back. All of your data will be permanently removed.</p>
        <button className="mt-4 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors dark:bg-red-500 dark:hover:bg-red-600">
          Delete Account
        </button>
      </div>
    </div>
  );
}

/* ─── Integrations Tab ─── */
function IntegrationsTab({ showToast }) {
  const [integrationState, setIntegrationState] = useLocalStorage('gravitiq_integrations', defaultIntegrations);

  const toggleIntegration = (id) => {
    setIntegrationState(prev => {
      const next = { ...prev, [id]: !prev[id] };
      return next;
    });
    showToast(integrationState[id] ? 'Integration disconnected' : 'Integration connected');
  };

  return (
    <div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Integrations</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Connect your favorite tools to streamline your workflow.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {integrationsList.map(i => (
          <div key={i.id} className="flex items-start gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
            <IntegrationIcon name={i.name} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{i.name}</p>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${integrationState[i.id] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                  {integrationState[i.id] ? 'Connected' : 'Not connected'}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{i.desc}</p>
              <button
                onClick={() => toggleIntegration(i.id)}
                className={`mt-3 inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  integrationState[i.id]
                    ? 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600'
                }`}
              >
                {integrationState[i.id] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const tabContent = [
    <ProfileTab key="p" showToast={showToast} />,
    <NotificationsTab key="n" showToast={showToast} />,
    <SecurityTab key="s" showToast={showToast} />,
    <IntegrationsTab key="i" showToast={showToast} />,
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your account preferences and configuration.</p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div role="tablist" className="flex border-b border-zinc-200 dark:border-zinc-700">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              role="tab"
              aria-selected={activeTab === idx}
              onClick={() => setActiveTab(idx)}
              className={[
                'relative px-4 py-2.5 text-sm font-medium transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset',
                activeTab === idx
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300',
              ].join(' ')}
            >
              {tab}
              {activeTab === idx && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div role="tabpanel">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}
