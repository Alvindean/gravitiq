'use client';

import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAiChats } from '@/app/lib/hooks';

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

const templatePrompts = {
  '1': 'Draft a client proposal for [Client Name] regarding [Project Description]. Include scope of work, timeline, deliverables, and pricing.',
  '2': 'Generate a monthly performance report for [Month/Year]. Include revenue metrics, client acquisition, project milestones, and team performance.',
  '3': 'Write a professional follow-up email to [Recipient] after our [meeting/call] about [Topic]. Key points discussed: [Points].',
  '4': 'Summarize the following meeting notes into a structured format with attendees, key discussions, decisions made, and action items: [Paste notes].',
  '5': 'Write a payment reminder email for Invoice #[Number] totaling $[Amount] that was due on [Date]. Client: [Client Name]. Tone: professional and friendly.',
  '6': 'Create a project brief for [Project Name]. Include objectives, scope, timeline, team members, budget, deliverables, and success criteria.',
  '7': 'Write a [Platform] post about [Topic]. Target audience: [Audience]. Tone: [professional/casual/inspiring]. Include relevant hashtags and a call to action.',
  '8': 'Create a competitive analysis comparing [Our Product] against [Competitor 1], [Competitor 2], and [Competitor 3]. Cover features, pricing, market position, strengths, and weaknesses.',
  '9': 'Prepare a Q[Quarter] [Year] business review outline. Include revenue performance, client metrics, team updates, challenges, and Q[Next] priorities.',
  '10': 'Create a client onboarding guide for [Client Name] / [Service Type]. Include welcome message, key contacts, timeline, setup steps, and first-week checklist.',
  '11': 'Write a support response for a customer experiencing [Issue]. Acknowledge the problem, provide a solution, and offer next steps. Tone: empathetic and helpful.',
  '12': 'Write a team update email for [Week/Date Range]. Include project highlights, completed milestones, upcoming priorities, blockers, and any announcements.',
};

