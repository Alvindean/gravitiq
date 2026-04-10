'use client';

import { useState } from 'react';

const conversations = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    company: 'TechFlow Inc',
    color: '#4f46e5',
    lastMessage: 'Sounds great! I will review the mockups tonight.',
    time: '2m ago',
    unread: 2,
    online: true,
    messages: [
      { id: 1, sender: 'them', text: 'Hi! Just wanted to check in on the website redesign project.', time: '10:15 AM' },
      { id: 2, sender: 'me', text: 'Hey Sarah! Everything is on track. We finished the homepage mockups yesterday.', time: '10:18 AM' },
      { id: 3, sender: 'them', text: 'That is amazing! Can you share them with me?', time: '10:20 AM' },
      { id: 4, sender: 'me', text: 'Of course! I just uploaded them to the shared drive. You should have access now.', time: '10:22 AM' },
      { id: 5, sender: 'me', text: 'Let me know if you have any feedback or changes you would like to see.', time: '10:22 AM' },
      { id: 6, sender: 'them', text: 'Sounds great! I will review the mockups tonight.', time: '10:25 AM' },
    ],
  },
  {
    id: 2,
    name: 'James Rodriguez',
    company: 'BrightPath Labs',
    color: '#06b6d4',
    lastMessage: 'Can we schedule a call for tomorrow?',
    time: '1h ago',
    unread: 0,
    online: true,
    messages: [
      { id: 1, sender: 'them', text: 'Hey, I have some updates on the payment integration requirements.', time: '9:00 AM' },
      { id: 2, sender: 'me', text: 'Sure, I would love to hear about them. What has changed?', time: '9:05 AM' },
      { id: 3, sender: 'them', text: 'We need to add support for recurring subscriptions. Can we schedule a call for tomorrow?', time: '9:10 AM' },
    ],
  },
  {
    id: 3,
    name: 'Emily Chen',
    company: 'Quantum Dynamics',
    color: '#8b5cf6',
    lastMessage: 'The brand package looks incredible!',
    time: '3h ago',
    unread: 1,
    online: false,
    messages: [
      { id: 1, sender: 'me', text: 'Hi Emily, the brand identity package is ready for your review.', time: '7:30 AM' },
      { id: 2, sender: 'them', text: 'The brand package looks incredible!', time: '7:45 AM' },
    ],
  },
  {
    id: 4,
    name: 'Olivia Parker',
    company: 'Nova Creative',
    color: '#ec4899',
    lastMessage: 'Perfect, see you at the presentation!',
    time: '5h ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'them', text: 'Quick question about the mobile app timeline.', time: 'Yesterday' },
      { id: 2, sender: 'me', text: 'We are aiming for a beta release by May 10th. The core features are about 40% complete.', time: 'Yesterday' },
      { id: 3, sender: 'them', text: 'That works for us. Can we do a demo next week?', time: 'Yesterday' },
      { id: 4, sender: 'me', text: 'Absolutely! How about Wednesday at 2 PM?', time: 'Yesterday' },
      { id: 5, sender: 'them', text: 'Perfect, see you at the presentation!', time: 'Yesterday' },
    ],
  },
  {
    id: 5,
    name: 'Daniel Kim',
    company: 'Stellar Systems',
    color: '#10b981',
    lastMessage: 'I will send over the requirements doc shortly.',
    time: '1d ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'me', text: 'Welcome aboard Daniel! Excited to work with Stellar Systems.', time: 'Apr 8' },
      { id: 2, sender: 'them', text: 'Thanks! We are excited too. We have a big project in mind.', time: 'Apr 8' },
      { id: 3, sender: 'me', text: 'Great to hear! Feel free to share any initial docs or briefs you have.', time: 'Apr 8' },
      { id: 4, sender: 'them', text: 'I will send over the requirements doc shortly.', time: 'Apr 8' },
    ],
  },
  {
    id: 6,
    name: 'Rachel Foster',
    company: 'Luminary Design',
    color: '#f97316',
    lastMessage: 'The SEO results are looking promising!',
    time: '2d ago',
    unread: 0,
    online: false,
    messages: [
      { id: 1, sender: 'them', text: 'Just saw the latest analytics report. Great improvements!', time: 'Apr 7' },
      { id: 2, sender: 'me', text: 'Thanks Rachel! The organic traffic is up 32% this month.', time: 'Apr 7' },
      { id: 3, sender: 'them', text: 'The SEO results are looking promising!', time: 'Apr 7' },
    ],
  },
];

function Avatar({ name, color, size = 'md', online }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold`} style={{ backgroundColor: color }}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-surface ${online ? 'bg-emerald-500' : 'bg-gray-400'}`} />
      )}
    </div>
  );
}

export default function MessagesPage() {
  const [selectedId, setSelectedId] = useState(conversations[0].id);
  const [messageInput, setMessageInput] = useState('');
  const [search, setSearch] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [localConversations, setLocalConversations] = useState(conversations);

  const selected = localConversations.find(c => c.id === selectedId);

  const filteredConversations = localConversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = () => {
    if (!messageInput.trim()) return;
    const newMsg = { id: Date.now(), sender: 'me', text: messageInput, time: 'Just now' };
    setLocalConversations(prev => prev.map(c =>
      c.id === selectedId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: messageInput, time: 'Just now' }
        : c
    ));
    setMessageInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectConversation = (id) => {
    setSelectedId(id);
    setMobileShowChat(true);
    setLocalConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

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
                      <span className="text-[11px] text-muted shrink-0 ml-2">{convo.time}</span>
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">{convo.company}</p>
                    <p className="text-xs text-muted truncate mt-1">{convo.lastMessage}</p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center mt-1">
                      {convo.unread}
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
                  {selected.messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-1' : 'order-1'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender === 'me'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-surface-elevated text-foreground rounded-bl-md'
                        }`}>
                          {msg.text}
                        </div>
                        <p className={`text-[10px] text-muted mt-1 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>{msg.time}</p>
                      </div>
                    </div>
                  ))}
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
