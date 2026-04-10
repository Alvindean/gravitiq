'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTeam } from '@/app/lib/hooks';

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

const rolesList = ['Admin', 'Member', 'Viewer'];

const rolesInfo = [
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
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
    inactive: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    invited: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.inactive}`}>
      {label}
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
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[role] || styles.Viewer}`}>
      {role}
    </span>
  );
}

function MemberAvatar({ name, color }) {
  const initials = name ? name.split(' ').map(n => n[0]).join('') : '?';
  return (
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ backgroundColor: color || '#6366f1' }}>
      {initials}
    </div>
  );
}

export default function TeamPage() {
  const { team, addMember, updateMember, removeMember, loaded } = useTeam();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  const showToast = useCallback((msg) => setToast(msg), []);
  const dismissToast = useCallback(() => setToast(null), []);

  if (!loaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
          <div className="h-64 rounded-xl bg-zinc-200 dark:bg-zinc-700" />
        </div>
      </div>
    );
  }

  const activeMembers = team.filter(m => m.status !== 'invited');
  const pendingInvites = team.filter(m => m.status === 'invited');
  const isYou = (member) => member.name === 'Alvin Warren' || member.email === 'alvin@gravitiq.io';
  const isOwner = (member) => member.role === 'Owner';

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1'];
    addMember({
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: 'invited',
      joinedAt: new Date().toISOString(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    });
    setInviteEmail('');
    setInviteRole('Member');
    setShowInviteModal(false);
    showToast(`Invitation sent to ${inviteEmail}`);
  };

  const handleEditRole = (member) => {
    setEditingId(member.id);
    setEditRole(member.role);
  };

  const saveRole = (id) => {
    updateMember(id, { role: editRole });
    setEditingId(null);
    showToast('Role updated');
  };

  const handleRemove = (member) => {
    if (isOwner(member)) {
      showToast('Cannot remove the workspace owner');
      return;
    }
    setConfirmRemoveId(member.id);
  };

  const confirmRemove = () => {
    removeMember(confirmRemoveId);
    setConfirmRemoveId(null);
    showToast('Member removed');
  };

  const handleResend = (email) => {
    showToast(`Invitation resent to ${email}`);
  };

  const handleCancelInvite = (id) => {
    removeMember(id);
    showToast('Invitation cancelled');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      {/* Confirm Remove Modal */}
      {confirmRemoveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Remove Member</h3>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">Are you sure you want to remove this team member? This action cannot be undone.</p>
            <div className="mt-4 flex gap-3 justify-end">
              <button onClick={() => setConfirmRemoveId(null)} className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800">Cancel</button>
              <button onClick={confirmRemove} className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors dark:bg-red-500 dark:hover:bg-red-600">Remove</button>
            </div>
          </div>
        </div>
      )}

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
            <input
              type="email"
              value={inviteEmail}
              onChange={e => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
            >
              {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              onClick={handleInvite}
              className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              Send Invite
            </button>
          </div>
        </div>
      )}

      {/* Team members table */}
      <div className="mb-8 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-700">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Team Members ({activeMembers.length})</h2>
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
              {activeMembers.map((m, idx) => {
                const joinedDate = m.joinedAt ? new Date(m.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
                return (
                  <tr key={m.id} className={`border-b border-zinc-100 dark:border-zinc-800 ${idx % 2 === 1 ? 'bg-zinc-50/50 dark:bg-zinc-800/25' : ''}`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <MemberAvatar name={m.name} color={m.avatarColor} />
                        <div>
                          <p className="font-medium text-zinc-900 dark:text-zinc-100">
                            {m.name}
                            {isYou(m) && <span className="ml-2 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">You</span>}
                          </p>
                          <p className="text-zinc-500 dark:text-zinc-400">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {editingId === m.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editRole}
                            onChange={e => setEditRole(e.target.value)}
                            className="rounded-lg border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100"
                          >
                            {rolesList.map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                          <button onClick={() => saveRole(m.id)} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">Save</button>
                          <button onClick={() => setEditingId(null)} className="text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:text-zinc-400">Cancel</button>
                        </div>
                      ) : (
                        <RoleBadge role={m.role} />
                      )}
                    </td>
                    <td className="px-6 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-6 py-3 text-zinc-500 dark:text-zinc-400">{joinedDate}</td>
                    <td className="px-6 py-3">
                      {!isYou(m) && !isOwner(m) && (
                        <div className="flex items-center gap-3">
                          <button onClick={() => handleEditRole(m)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Edit role</button>
                          <button onClick={() => handleRemove(m)} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
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
          {pendingInvites.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">No pending invitations.</div>
          )}
          {pendingInvites.map(inv => {
            const sentDate = inv.joinedAt ? new Date(inv.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
            return (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{inv.email}</p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">Invited as {inv.role} {sentDate && <>&middot; Sent {sentDate}</>}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleResend(inv.email)} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">Resend</button>
                  <button onClick={() => handleCancelInvite(inv.id)} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">Cancel</button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roles & Permissions */}
      <div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Roles & Permissions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rolesInfo.map(role => (
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
