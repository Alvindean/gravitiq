'use client';

import { useState, useMemo } from 'react';
import { useProjects } from '@/app/lib/hooks';

const priorities = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
};

const columnConfig = [
  { key: 'backlog', title: 'Backlog', color: 'border-gray-400', dotColor: 'bg-gray-400' },
  { key: 'in_progress', title: 'In Progress', color: 'border-blue-500', dotColor: 'bg-blue-500' },
  { key: 'review', title: 'Review', color: 'border-amber-500', dotColor: 'bg-amber-500' },
  { key: 'completed', title: 'Completed', color: 'border-emerald-500', dotColor: 'bg-emerald-500' },
];

function statusToKey(status) {
  if (!status) return 'backlog';
  const s = status.toLowerCase().replace(/\s+/g, '_');
  if (s === 'in_progress' || s === 'in progress') return 'in_progress';
  if (s === 'review') return 'review';
  if (s === 'completed' || s === 'done') return 'completed';
  return 'backlog';
}

function statusKeyToTitle(key) {
  const map = { backlog: 'Backlog', in_progress: 'In Progress', review: 'Review', completed: 'Completed' };
  return map[key] || 'Backlog';
}

function TeamAvatars({ team }) {
  if (!team || team.length === 0) return null;
  return (
    <div className="flex -space-x-2">
      {team.slice(0, 3).map((member, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold border-2 border-surface"
          style={{ backgroundColor: member.color || '#6366f1', zIndex: team.length - i }}
          title={member.name}
        >
          {(member.name || '').split(' ').map(n => n[0]).join('')}
        </div>
      ))}
      {team.length > 3 && (
        <div className="w-7 h-7 rounded-full bg-muted-light flex items-center justify-center text-[10px] font-medium text-muted border-2 border-surface">
          +{team.length - 3}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project, onClick }) {
  return (
    <div onClick={() => onClick(project)} className="bg-surface border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{project.title}</h4>
        {project.priority && <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorities[project.priority] || priorities.Medium}`}>{project.priority}</span>}
      </div>
      <p className="text-xs text-muted mb-3">{project.clientName || project.client || 'No client'}</p>
      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Progress</span>
          <span className="font-medium text-foreground">{project.progress || 0}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${(project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <TeamAvatars team={project.team} />
        <div className="flex items-center gap-1 text-xs text-muted">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : project.due ? new Date(project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
        </div>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ title: '', clientName: '', priority: 'Medium', dueDate: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onAdd({
      title: form.title,
      clientName: form.clientName,
      client: form.clientName,
      priority: form.priority,
      dueDate: form.dueDate,
      due: form.dueDate,
      description: form.description,
      status: 'backlog',
      progress: 0,
      team: [],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">New Project</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Project title" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Client</label>
            <input type="text" value={form.clientName} onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Client name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none" placeholder="Describe the project..." />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-surface-elevated transition-colors text-sm font-medium">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectDetailModal({ project, onClose }) {
  if (!project) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">{project.title}</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Client:</span>
            <span className="text-sm text-foreground font-medium">{project.clientName || project.client || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Status:</span>
            <span className="text-sm text-foreground font-medium">{statusKeyToTitle(statusToKey(project.status))}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Priority:</span>
            {project.priority && <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${priorities[project.priority] || ''}`}>{project.priority}</span>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted">Due Date:</span>
            <span className="text-sm text-foreground">{project.dueDate || project.due ? new Date(project.dueDate || project.due).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Not set'}</span>
          </div>
          <div>
            <span className="text-sm text-muted">Progress:</span>
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted">Completion</span>
                <span className="font-medium text-foreground">{project.progress || 0}%</span>
              </div>
              <div className="w-full h-2 bg-muted-light rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${(project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress || 0}%` }} />
              </div>
            </div>
          </div>
          {project.description && (
            <div>
              <span className="text-sm text-muted">Description:</span>
              <p className="text-sm text-foreground mt-1">{project.description}</p>
            </div>
          )}
          {project.team && project.team.length > 0 && (
            <div>
              <span className="text-sm text-muted">Team:</span>
              <div className="mt-2"><TeamAvatars team={project.team} /></div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="w-full px-4 py-2.5 border border-border rounded-lg text-foreground hover:bg-surface-elevated transition-colors text-sm font-medium">Close</button>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="h-8 w-32 bg-surface-elevated rounded animate-pulse" />
            <div className="h-4 w-24 bg-surface-elevated rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-surface-elevated rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, col) => (
            <div key={col}>
              <div className="h-6 w-24 bg-surface-elevated rounded animate-pulse mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg p-4 animate-pulse">
                    <div className="h-4 w-32 bg-surface-elevated rounded mb-2" />
                    <div className="h-3 w-20 bg-surface-elevated rounded mb-3" />
                    <div className="h-1.5 w-full bg-surface-elevated rounded mb-3" />
                    <div className="h-6 w-16 bg-surface-elevated rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, addProject, loaded } = useProjects();
  const [viewMode, setViewMode] = useState('board');
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = projects || [];

  const columns = useMemo(() => {
    return columnConfig.map(col => ({
      ...col,
      projects: allProjects.filter(p => statusToKey(p.status) === col.key),
    }));
  }, [allProjects]);

  const allProjectsWithStatus = useMemo(() => {
    return allProjects.map(p => ({ ...p, displayStatus: statusKeyToTitle(statusToKey(p.status)) }));
  }, [allProjects]);

  if (!loaded) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted mt-1">{allProjects.length} total projects</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode('board')} className={`px-3 py-2 text-sm flex items-center gap-1.5 ${viewMode === 'board' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="10" rx="1" /></svg>
                Board
              </button>
              <button onClick={() => setViewMode('list')} className={`px-3 py-2 text-sm flex items-center gap-1.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-foreground'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                List
              </button>
            </div>
            <button onClick={() => setShowNewModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          </div>
        </div>

        {/* Board View */}
        {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.key}>
                <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${column.color}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                  <h3 className="font-semibold text-foreground text-sm">{column.title}</h3>
                  <span className="ml-auto text-xs text-muted bg-muted-light px-2 py-0.5 rounded-full">{column.projects.length}</span>
                </div>
                <div className="space-y-3">
                  {column.projects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={setSelectedProject} />
                  ))}
                  {column.projects.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <p className="text-xs text-muted">No projects</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-surface-elevated">
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Project</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden sm:table-cell">Client</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider">Priority</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Progress</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden lg:table-cell">Team</th>
                    <th className="text-right px-5 py-3 text-xs font-medium text-muted uppercase tracking-wider hidden md:table-cell">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allProjectsWithStatus.map(project => {
                    const statusKey = statusToKey(project.status);
                    return (
                      <tr key={project.id} onClick={() => setSelectedProject(project)} className="hover:bg-surface-elevated transition-colors cursor-pointer">
                        <td className="px-5 py-4">
                          <p className="font-medium text-foreground text-sm">{project.title}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-muted hidden sm:table-cell">{project.clientName || project.client || 'N/A'}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            statusKey === 'completed' ? 'text-emerald-600 dark:text-emerald-400' :
                            statusKey === 'in_progress' ? 'text-blue-600 dark:text-blue-400' :
                            statusKey === 'review' ? 'text-amber-600 dark:text-amber-400' :
                            'text-gray-500 dark:text-gray-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              statusKey === 'completed' ? 'bg-emerald-500' :
                              statusKey === 'in_progress' ? 'bg-blue-500' :
                              statusKey === 'review' ? 'bg-amber-500' :
                              'bg-gray-400'
                            }`} />
                            {project.displayStatus}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {project.priority && <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorities[project.priority] || ''}`}>{project.priority}</span>}
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 bg-muted-light rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${(project.progress || 0) === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress || 0}%` }} />
                            </div>
                            <span className="text-xs text-muted">{project.progress || 0}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell"><TeamAvatars team={project.team} /></td>
                        <td className="px-5 py-4 text-sm text-muted text-right hidden md:table-cell">
                          {project.dueDate || project.due ? new Date(project.dueDate || project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not set'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {allProjects.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-12 h-12 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                <p className="text-muted font-medium">No projects yet</p>
                <p className="text-sm text-muted mt-1">Create your first project to get started</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showNewModal && <NewProjectModal onClose={() => setShowNewModal(false)} onAdd={addProject} />}
      {selectedProject && <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  );
}
