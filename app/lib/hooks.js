'use client';

// ============================================================
// Gravitiq — React Hooks for localStorage-backed data
// ============================================================

import { useState, useEffect, useCallback } from 'react';
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

// ── Core Hook ────────────────────────────────────────────────

/**
 * Generic hook that syncs React state with a namespaced localStorage key.
 * - `key`      — stored under "gravitiq_<key>"
 * - `seedData` — default value used for SSR and if nothing is stored yet
 *
 * Returns [data, save, loaded]
 */
function useLocalStorage(key, seedData) {
  const [data, setData] = useState(seedData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gravitiq_' + key);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        localStorage.setItem('gravitiq_' + key, JSON.stringify(seedData));
      }
    } catch {
      // localStorage unavailable — keep seed data
    }
    setLoaded(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(
    (newData) => {
      const resolved = typeof newData === 'function' ? newData(data) : newData;
      setData(resolved);
      try {
        localStorage.setItem('gravitiq_' + key, JSON.stringify(resolved));
      } catch {
        // storage full or unavailable
      }
    },
    [key, data],
  );

  return [data, save, loaded];
}

// ── Entity Hooks ─────────────────────────────────────────────

// Clients
export function useClients() {
  const [clients, setClients, loaded] = useLocalStorage('clients', seedClients);

  const addClient = useCallback(
    (client) => setClients([...clients, { ...client, id: 'c' + Date.now() }]),
    [clients, setClients],
  );

  const updateClient = useCallback(
    (id, updates) => setClients(clients.map((c) => (c.id === id ? { ...c, ...updates } : c))),
    [clients, setClients],
  );

  const deleteClient = useCallback(
    (id) => setClients(clients.filter((c) => c.id !== id)),
    [clients, setClients],
  );

  return { clients, addClient, updateClient, deleteClient, loaded };
}

// Projects
export function useProjects() {
  const [projects, setProjects, loaded] = useLocalStorage('projects', seedProjects);

  const addProject = useCallback(
    (project) => setProjects([...projects, { ...project, id: 'p' + Date.now() }]),
    [projects, setProjects],
  );

  const updateProject = useCallback(
    (id, updates) => setProjects(projects.map((p) => (p.id === id ? { ...p, ...updates } : p))),
    [projects, setProjects],
  );

  const deleteProject = useCallback(
    (id) => setProjects(projects.filter((p) => p.id !== id)),
    [projects, setProjects],
  );

  return { projects, addProject, updateProject, deleteProject, loaded };
}

// Conversations
export function useConversations() {
  const [conversations, setConversations, loaded] = useLocalStorage('conversations', seedConversations);

  const addConversation = useCallback(
    (conversation) =>
      setConversations([...conversations, { ...conversation, id: 'conv' + Date.now(), messages: [] }]),
    [conversations, setConversations],
  );

  const addMessage = useCallback(
    (conversationId, message) =>
      setConversations(
        conversations.map((conv) =>
          conv.id === conversationId
            ? { ...conv, messages: [...conv.messages, { ...message, id: 'm' + Date.now() }] }
            : conv,
        ),
      ),
    [conversations, setConversations],
  );

  const updateConversation = useCallback(
    (id, updates) =>
      setConversations(conversations.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv))),
    [conversations, setConversations],
  );

  const deleteConversation = useCallback(
    (id) => setConversations(conversations.filter((conv) => conv.id !== id)),
    [conversations, setConversations],
  );

  return { conversations, addConversation, addMessage, updateConversation, deleteConversation, loaded };
}

// AI Chats
export function useAiChats() {
  const [chats, setChats, loaded] = useLocalStorage('ai_chats', seedAiChats);

  const addChat = useCallback(
    (chat) =>
      setChats([
        { ...chat, id: 'ai' + Date.now(), createdAt: new Date().toISOString(), messages: chat.messages || [] },
        ...chats,
      ]),
    [chats, setChats],
  );

  const addMessage = useCallback(
    (chatId, message) =>
      setChats(
        chats.map((chat) =>
          chat.id === chatId ? { ...chat, messages: [...chat.messages, message] } : chat,
        ),
      ),
    [chats, setChats],
  );

  const updateChat = useCallback(
    (id, updates) => setChats(chats.map((chat) => (chat.id === id ? { ...chat, ...updates } : chat))),
    [chats, setChats],
  );

  const deleteChat = useCallback(
    (id) => setChats(chats.filter((chat) => chat.id !== id)),
    [chats, setChats],
  );

  return { chats, addChat, addMessage, updateChat, deleteChat, loaded };
}