function generateMockResponse(userMessage) {
  const msg = userMessage.toLowerCase();

  if (msg.includes('revenue') || msg.includes('financial')) {
    return `<h3 style="font-weight:600;margin-bottom:8px;">Revenue Analysis</h3>
<p>Here is your comprehensive revenue breakdown:</p>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li><strong>Total Revenue:</strong> $2.4M (up 18% from last quarter)</li>
<li><strong>MRR:</strong> $812K -- a new company record</li>
<li><strong>Net Revenue Retention:</strong> 114%</li>
<li><strong>Top Revenue Stream:</strong> Enterprise subscriptions ($1.1M, 46%)</li>
<li><strong>Fastest Growing:</strong> Add-on services (+34% QoQ)</li>
</ul>
<h3 style="font-weight:600;margin:12px 0 8px;">Key Insights</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Enterprise deals closed 12% faster this quarter</li>
<li>Average deal size increased to <strong>$24,500</strong></li>
<li>Upsell revenue accounts for 28% of total growth</li>
</ul>
<p style="margin-top:12px;">Overall, financial performance is trending positively. I recommend focusing on expanding the enterprise pipeline and optimizing the upsell funnel for continued growth.</p>`;
  }

  if (msg.includes('email') || msg.includes('draft')) {
    return `<h3 style="font-weight:600;margin-bottom:8px;">Professional Email Draft</h3>
<p><strong>Subject:</strong> Following Up on Our Recent Discussion</p>
<br/>
<p>Dear [Recipient],</p>
<br/>
<p>Thank you for taking the time to meet with me earlier. I truly enjoyed our conversation and wanted to follow up on the key points we discussed.</p>
<br/>
<p><strong>Key Takeaways:</strong></p>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Agreed on project scope and timeline for Q2 deliverables</li>
<li>Budget allocation confirmed at the proposed level</li>
<li>Next milestone review scheduled for end of month</li>
</ul>
<br/>
<p><strong>Next Steps:</strong></p>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>I will send over the revised proposal by Friday</li>
<li>Please share the stakeholder list at your earliest convenience</li>
<li>Let's schedule a follow-up call for next week</li>
</ul>
<br/>
<p>Please don't hesitate to reach out if you have any questions or need clarification on any of the above.</p>
<br/>
<p>Best regards,<br/>[Your Name]</p>`;
  }

  if (msg.includes('report')) {
    return `<h3 style="font-weight:600;margin-bottom:8px;">Project Status Report</h3>
<p><strong>Reporting Period:</strong> Current Quarter</p>
<br/>
<h3 style="font-weight:600;margin:8px 0;">Executive Summary</h3>
<p>The project is tracking on schedule with 78% of milestones completed. Team velocity has improved by 15% compared to last sprint.</p>
<br/>
<h3 style="font-weight:600;margin:8px 0;">Completed Milestones</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li><strong>Phase 1:</strong> Requirements gathering and stakeholder alignment</li>
<li><strong>Phase 2:</strong> Core feature development (ahead of schedule)</li>
<li><strong>QA Testing:</strong> 94% pass rate on initial test suite</li>
</ul>
<h3 style="font-weight:600;margin:8px 0;">Current Blockers</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Awaiting API access from third-party vendor</li>
<li>Design review pending for mobile responsive layouts</li>
</ul>
<h3 style="font-weight:600;margin:8px 0;">Next Steps</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Begin Phase 3 development by end of week</li>
<li>Schedule UAT sessions with key stakeholders</li>
<li>Finalize deployment timeline and rollback plan</li>
</ul>`;
  }

  if (msg.includes('client')) {
    return `<h3 style="font-weight:600;margin-bottom:8px;">Client Insights & Analysis</h3>
<br/>
<h3 style="font-weight:600;margin:8px 0;">Client Portfolio Overview</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li><strong>Active Clients:</strong> 127 (up from 108 last quarter)</li>
<li><strong>Client Satisfaction Score:</strong> 4.7/5.0</li>
<li><strong>Churn Rate:</strong> 2.1% (down from 3.8%)</li>
<li><strong>Average Contract Value:</strong> $24,500/year</li>
</ul>
<h3 style="font-weight:600;margin:8px 0;">Top Performing Segments</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li><strong>Enterprise:</strong> 34 clients, $1.1M revenue (highest ARPU)</li>
<li><strong>Mid-Market:</strong> 58 clients, $890K revenue (fastest growing)</li>
<li><strong>SMB:</strong> 35 clients, $410K revenue (best retention)</li>
</ul>
<h3 style="font-weight:600;margin:8px 0;">Recommendations</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Expand enterprise team to capture growing demand</li>
<li>Launch loyalty program for clients approaching renewal</li>
<li>Implement quarterly business reviews for top 20 accounts</li>
</ul>`;
  }

  return `<h3 style="font-weight:600;margin-bottom:8px;">Here's what I've prepared</h3>
<p>I've analyzed your request and put together the following insights:</p>
<br/>
<h3 style="font-weight:600;margin:8px 0;">Key Points</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li><strong>Analysis Complete:</strong> I've reviewed the relevant data and context for your request</li>
<li><strong>Actionable Insights:</strong> Here are the recommended next steps based on the information available</li>
<li><strong>Strategic Alignment:</strong> These suggestions align with current business priorities</li>
</ul>
<h3 style="font-weight:600;margin:8px 0;">Recommendations</h3>
<ul style="list-style:disc;padding-left:20px;margin:8px 0;">
<li>Start by reviewing the data points highlighted above</li>
<li>Prioritize items based on impact and effort</li>
<li>Schedule a follow-up to track progress on implementation</li>
</ul>
<p style="margin-top:12px;">Let me know if you'd like me to go deeper on any specific area or adjust the format of this response.</p>`;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-2 px-1">
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '0ms' }} />
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '150ms' }} />
      <span className="w-2 h-2 rounded-full bg-muted animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

export default function AIAssistantPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>}>
      <AIAssistantPage />
    </Suspense>
  );
}

