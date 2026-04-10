// ============================================================
// Gravitiq — localStorage Store Utilities
// Plain JS module (no 'use client' needed).
// ============================================================

import {
  seedClients,
  seedProjects,
  seedConversations,
  seedAiChats,
  seedInvoices,
  seedTeam,
  seedActivities,
  seedTasks,
  seedRevenue,
  seedProfile,
  seedNotifications,
} from './seed-data';

// ── Generic Helpers ──────────────────────────────────────────

/**
 * Read a value from localStorage, JSON-parsed.
 * Returns `defaultValue` if the key does not exist or parsing fails.
 */
export function getItem(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

/**
 * Write a value to localStorage as JSON.
 */
export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Gravitiq store: failed to write to localStorage', e);
  }
}

// ── Seed Initialization ─────────────────────────────────────

/**
 * Seed all entities into localStorage on first visit.
 * Checks for a `gravitiq_initialized` flag so seeding only happens once.
 */
export function initializeStore() {
  if (getItem('gravitiq_initialized', false)) return;

  const seeds = {
    gravitiq_clients: seedClients,
    gravitiq_projects: seedProjects,
    gravitiq_conversations: seedConversations,
    gravitiq_ai_chats: seedAiChats,
    gravitiq_invoices: seedInvoices,
    gravitiq_team: seedTeam,
    gravitiq_activities: seedActivities,
    gravitiq_tasks: seedTasks,
    gravitiq_revenue: seedRevenue,
    gravitiq_profile: seedProfile,
    gravitiq_notifications: seedNotifications,
  };

  for (const [key, data] of Object.entries(seeds)) {
    setItem(key, data);
  }

  setItem('gravitiq_initialized', true);
}