// Invoices
export function useInvoices() {
  const [invoices, setInvoices, loaded] = useLocalStorage('invoices', seedInvoices);

  const addInvoice = useCallback(
    (invoice) => setInvoices([...invoices, { ...invoice, id: 'inv' + Date.now() }]),
    [invoices, setInvoices],
  );

  const updateInvoice = useCallback(
    (id, updates) => setInvoices(invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv))),
    [invoices, setInvoices],
  );

  const deleteInvoice = useCallback(
    (id) => setInvoices(invoices.filter((inv) => inv.id !== id)),
    [invoices, setInvoices],
  );

  return { invoices, addInvoice, updateInvoice, deleteInvoice, loaded };
}

// Team
export function useTeam() {
  const [team, setTeam, loaded] = useLocalStorage('team', seedTeam);

  const addMember = useCallback(
    (member) => setTeam([...team, { ...member, id: 't' + Date.now() }]),
    [team, setTeam],
  );

  const updateMember = useCallback(
    (id, updates) => setTeam(team.map((m) => (m.id === id ? { ...m, ...updates } : m))),
    [team, setTeam],
  );

  const deleteMember = useCallback(
    (id) => setTeam(team.filter((m) => m.id !== id)),
    [team, setTeam],
  );

  return { team, addMember, updateMember, deleteMember, loaded };
}

// Activities
export function useActivities() {
  const [activities, setActivities, loaded] = useLocalStorage('activities', seedActivities);

  const addActivity = useCallback(
    (activity) =>
      setActivities([
        { ...activity, id: 'act' + Date.now(), timestamp: new Date().toISOString() },
        ...activities,
      ]),
    [activities, setActivities],
  );

  return { activities, addActivity, loaded };
}

// Tasks
export function useTasks() {
  const [tasks, setTasks, loaded] = useLocalStorage('tasks', seedTasks);

  const addTask = useCallback(
    (task) => setTasks([...tasks, { ...task, id: 'task' + Date.now(), completed: false }]),
    [tasks, setTasks],
  );

  const updateTask = useCallback(
    (id, updates) => setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t))),
    [tasks, setTasks],
  );

  const toggleTask = useCallback(
    (id) => setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))),
    [tasks, setTasks],
  );

  const deleteTask = useCallback(
    (id) => setTasks(tasks.filter((t) => t.id !== id)),
    [tasks, setTasks],
  );

  return { tasks, addTask, updateTask, toggleTask, deleteTask, loaded };
}

// Revenue (read-only with optional override)
export function useRevenue() {
  const [revenue, setRevenue, loaded] = useLocalStorage('revenue', seedRevenue);
  return { revenue, setRevenue, loaded };
}

// Profile
export function useProfile() {
  const [profile, setProfile, loaded] = useLocalStorage('profile', seedProfile);

  const updateProfile = useCallback(
    (updates) => setProfile({ ...profile, ...updates }),
    [profile, setProfile],
  );

  return { profile, updateProfile, loaded };
}

// Notification Preferences
export function useNotifications() {
  const [notifications, setNotifications, loaded] = useLocalStorage('notifications', seedNotifications);

  const updateNotifications = useCallback(
    (updates) => setNotifications({ ...notifications, ...updates }),
    [notifications, setNotifications],
  );

  const toggleEmailPref = useCallback(
    (key) =>
      setNotifications({
        ...notifications,
        email: { ...notifications.email, [key]: !notifications.email[key] },
      }),
    [notifications, setNotifications],
  );

  const togglePushPref = useCallback(
    (key) =>
      setNotifications({
        ...notifications,
        push: { ...notifications.push, [key]: !notifications.push[key] },
      }),
    [notifications, setNotifications],
  );

  return { notifications, updateNotifications, toggleEmailPref, togglePushPref, loaded };
}