function AIAssistantPage() {
  const { chats, addChat, addMessage, deleteChat, renameChat, loaded } = useAiChats();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [hoveredChat, setHoveredChat] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const [templateHandled, setTemplateHandled] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const renameInputRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, isTyping]);

  // Handle template query param
  useEffect(() => {
    if (!loaded || templateHandled) return;
    const templateId = searchParams.get('template');
    if (templateId && templatePrompts[templateId]) {
      const prompt = templatePrompts[templateId];
      const newChat = addChat({ title: 'Template Chat', model: 'Gravitiq AI' });
      setActiveChatId(newChat.id);
      setInput(prompt);
      setTemplateHandled(true);
      // Clear the query param without full navigation
      router.replace('/ai', { scroll: false });
    }
  }, [loaded, searchParams, templateHandled, addChat, router]);

  // Focus rename input
  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  const sendMessage = useCallback((text, chatId) => {
    if (!text.trim()) return;
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;

    addMessage(targetChatId, { role: 'user', content: text, timestamp: new Date().toISOString() });
    setIsTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const responseHtml = generateMockResponse(text);
      addMessage(targetChatId, { role: 'assistant', content: responseHtml, timestamp: new Date().toISOString() });
      setIsTyping(false);
    }, delay);
  }, [activeChatId, addMessage]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    // If no active chat, create one
    let chatId = activeChatId;
    if (!chatId) {
      const firstWords = input.trim().split(' ').slice(0, 5).join(' ');
      const title = firstWords.length > 40 ? firstWords.slice(0, 40) + '...' : firstWords;
      const newChat = addChat({ title, model: 'Gravitiq AI' });
      chatId = newChat.id;
      setActiveChatId(chatId);
    }
    const text = input;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    sendMessage(text, chatId);
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
    setActiveChatId(null);
    setInput('');
  };

  const handleSuggestion = (text) => {
    const firstWords = text.split(' ').slice(0, 5).join(' ');
    const newChat = addChat({ title: firstWords, model: 'Gravitiq AI' });
    setActiveChatId(newChat.id);
    sendMessage(text, newChat.id);
  };

  const handleDelete = (e, chatId) => {
    e.stopPropagation();
    deleteChat(chatId);
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const handleRenameStart = (e, chat) => {
    e.stopPropagation();
    setRenamingId(chat.id);
    setRenameValue(chat.title);
  };

  const handleRenameSubmit = (chatId) => {
    if (renameValue.trim()) {
      renameChat(chatId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const showWelcomeState = !activeChat || activeChat.messages.length === 0;

  if (!loaded) {
    return (
      <div className="flex h-[calc(100vh-64px)] bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted">Loading AI Assistant...</p>
        </div>
      </div>
    );
  }

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
          {sortedChats.length === 0 && (
            <p className="px-3 py-4 text-sm text-muted text-center">No chats yet</p>
          )}
          {sortedChats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer mb-0.5 transition-colors ${
                activeChatId === chat.id
                  ? 'bg-primary-light text-foreground'
                  : 'text-muted hover:bg-surface-elevated hover:text-foreground'
              }`}
              onClick={() => {
                setActiveChatId(chat.id);
              }}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <div className="flex-1 min-w-0">
                {renamingId === chat.id ? (
                  <input
                    ref={renameInputRef}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => handleRenameSubmit(chat.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleRenameSubmit(chat.id);
                      if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm bg-surface-elevated border border-primary rounded px-1 py-0.5 w-full text-foreground focus:outline-none"
                  />
                ) : (
                  <>
                    <p className="text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted mt-0.5">{formatRelativeTime(chat.createdAt)}</p>
                  </>
                )}
              </div>
              {hoveredChat === chat.id && renamingId !== chat.id && (
                <div className="flex items-center gap-0.5 ml-2">
                  <button onClick={(e) => handleRenameStart(e, chat)} className="p-1 rounded hover:bg-border transition-colors cursor-pointer" title="Rename">
                    <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
                    </svg>
                  </button>
                  <button onClick={(e) => handleDelete(e, chat.id)} className="p-1 rounded hover:bg-border transition-colors cursor-pointer" title="Delete">
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
                {activeChat ? activeChat.title : 'AI Assistant'}
              </h1>
              <p className="text-xs text-muted">Powered by {activeChat?.model || 'Gravitiq AI'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={activeChat?.model || 'Gravitiq AI'}
              onChange={(e) => {
                if (activeChat) {
                  // Store model preference on the chat -- renameChat is the simplest hook that touches the chat object
                  // We'll use a convention: model is stored alongside the chat
                  // For now we update via local state since the hook may not have a setModel
                }
              }}
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
              {activeChat?.messages.map((msg, i) => (
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
                      {msg.role === 'assistant' ? (
                        <div className="prose-sm text-muted" dangerouslySetInnerHTML={{ __html: msg.content }} />
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
                disabled={!input.trim() || isTyping}
                className={`p-2 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  input.trim() && !isTyping
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
