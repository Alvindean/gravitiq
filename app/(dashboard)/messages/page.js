'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useConversations } from '@/app/lib/hooks';

function Avatar({ name, color, size = 'md', online }) {
  const initials = (name || '').split(' ').map(n => n[0]).join('');
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold`} style={{ backgroundColor: color || '#6366f1' }}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      )}
    </div>
  );
}

function formatMessageTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatChatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-32 bg-surface-elevated rounded animate-pulse mb-6" />
        <div className="bg-surface border border-border rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
          <div className="w-80 border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <div className="h-10 bg-surface-elevated rounded-lg animate-pulse" />
            </div>
            <div className="flex-1 p-2 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 px-4 py-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-surface-elevated" />
                  <div className="flex-1">
                    <div className="h-4 w-24 bg-surface-elevated rounded mb-2" />
                    <div className="h-3 w-32 bg-surface-elevated rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="h-8 w-48 bg-surface-elevated rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

const mockReplies = [
  "Thanks for the update! I'll review that shortly.",
  "Sounds great, let me get back to you on that.",
  "Perfect, that works for me!",
  "I appreciate you letting me know. We'll discuss further.",
  "Got it! I'll take a look and follow up tomorrow.",
  "That's exactly what I was thinking. Let's move forward.",
  "Wonderful, thanks for the quick turnaround!",
  "Let me check with the team and circle back.",
];

export default function MessagesPage() {
  const { conversations, addMessage, loaded } = useConversations();
  const [selectedId, setSelectedId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [localUnread, setLocalUnread] = useState({});
  const messagesEndRef = useRef(null);
  const initializedUnread = useRef(false);

  // Initialize unread counts from conversation data
  useEffect(() => {
    if (loaded && conversations && !initializedUnread.current) {
      const unreadMap = {};
      conversations.forEach(c => {
        if (c.unread && c.unread > 0) {
          unreadMap[c.id] = c.unread;
        }
      });
      setLocalUnread(unreadMap);
      initializedUnread.current = true;
    }
  }, [loaded, conversations]);

  // Auto-select first conversation
  useEffect(() => {
    if (loaded && conversations && conversations.length > 0 && !selectedId) {
      setSelectedId(conversations[0].id);
    }
  }, [loaded, conversations, selectedId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, selectedId]);

  const selected = (conversations || []).find(c => c.id === selectedId);

  const filteredConversations = (conversations || []).filter(c =>
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.company || '').toLowerCase().includes(search.toLowerCase())
  );

  const getLastMessage = (convo) => {
    if (convo.lastMessage) return convo.lastMessage;
    if (convo.messages && convo.messages.length > 0) {
      return convo.messages[convo.messages.length - 1].text;
    }
    return '';
  };

  const getLastTime = (convo) => {
    if (convo.messages && convo.messages.length > 0) {
      const lastMsg = convo.messages[convo.messages.length - 1];
      if (lastMsg.timestamp) return formatMessageTime(lastMsg.timestamp);
      if (lastMsg.time) return lastMsg.time;
    }
    if (convo.time) return convo.time;
    return '';
  };

  const handleSend = useCallback(() => {
    if (!messageInput.trim() || !selectedId) return;
    const text = messageInput.trim();
    setMessageInput('');

    // Send user message
    addMessage(selectedId, text, 'user');

    // Auto-generate mock reply after 1 second
    setTimeout(() => {
      const reply = mockReplies[Math.floor(Math.random() * mockReplies.length)];
      addMessage(selectedId, reply, 'client');
    }, 1000);
  }, [messageInput, selectedId, addMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = (id) => {
    setSelectedId(id);
    setMobileShowChat(true);
    // Clear unread for this conversation
    setLocalUnread(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  if (!loaded) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-6">Messages</h1>

        <div className="bg-surface border border-border rounded-xl overflow-hidden flex" style={{ height: 'calc(100vh - 180px)', minHeight: '500px' }}>
          {/* Left panel - Conversation list */}
          <div className={`w-full md:w-80 lg:w-96 border-r border-border flex flex-col shrink-0 ${mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" /></svg>
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 && (
                <div className="p-4 text-center text-sm text-muted">No conversations found</div>
              )}
              {filteredConversations.map(convo => (
                <button
                  key={convo.id}
                  onClick={() => selectConversation(convo.id)}
                  className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-surface-elevated transition-colors ${
                    selectedId === convo.id ? 'bg-primary-light' : ''
                  }`}
                >
                  <Avatar name={convo.name} color={convo.color} online={convo.online} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-foreground text-sm truncate">{convo.name}</p>
                      <span className="text-[11px] text-muted shrink-0 ml-2">{getLastTime(convo)}</span>
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">{convo.company}</p>
                    <p className="text-xs text-muted truncate mt-1">{getLastMessage(convo)}</p>
                  </div>
                  {(localUnread[convo.id] || 0) > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mt-1">
                      {localUnread[convo.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right panel - Chat view */}
          <div className={`flex-1 flex flex-col ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
            {selected ? (
              <>
                {/* Chat header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden text-muted hover:text-foreground"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  <Avatar name={selected.name} color={selected.color} size="md" online={selected.online} />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm">{selected.name}</p>
                    <p className="text-xs text-muted">{selected.company} {selected.online ? '- Online' : ''}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </button>
                    <button className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
                  </div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                  {(selected.messages || []).map((msg, idx) => {
                    const isMe = msg.sender === 'me' || msg.sender === 'user';
                    return (
                      <div key={msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className="max-w-[75%]">
                          <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-surface-elevated text-foreground rounded-bl-md'
                          }`}>
                            {msg.text}
                          </div>
                          <p className={`text-[10px] text-muted mt-1 ${isMe ? 'text-right' : 'text-left'}`}>
                            {msg.timestamp ? formatChatTime(msg.timestamp) : msg.time || ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <div className="border-t border-border p-4">
                  <div className="flex items-end gap-2">
                    <button className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    </button>
                    <button className="p-2 text-muted hover:text-foreground hover:bg-surface-elevated rounded-lg transition-colors shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={e => setMessageInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-foreground text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 text-muted mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                  <p className="text-muted font-medium">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
