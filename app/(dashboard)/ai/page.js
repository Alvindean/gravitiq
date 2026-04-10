'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const chatHistory = [
  { id: 1, title: 'Q1 Revenue Analysis', time: '2 hours ago' },
  { id: 2, title: 'Client Onboarding Email', time: '5 hours ago' },
  { id: 3, title: 'Marketing Strategy Draft', time: 'Yesterday' },
  { id: 4, title: 'Competitive Landscape Brief', time: 'Yesterday' },
  { id: 5, title: 'Product Roadmap Summary', time: '2 days ago' },
  { id: 6, title: 'Team Standup Notes', time: '3 days ago' },
  { id: 7, title: 'Invoice Follow-up Template', time: '4 days ago' },
  { id: 8, title: 'Quarterly Board Deck Outline', time: '1 week ago' },
];

const suggestions = [
  {
    title: 'Draft a client proposal',
    desc: 'Create a professional proposal for a new client engagement',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
  {
    title: 'Analyze last month\'s revenue',
    desc: 'Break down revenue streams and identify growth trends',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
  },
  {
    title: 'Generate a project status report',
    desc: 'Summarize progress, blockers, and next steps',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
  {
    title: 'Write a follow-up email',
    desc: 'Craft a polished follow-up after a meeting or pitch',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
      </svg>
    ),
  },
];

const mockConversation = [
  {
    role: 'user',
    content: 'Generate a summary of Q1 performance',
  },
  {
    role: 'ai',
    content: `Here's your **Q1 2026 Performance Summary**:

**Revenue & Growth**
- Total revenue: **$2.4M** (up 18% from Q4 2025)
- MRR reached **$812K**, a new company high
- Net revenue retention: **114%**

**Client Metrics**
- 34 new clients acquired (vs. 28 in Q4)
- Client churn decreased to **2.1%** from 3.8%
- Average deal size increased to **$24,500**

**Operational Highlights**
- Launched 3 major product features on schedule
- Team expanded by 12 members across engineering and sales
- Customer satisfaction (CSAT) score: **4.7/5.0**

**Areas for Improvement**
- Sales cycle length increased by 4 days on average
- Support ticket volume up 22% -- consider expanding support team
- Marketing spend efficiency dropped slightly (CAC up 8%)

Overall, Q1 was a strong quarter with significant growth in revenue and client acquisition. The main focus for Q2 should be optimizing the sales cycle and scaling support operations.`,
  },
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function formatAIMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    // Bold headers
    if (line.startsWith('**') && line.endsWith('**')) {
      return (
        <p key={i} className="font-semibold text-foreground mt-3 mb-1">
          {line.replace(/\*\*/g, '')}
        </p>
      );
    }
    // Bullet points with bold
    if (line.startsWith('- ')) {
      const parts = line.slice(2);
      const formatted = parts.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j} className="text-foreground">{part.replace(/\*\*/g, '')}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <li key={i} className="ml-4 list-disc text-muted mb-0.5">
          {formatted}
        </li>
      );
    }
    if (line.trim() === '') return <br key={i} />;
    // Regular text with bold
    const formatted = line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-foreground">{part.replace(/\*\*/g, '')}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    return <p key={i} className="text-muted mb-1">{formatted}</p>;
  });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(mockConversation);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('Gravitiq AI');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [activeChat, setActiveChat] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'I\'ve processed your request. Based on the data available, here are the key insights I\'ve gathered. Let me know if you\'d like me to go deeper on any specific area or adjust the format of this response.',
        },
      ]);
    }, 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setActiveChat(null);
  };

  const handleSuggestion = (text) => {
    setShowWelcome(false);
    const userMsg = { role: 'user', content: text };
    setMessages([userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content:
            'I\'d be happy to help with that. Let me pull together the relevant information and draft something for you. Here\'s what I\'ve prepared based on your request -- let me know if you\'d like any adjustments.',
        },
      ]);
    }, 2000);
  };

  const showWelcomeState = showWelcome || messages.length === 0;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-72' : 'w-0'
        } transition-all duration-300 overflow-hidden border-r border-border bg-surface flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-border">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white font-medium text-sm hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2">
          <p className="px-2 py-1.5 text-xs font-medium text-muted uppercase tracking-wider">Recent</p>
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-colors ${
                activeChat === chat.id
                  ? 'bg-primary-light text-foreground'
                  : 'text-muted hover:bg-surface-elevated hover:text-foreground'
              }`}
              onClick={() => {
                setActiveChat(chat.id);
                setShowWelcome(false);
                if (chat.id === 1) {
                  setMessages(mockConversation);
                } else {
                  setMessages([]);
                  setShowWelcome(true);
                }
              }}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{chat.title}</p>
                <p className="text-xs text-muted mt-0.5">{chat.time}</p>
              </div>
              {hoveredChat === chat.id && (
                <div className="flex items-center gap-0.5 ml-2">
                  <button className="p-1 rounded hover:bg-border transition-colors cursor-pointer" title="Rename">
                    <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                    </svg>
                  </button>
                  <button className="p-1 rounded hover:bg-border transition-colors cursor-pointer" title="Delete">
                    <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border space-y-1">
          <Link
            href="/ai/templates"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
            Templates
          </Link>
          <Link
            href="/ai/history"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            History
          </Link>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                {activeChat ? chatHistory.find((c) => c.id === activeChat)?.title || 'AI Assistant' : 'AI Assistant'}
              </h1>
              <p className="text-xs text-muted">Powered by {selectedModel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="text-xs bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option>Gravitiq AI</option>
              <option>GPT-4o</option>
              <option>Claude 3.5</option>
            </select>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {showWelcomeState ? (
            /* Welcome State */
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">How can I help you today?</h2>
              <p className="text-muted mb-8 text-center max-w-md">
                I can help you draft documents, analyze data, generate reports, and much more.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(s.title)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/30 transition-all text-left group cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors shrink-0">
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{s.title}</p>
                      <p className="text-xs text-muted mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Message Thread */
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg, i) => (
                <div key={i} className="flex gap-3">
                  {/* Avatar */}
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted mb-1">
                      {msg.role === 'user' ? 'You' : 'Gravitiq AI'}
                    </p>
                    <div className="text-sm leading-relaxed">
                      {msg.role === 'ai' ? (
                        <div className="prose-sm">{formatAIMessage(msg.content)}</div>
                      ) : (
                        <p className="text-foreground">{msg.content}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted mb-1">Gravitiq AI</p>
                    <TypingIndicator />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-surface px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-surface-elevated border border-border rounded-xl p-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              {/* Attachment */}
              <button className="p-2 rounded-lg hover:bg-border text-muted hover:text-foreground transition-colors shrink-0 cursor-pointer">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                </svg>
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder="Message Gravitiq AI..."
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted resize-none focus:outline-none max-h-40 py-2"
              />

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className={`p-2 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  input.trim()
                    ? 'bg-primary text-white hover:bg-primary-hover'
                    : 'bg-border text-muted cursor-not-allowed'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="text-center text-xs text-muted mt-2">
              AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
