'use client';

import { useState } from 'react';
import Link from 'next/link';

const priorities = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  Low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
};

const columns = [
  {
    title: 'Backlog',
    color: 'border-gray-400',
    dotColor: 'bg-gray-400',
    projects: [
      { id: 1, title: 'API Documentation', client: 'TechFlow Inc', due: '2026-05-15', priority: 'Low', progress: 0, team: [{ name: 'Alex N', color: '#6366f1' }, { name: 'Rachel F', color: '#f97316' }] },
      { id: 2, title: 'Payment Integration', client: 'BrightPath Labs', due: '2026-05-20', priority: 'Medium', progress: 0, team: [{ name: 'Emily C', color: '#8b5cf6' }, { name: 'James R', color: '#06b6d4' }, { name: 'Daniel K', color: '#10b981' }] },
      { id: 3, title: 'User Onboarding Flow', client: 'Quantum Dynamics', due: '2026-06-01', priority: 'High', progress: 0, team: [{ name: 'Sarah M', color: '#4f46e5' }] },
    ],
  },
  {
    title: 'In Progress',
    color: 'border-blue-500',
    dotColor: 'bg-blue-500',
    projects: [
      { id: 4, title: 'Website Redesign', client: 'TechFlow Inc', due: '2026-04-25', priority: 'High', progress: 65, team: [{ name: 'Sarah M', color: '#4f46e5' }, { name: 'Olivia P', color: '#ec4899' }] },
      { id: 5, title: 'Mobile App MVP', client: 'Nova Creative', due: '2026-05-10', priority: 'High', progress: 40, team: [{ name: 'Alex N', color: '#6366f1' }, { name: 'Marcus T', color: '#f59e0b' }, { name: 'Emily C', color: '#8b5cf6' }] },
      { id: 6, title: 'SEO Optimization', client: 'Luminary Design', due: '2026-04-30', priority: 'Medium', progress: 55, team: [{ name: 'Rachel F', color: '#f97316' }] },
      { id: 7, title: 'CRM Dashboard', client: 'Apex Ventures', due: '2026-05-05', priority: 'Medium', progress: 30, team: [{ name: 'Daniel K', color: '#10b981' }, { name: 'James R', color: '#06b6d4' }] },
    ],
  },
  {
    title: 'Review',
    color: 'border-amber-500',
    dotColor: 'bg-amber-500',
    projects: [
      { id: 8, title: 'Brand Identity Package', client: 'Quantum Dynamics', due: '2026-04-18', priority: 'Medium', progress: 90, team: [{ name: 'Olivia P', color: '#ec4899' }, { name: 'Sarah M', color: '#4f46e5' }] },
      { id: 9, title: 'Email Campaign System', client: 'BrightPath Labs', due: '2026-04-20', priority: 'Low', progress: 85, team: [{ name: 'Marcus T', color: '#f59e0b' }] },
      { id: 10, title: 'Analytics Dashboard', client: 'Stellar Systems', due: '2026-04-22', priority: 'High', progress: 95, team: [{ name: 'Alex N', color: '#6366f1' }, { name: 'Daniel K', color: '#10b981' }, { name: 'Rachel F', color: '#f97316' }] },
    ],
  },
  {
    title: 'Completed',
    color: 'border-emerald-500',
    dotColor: 'bg-emerald-500',
    projects: [
      { id: 11, title: 'Landing Page', client: 'Nova Creative', due: '2026-04-05', priority: 'Low', progress: 100, team: [{ name: 'Sarah M', color: '#4f46e5' }, { name: 'Rachel F', color: '#f97316' }] },
      { id: 12, title: 'Database Migration', client: 'TechFlow Inc', due: '2026-04-01', priority: 'High', progress: 100, team: [{ name: 'James R', color: '#06b6d4' }, { name: 'Emily C', color: '#8b5cf6' }] },
      { id: 13, title: 'Security Audit', client: 'Horizon Tech', due: '2026-03-28', priority: 'High', progress: 100, team: [{ name: 'Alex N', color: '#6366f1' }] },
      { id: 14, title: 'Logo Refresh', client: 'Luminary Design', due: '2026-03-20', priority: 'Low', progress: 100, team: [{ name: 'Olivia P', color: '#ec4899' }, { name: 'Marcus T', color: '#f59e0b' }] },
    ],
  },
];

function TeamAvatars({ team }) {
  return (
    <div className="flex -space-x-2">
      {team.slice(0, 3).map((member, i) => (
        <div
          key={i}
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold border-2 border-surface"
          style={{ backgroundColor: member.color, zIndex: team.length - i }}
          title={member.name}
        >
          {member.name.split(' ').map(n => n[0]).join('')}
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

function ProjectCard({ project }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5 transition-all cursor-pointer group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">{project.title}</h4>
        <span className={`shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorities[project.priority]}`}>{project.priority}</span>
      </div>
      <p className="text-xs text-muted mb-3">{project.client}</p>
      {/* Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-muted-light rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <TeamAvatars team={project.team} />
        <div className="flex items-center gap-1 text-xs text-muted">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          {new Date(project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState('board');

  const allProjects = columns.flatMap(col => col.projects.map(p => ({ ...p, status: col.title })));

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
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              New Project
            </button>
          </div>
        </div>

        {/* Board View */}
        {viewMode === 'board' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.title}>
                <div className={`flex items-center gap-2 mb-4 pb-3 border-b-2 ${column.color}`}>
                  <div className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                  <h3 className="font-semibold text-foreground text-sm">{column.title}</h3>
                  <span className="ml-auto text-xs text-muted bg-muted-light px-2 py-0.5 rounded-full">{column.projects.length}</span>
                </div>
                <div className="space-y-3">
                  {column.projects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
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
                  {allProjects.map(project => (
                    <tr key={project.id} className="hover:bg-surface-elevated transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground text-sm">{project.title}</p>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted hidden sm:table-cell">{project.client}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          project.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' :
                          project.status === 'In Progress' ? 'text-blue-600 dark:text-blue-400' :
                          project.status === 'Review' ? 'text-amber-600 dark:text-amber-400' :
                          'text-gray-500 dark:text-gray-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            project.status === 'Completed' ? 'bg-emerald-500' :
                            project.status === 'In Progress' ? 'bg-blue-500' :
                            project.status === 'Review' ? 'bg-amber-500' :
                            'bg-gray-400'
                          }`} />
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${priorities[project.priority]}`}>{project.priority}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-muted-light rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell"><TeamAvatars team={project.team} /></td>
                      <td className="px-5 py-4 text-sm text-muted text-right hidden md:table-cell">
                        {new Date(project.due).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
