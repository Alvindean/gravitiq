'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/* ───── inline SVG icon components ───── */
function IconHome({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function IconChart({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconSparkle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
      <path d="M18 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
    </svg>
  );
}

function IconUsers({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconFolder({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
    </svg>
  );
}

function IconChat({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function IconCreditCard({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  );
}

function IconDocument({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function IconGear({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

function IconPeople({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  );
}

function IconSearch({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconBell({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function IconPlus({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconChevronDown({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function IconMenu({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function IconX({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconCollapse({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function IconExpand({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function IconLogout({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function IconUser({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ───── navigation data ───── */
const navSections = [
  {
    label: 'MAIN',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: IconHome },
      { name: 'Analytics', href: '/analytics', icon: IconChart },
      { name: 'AI Assistant', href: '/ai-assistant', icon: IconSparkle },
    ],
  },
  {
    label: 'MANAGE',
    items: [
      { name: 'Clients', href: '/clients', icon: IconUsers },
      { name: 'Projects', href: '/projects', icon: IconFolder },
      { name: 'Messages', href: '/messages', icon: IconChat },
    ],
  },
  {
    label: 'FINANCE',
    items: [
      { name: 'Billing', href: '/billing', icon: IconCreditCard },
      { name: 'Invoices', href: '/invoices', icon: IconDocument },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Settings', href: '/settings', icon: IconGear },
      { name: 'Team', href: '/team', icon: IconPeople },
    ],
  },
];

/* ───── breadcrumb helper ───── */
function getBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((seg, i) => ({
    label: seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
    isLast: i === segments.length - 1,
  }));
}

/* ───── layout component ───── */
export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const breadcrumbs = getBreadcrumbs(pathname);

  /* close profile dropdown on outside click */
  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  /* close mobile drawer on route change */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  /* sidebar content (shared between desktop + mobile) */
  function SidebarContent({ isMobile }) {
    const isCollapsed = !isMobile && collapsed;

    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 pt-6 pb-4 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight text-foreground">
              Gravitiq
            </span>
          )}
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-6 mt-2">
          {navSections.map((section) => (
            <div key={section.label}>
              {!isCollapsed && (
                <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted">
                  {section.label}
                </p>
              )}
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                            : 'text-muted hover:bg-surface-elevated hover:text-foreground'
                        } ${isCollapsed ? 'justify-center px-2' : ''}`}
                        title={isCollapsed ? item.name : undefined}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-muted group-hover:text-foreground'}`} />
                        {!isCollapsed && <span>{item.name}</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* User profile card */}
        <div className="border-t border-border px-3 py-4" ref={isMobile ? undefined : profileRef}>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 hover:bg-surface-elevated transition-colors ${isCollapsed ? 'justify-center px-2' : ''}`}
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0">
                <span className="text-sm font-semibold text-white">AW</span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">Alvin Warren</p>
                    <p className="text-xs text-muted truncate">Administrator</p>
                  </div>
                  <IconChevronDown className={`w-4 h-4 text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-surface border border-border rounded-xl shadow-xl py-1.5 z-50">
                <Link href="/settings/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors">
                  <IconUser className="w-4 h-4 text-muted" />
                  <span>Profile</span>
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-surface-elevated transition-colors">
                  <IconGear className="w-4 h-4 text-muted" />
                  <span>Settings</span>
                </Link>
                <div className="border-t border-border my-1" />
                <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-colors">
                  <IconLogout className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* ── Desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-surface transition-all duration-300 shrink-0 ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        <SidebarContent isMobile={false} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-7 z-30 flex items-center justify-center w-6 h-6 rounded-full border border-border bg-surface shadow-sm hover:bg-surface-elevated transition-colors"
          style={{ left: collapsed ? '60px' : '248px' }}
        >
          {collapsed ? (
            <IconExpand className="w-3.5 h-3.5 text-muted" />
          ) : (
            <IconCollapse className="w-3.5 h-3.5 text-muted" />
          )}
        </button>
      </aside>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-border transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-elevated transition-colors"
        >
          <IconX className="w-5 h-5 text-muted" />
        </button>
        <SidebarContent isMobile={true} />
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="h-16 border-b border-border bg-surface/80 backdrop-blur-md flex items-center justify-between px-4 lg:px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-elevated transition-colors"
            >
              <IconMenu className="w-5 h-5 text-foreground" />
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              <Link href="/dashboard" className="text-muted hover:text-foreground transition-colors">
                <IconHome className="w-4 h-4" />
              </Link>
              {breadcrumbs.map((crumb) => (
                <span key={crumb.href} className="flex items-center gap-1.5">
                  <IconChevronRight className="w-3.5 h-3.5 text-muted/50" />
                  {crumb.isLast ? (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="text-muted hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Search bar */}
            <button className="hidden md:flex items-center gap-3 h-9 px-4 rounded-lg border border-border bg-surface-elevated text-sm text-muted hover:border-primary/30 hover:text-foreground transition-colors min-w-[220px]">
              <IconSearch className="w-4 h-4" />
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-muted">
                <span className="text-xs">&#8984;</span>K
              </kbd>
            </button>

            {/* Mobile search */}
            <button className="md:hidden p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <IconSearch className="w-5 h-5 text-muted" />
            </button>

            {/* Notification bell */}
            <button className="relative p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <IconBell className="w-5 h-5 text-muted" />
              <span className="absolute top-1 right-1 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-surface" style={{ width: '18px', height: '18px' }}>
                3
              </span>
            </button>

            {/* Quick actions */}
            <button className="hidden sm:flex items-center gap-2 h-9 px-3 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors shadow-sm">
              <IconPlus className="w-4 h-4" />
              <span>Quick Action</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
