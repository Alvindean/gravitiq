'use client';

import { useState } from 'react';

const members = [
  { id: 1, name: 'Alvin Warren', email: 'alvin@gravitiq.io', role: 'Owner', status: 'Active', joined: 'Jan 15, 2025', isYou: true, color: '#4f46e5' },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah@gravitiq.io', role: 'Admin', status: 'Active', joined: 'Feb 3, 2025', isYou: false, color: '#06b6d4' },
  { id: 3, name: 'James Rodriguez', email: 'james@gravitiq.io', role: 'Member', status: 'Active', joined: 'Mar 12, 2025', isYou: false, color: '#8b5cf6' },
  { id: 4, name: 'Emily Chen', email: 'emily@gravitiq.io', role: 'Member', status: 'Active', joined: 'Apr 22, 2025', isYou: false, color: '#ec4899' },
  { id: 5, name: 'Marcus Thompson', email: 'marcus@gravitiq.io', role: 'Viewer', status: 'Inactive', joined: 'Jun 8, 2025', isYou: false, color: '#f59e0b' },
  { id: 6, name: 'Olivia Parker', email: 'olivia@gravitiq.io', role: 'Member', status: 'Active', joined: 'Aug 1, 2025', isYou: false, color: '#10b981' },
];

const pendingInvites = [
  { id: 1, email: 'daniel.kim@example.com', role: 'Member', sentDate: 'Apr 5, 2026' },
  { id: 2, email: 'rachel.foster@example.com', role: 'Viewer', sentDate: 'Apr 8, 2026' },
];

const roles = [
  {
    name: 'Owner',
    desc: 'Full access to everything. Cannot be removed.',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    permissions: ['Manage team members', 'Manage billing', 'Create & delete projects', 'View analytics', 'Manage integrations', 'Delete workspace'],
  },
  {
    name: 'Admin',
    desc: 'Can manage most settings except billing and ownership.',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    permissions: ['Manage team members', 'Create & delete projects', 'View analytics', 'Manage integrations'],
  },
  {
    name: 'Member',
    desc: 'Can create projects and collaborate with the team.',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    permissions: ['Create projects', 'View analytics', 'Edit assigned tasks', 'Upload files'],
  },
  {
    name: 'Viewer',
    desc: 'Read-only access to projects and analytics.',
    color: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400',
    permissions: ['View projects', 'View analytics', 'Add comments'],
  },
];

function StatusBadge({ status }) {
  const styles = {
    Active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    Inactive: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    Invited: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  const styles = {
    Owner: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
    Admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
    Member: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    Viewer: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role]}`}>
      {role}
    </span>
  );
}

function MemberAvatar({ name, color }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ backgroundColor: color }}>
      {initials}
    </div>
  );
}

export default function TeamPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Team</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Manage your team members, invitations, and roles.</p>
        </div>
        <button
          onClick={() => setShowInviteModal(!showInviteModal)}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Invite Member
        </button>
      </div>

      {/* Invite modal */}
      {showInviteModal && (
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Invite a new member</h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <input type="email" placeholder="Enter email address" className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100" />
            <select className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100">
              <option>Member</option>
              <option>Admin</option>
              <option>Viewer</option>
            </select>
            <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Send Invite
            </button>
          </div>
        </div>
      )}

      {/* Team members table */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Team Members ({members.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50">
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Member</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Role</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Status</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Joined</th>
                <th className="px-6 py-3 font-medium text-zinc-600 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m, idx) => (
                <tr key={m.id} className={`border-b border-zinc-100 dark:border-zinc-800 ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`}>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <MemberAvatar name={m.name} color={m.color} />
                      <div>
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {m.name}
                          {m.isYou && <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">You</span>}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3"><RoleBadge role={m.role} /></td>
                  <td className="px-6 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{m.joined}</td>
                  <td className="px-6 py-3">
                    {!m.isYou && (
                      <div className="flex items-center gap-3">
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Edit role</button>
                        <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Remove</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending invitations */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Pending Invitations ({pendingInvites.length})</h2>
        </div>
        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {pendingInvites.map(inv => (
            <div key={inv.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{inv.email}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">Invited as {inv.role} &middot; Sent {inv.sentDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Resend</button>
                <button className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Cancel</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roles & Permissions */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Roles & Permissions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roles.map(role => (
            <div key={role.name} className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${role.color}`}>{role.name}</span>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{role.desc}</p>
              <ul className="space-y-2">
                {role.permissions.map(p => (
                  <li key={p} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
