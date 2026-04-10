'use client';

// ============================================================
// Gravitiq — React Hooks for API-backed data
// ============================================================

import { useState, useEffect, useCallback } from 'react';

// ── Helper ──────────────────────────────────────────────────

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function parseResponse(json) {
  return json.data !== undefined ? json.data : json;
}

// localStorage mirror — keeps a client-side cache so Vercel deployments
// (where the JSON file DB is read-only) still persist across page reloads.
function lsGet(key) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('gq_' + key);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function lsSet(key, data) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('gq_' + key, JSON.stringify(data)); } catch {}
}

// Fetches from API first; if API returns seed data (no server-side writes),
// overlay with any localStorage edits the user made on Vercel.
async function fetchWithFallback(url, key, fallback) {
  try {
    const res = await fetch(url);
    const json = await res.json();
    const apiData = parseResponse(json);
    // Cache what we got from the API
    const localData = lsGet(key);
    if (localData && Array.isArray(localData) && localData.length > 0) {
      // If local has more items than API seed, user made changes on Vercel
      if (Array.isArray(apiData) && localData.length !== apiData.length) {
        return localData;
      }
    }
    lsSet(key, apiData);
    return apiData;
  } catch {
    // API unreachable — use localStorage
    const local = lsGet(key);
    return local !== null ? local : fallback;
  }
}

// ── Entity Hooks ─────────────────────────────────────────────

// 1. Clients
export function useClients() {
  const [clients, setClients] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/clients', 'clients', []).then((data) => {
      setClients(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('clients', clients); }, [clients, loaded]);

  const addClient = useCallback(async (client) => {
    const optimistic = { ...client, id: 'c' + Date.now() };
    setClients((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(client),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setClients((prev) => prev.map((c) => (c.id === optimistic.id ? json.data : c)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateClient = useCallback(async (id, updates) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setClients((prev) => prev.map((c) => (c.id === id ? json.data : c)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteClient = useCallback(async (id) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { clients, addClient, updateClient, deleteClient, loaded };
}

// 2. Projects
export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/projects', 'projects', []).then((data) => {
      setProjects(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('projects', projects); }, [projects, loaded]);

  const addProject = useCallback(async (project) => {
    const optimistic = { ...project, id: 'p' + Date.now() };
    setProjects((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(project),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects((prev) => prev.map((p) => (p.id === optimistic.id ? json.data : p)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateProject = useCallback(async (id, updates) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProjects((prev) => prev.map((p) => (p.id === id ? json.data : p)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteProject = useCallback(async (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch('/api/projects', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { projects, addProject, updateProject, deleteProject, loaded };
}

// 3. Conversations
export function useConversations() {
  const [conversations, setConversations] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/conversations', 'conversations', []).then((data) => {
      setConversations(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('conversations', conversations); }, [conversations, loaded]);

  const addConversation = useCallback(async (conversation) => {
    const optimistic = { ...conversation, id: 'conv' + Date.now(), messages: [] };
    setConversations((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(conversation),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setConversations((prev) => prev.map((c) => (c.id === optimistic.id ? json.data : c)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const addMessage = useCallback(async (conversationId, text, sender) => {
    const optimisticMsg = { id: 'm' + Date.now(), text, sender, timestamp: new Date().toISOString() };
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...(conv.messages || []), optimisticMsg] }
          : conv,
      ),
    );
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ conversationId, text, sender }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateConversation = useCallback(async (id, updates) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, ...updates } : conv)),
    );
    try {
      const res = await fetch('/api/conversations', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteConversation = useCallback(async (id) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    try {
      await fetch('/api/conversations', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { conversations, addConversation, addMessage, updateConversation, deleteConversation, loaded };
}

// 4. AI Chats
export function useAiChats() {
  const [chats, setChats] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/ai/chat', 'ai-chats', []).then((data) => {
      setChats(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('ai-chats', chats); }, [chats, loaded]);

  const addChat = useCallback(async (chat) => {
    const optimistic = {
      ...chat,
      id: 'ai' + Date.now(),
      createdAt: new Date().toISOString(),
      messages: chat.messages || [],
    };
    setChats((prev) => [optimistic, ...prev]);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ action: 'create', title: chat.title, model: chat.model }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setChats((prev) => prev.map((c) => (c.id === optimistic.id ? json.data : c)));
      }
      return json.data || optimistic;
    } catch {
      return optimistic;
    }
  }, []);

  const addMessage = useCallback(async (chatId, message, model) => {
    // Add user message optimistically
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, messages: [...(chat.messages || []), message] } : chat,
      ),
    );
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ action: 'message', chatId, message, model }),
      });
      const json = await res.json();
      // If response contains an AI reply, add it to state
      if (json.data && json.data.reply) {
        setChats((prev) =>
          prev.map((chat) =>
            chat.id === chatId
              ? { ...chat, messages: [...(chat.messages || []), json.data.reply] }
              : chat,
          ),
        );
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateChat = useCallback(async (id, updates) => {
    setChats((prev) => prev.map((chat) => (chat.id === id ? { ...chat, ...updates } : chat)));
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ action: 'rename', chatId: id, title: updates.title }),
      });
      const json = await res.json();
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteChat = useCallback(async (id) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
    try {
      await fetch('/api/ai/chat', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify({ action: 'delete', chatId: id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { chats, addChat, addMessage, updateChat, deleteChat, loaded };
}

// 5. Invoices
export function useInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/invoices', 'invoices', []).then((data) => {
      setInvoices(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('invoices', invoices); }, [invoices, loaded]);

  const addInvoice = useCallback(async (invoice) => {
    const optimistic = { ...invoice, id: 'inv' + Date.now() };
    setInvoices((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(invoice),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInvoices((prev) => prev.map((inv) => (inv.id === optimistic.id ? json.data : inv)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateInvoice = useCallback(async (id, updates) => {
    setInvoices((prev) => prev.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv)));
    try {
      const res = await fetch('/api/invoices', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInvoices((prev) => prev.map((inv) => (inv.id === id ? json.data : inv)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const deleteInvoice = useCallback(async (id) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
    try {
      await fetch('/api/invoices', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { invoices, addInvoice, updateInvoice, deleteInvoice, loaded };
}

// 6. Team
export function useTeam() {
  const [team, setTeam] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/team', 'team', []).then((data) => {
      setTeam(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('team', team); }, [team, loaded]);

  const addMember = useCallback(async (member) => {
    const optimistic = { ...member, id: 't' + Date.now() };
    setTeam((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(member),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTeam((prev) => prev.map((m) => (m.id === optimistic.id ? json.data : m)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateMember = useCallback(async (id, updates) => {
    setTeam((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    try {
      const res = await fetch('/api/team', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTeam((prev) => prev.map((m) => (m.id === id ? json.data : m)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const removeMember = useCallback(async (id) => {
    setTeam((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch('/api/team', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { team, addMember, updateMember, removeMember, loaded };
}

// 7. Activities
export function useActivities() {
  const [activities, setActivities] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/activities', 'activities', []).then((data) => {
      setActivities(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('activities', activities); }, [activities, loaded]);

  const addActivity = useCallback(async (activity) => {
    const optimistic = { ...activity, id: 'act' + Date.now(), timestamp: new Date().toISOString() };
    setActivities((prev) => [optimistic, ...prev]);
    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(activity),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setActivities((prev) => prev.map((a) => (a.id === optimistic.id ? json.data : a)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return { activities, addActivity, loaded };
}

// 8. Tasks
export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/tasks', 'tasks', []).then((data) => {
      setTasks(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('tasks', tasks); }, [tasks, loaded]);

  const addTask = useCallback(async (task) => {
    const optimistic = { ...task, id: 'task' + Date.now(), completed: false };
    setTasks((prev) => [...prev, optimistic]);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(task),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTasks((prev) => prev.map((t) => (t.id === optimistic.id ? json.data : t)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const updateTask = useCallback(async (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    try {
      const res = await fetch('/api/tasks', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, ...updates }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setTasks((prev) => prev.map((t) => (t.id === id ? json.data : t)));
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const toggleTask = useCallback(async (id) => {
    let newCompleted;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          newCompleted = !t.completed;
          return { ...t, completed: newCompleted };
        }
        return t;
      }),
    );
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id, completed: newCompleted }),
      });
    } catch {
      // optimistic toggle already applied
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch('/api/tasks', {
        method: 'DELETE',
        headers: JSON_HEADERS,
        body: JSON.stringify({ id }),
      });
    } catch {
      // optimistic delete already applied
    }
  }, []);

  return { tasks, addTask, updateTask, toggleTask, deleteTask, loaded };
}

// 9. Revenue (read-only)
export function useRevenue() {
  const [revenue, setRevenue] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/revenue', 'revenue', []).then((data) => {
      setRevenue(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('revenue', revenue); }, [revenue, loaded]);

  return { revenue, loaded };
}

// 10. Profile
export function useProfile() {
  const [profile, setProfile] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/settings/profile', 'profile', {}).then((data) => {
      setProfile(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('profile', profile); }, [profile, loaded]);

  const updateProfile = useCallback(async (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setProfile(json.data);
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  return { profile, updateProfile, loaded };
}

// 11. Notification Preferences
export function useNotifications() {
  const [notifications, setNotifications] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWithFallback('/api/settings/notifications', 'notifications', {}).then((data) => {
      setNotifications(data);
      setLoaded(true);
    });
  }, []);

  // Mirror to localStorage on every change
  useEffect(() => { if (loaded) lsSet('notifications', notifications); }, [notifications, loaded]);

  const updateNotifications = useCallback(async (updates) => {
    setNotifications((prev) => ({ ...prev, ...updates }));
    try {
      const res = await fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setNotifications(json.data);
      }
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const toggleEmailPref = useCallback(async (key) => {
    setNotifications((prev) => {
      const updated = {
        ...prev,
        email: { ...prev.email, [key]: !prev.email?.[key] },
      };
      // Fire and forget the API call
      fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(updated),
      }).catch(() => {});
      return updated;
    });
  }, []);

  const togglePushPref = useCallback(async (key) => {
    setNotifications((prev) => {
      const updated = {
        ...prev,
        push: { ...prev.push, [key]: !prev.push?.[key] },
      };
      // Fire and forget the API call
      fetch('/api/settings/notifications', {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify(updated),
      }).catch(() => {});
      return updated;
    });
  }, []);

  return { notifications, updateNotifications, toggleEmailPref, togglePushPref, loaded };
}
