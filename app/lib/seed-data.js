// ============================================================
// Gravitiq — Seed Data
// All initial data that populates on first visit.
// ============================================================

// ── Clients (8) ──────────────────────────────────────────────
export const seedClients = [
  { id: 'c1', name: 'Sarah Mitchell', company: 'TechFlow Inc', email: 'sarah@techflow.io', phone: '+1 (555) 234-5678', status: 'active', revenue: 24300, lastActivity: '2026-04-08', avatarColor: '#4F46E5', notes: 'Key enterprise client' },
  { id: 'c2', name: 'James Rodriguez', company: 'BrightPath Labs', email: 'james@brightpath.com', phone: '+1 (555) 345-6789', status: 'active', revenue: 18500, lastActivity: '2026-04-06', avatarColor: '#059669', notes: 'Expanding to Pro plan' },
  { id: 'c3', name: 'Emily Chen', company: 'Quantum Dynamics', email: 'emily@quantumdyn.co', phone: '+1 (555) 456-7890', status: 'active', revenue: 31200, lastActivity: '2026-04-09', avatarColor: '#DC2626', notes: 'Largest revenue client' },
  { id: 'c4', name: 'Marcus Thompson', company: 'Apex Ventures', email: 'marcus@apexvc.com', phone: '+1 (555) 567-8901', status: 'inactive', revenue: 8400, lastActivity: '2026-03-14', avatarColor: '#7C3AED', notes: 'On hold - budget review' },
  { id: 'c5', name: 'Olivia Parker', company: 'Nova Creative', email: 'olivia@novacreative.io', phone: '+1 (555) 678-9012', status: 'active', revenue: 15600, lastActivity: '2026-04-07', avatarColor: '#EA580C', notes: 'Great referral source' },
  { id: 'c6', name: 'Daniel Kim', company: 'Stellar Systems', email: 'daniel@stellarsys.com', phone: '+1 (555) 789-0123', status: 'prospect', revenue: 0, lastActivity: '2026-04-04', avatarColor: '#0891B2', notes: 'Demo scheduled next week' },
  { id: 'c7', name: 'Rachel Foster', company: 'Luminary Design', email: 'rachel@luminarydesign.co', phone: '+1 (555) 890-1234', status: 'active', revenue: 12800, lastActivity: '2026-04-05', avatarColor: '#BE185D', notes: 'Loves the AI features' },
  { id: 'c8', name: 'Alex Nguyen', company: 'Horizon Tech', email: 'alex@horizontech.dev', phone: '+1 (555) 901-2345', status: 'inactive', revenue: 5200, lastActivity: '2026-02-27', avatarColor: '#65A30D', notes: 'May reactivate in Q3' },
];

// ── Projects (14) ────────────────────────────────────────────
export const seedProjects = [
  // Backlog (3)
  {
    id: 'p1', title: 'Mobile App Redesign', clientId: 'c1', clientName: 'Sarah Mitchell',
    status: 'backlog', priority: 'high', progress: 0, dueDate: '2026-05-15',
    team: [
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
    ],
    description: 'Complete redesign of the TechFlow mobile application with new UI/UX patterns.',
    createdAt: '2026-04-02',
  },
  {
    id: 'p2', title: 'Data Migration Pipeline', clientId: 'c4', clientName: 'Marcus Thompson',
    status: 'backlog', priority: 'medium', progress: 0, dueDate: '2026-06-01',
    team: [
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
    ],
    description: 'Build an automated pipeline to migrate legacy data from Apex Ventures to the new platform.',
    createdAt: '2026-04-05',
  },
  {
    id: 'p3', title: 'SEO Optimization Sprint', clientId: 'c5', clientName: 'Olivia Parker',
    status: 'backlog', priority: 'low', progress: 0, dueDate: '2026-05-30',
    team: [
      { name: 'Sam Patel', initials: 'SP', color: '#EA580C' },
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
    ],
    description: 'Comprehensive SEO audit and optimization for Nova Creative marketing pages.',
    createdAt: '2026-04-07',
  },

  // In Progress (4)
  {
    id: 'p4', title: 'Website Redesign', clientId: 'c1', clientName: 'Sarah Mitchell',
    status: 'in_progress', priority: 'high', progress: 65, dueDate: '2026-04-20',
    team: [
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
    ],
    description: 'Full website redesign for TechFlow Inc including homepage, product pages, and blog.',
    createdAt: '2026-03-10',
  },
  {
    id: 'p5', title: 'API Integration Suite', clientId: 'c2', clientName: 'James Rodriguez',
    status: 'in_progress', priority: 'high', progress: 40, dueDate: '2026-04-28',
    team: [
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
      { name: 'Sam Patel', initials: 'SP', color: '#EA580C' },
    ],
    description: 'Build REST and GraphQL API integrations for BrightPath Labs platform.',
    createdAt: '2026-03-18',
  },
  {
    id: 'p6', title: 'Analytics Dashboard', clientId: 'c3', clientName: 'Emily Chen',
    status: 'in_progress', priority: 'medium', progress: 55, dueDate: '2026-04-25',
    team: [
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
      { name: 'Lena Kowalski', initials: 'LK', color: '#7C3AED' },
    ],
    description: 'Real-time analytics dashboard for Quantum Dynamics with customizable widgets.',
    createdAt: '2026-03-22',
  },
  {
    id: 'p7', title: 'E-commerce Platform', clientId: 'c7', clientName: 'Rachel Foster',
    status: 'in_progress', priority: 'medium', progress: 30, dueDate: '2026-05-10',
    team: [
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
      { name: 'Sam Patel', initials: 'SP', color: '#EA580C' },
    ],
    description: 'Custom e-commerce storefront for Luminary Design with Stripe integration.',
    createdAt: '2026-03-28',
  },

  // Review (3)
  {
    id: 'p8', title: 'Brand Identity Package', clientId: 'c5', clientName: 'Olivia Parker',
    status: 'review', priority: 'medium', progress: 90, dueDate: '2026-04-12',
    team: [
      { name: 'Lena Kowalski', initials: 'LK', color: '#7C3AED' },
    ],
    description: 'Complete brand identity redesign including logo, color palette, and style guide.',
    createdAt: '2026-03-01',
  },
  {
    id: 'p9', title: 'Cloud Infrastructure Setup', clientId: 'c3', clientName: 'Emily Chen',
    status: 'review', priority: 'high', progress: 85, dueDate: '2026-04-14',
    team: [
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
    ],
    description: 'AWS infrastructure setup with CI/CD pipelines for Quantum Dynamics.',
    createdAt: '2026-02-20',
  },
  {
    id: 'p10', title: 'Content Management System', clientId: 'c2', clientName: 'James Rodriguez',
    status: 'review', priority: 'low', progress: 95, dueDate: '2026-04-11',
    team: [
      { name: 'Sam Patel', initials: 'SP', color: '#EA580C' },
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
    ],
    description: 'Headless CMS with custom content types for BrightPath Labs blog and documentation.',
    createdAt: '2026-02-15',
  },

  // Completed (4)
  {
    id: 'p11', title: 'Landing Page Campaign', clientId: 'c5', clientName: 'Olivia Parker',
    status: 'completed', priority: 'high', progress: 100, dueDate: '2026-03-30',
    team: [
      { name: 'Lena Kowalski', initials: 'LK', color: '#7C3AED' },
      { name: 'Maya Lin', initials: 'ML', color: '#059669' },
    ],
    description: 'High-converting landing pages for Nova Creative spring marketing campaign.',
    createdAt: '2026-02-10',
  },
  {
    id: 'p12', title: 'Payment Gateway Integration', clientId: 'c8', clientName: 'Alex Nguyen',
    status: 'completed', priority: 'medium', progress: 100, dueDate: '2026-03-15',
    team: [
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
    ],
    description: 'Stripe and PayPal payment gateway integration for Horizon Tech SaaS platform.',
    createdAt: '2026-01-20',
  },
  {
    id: 'p13', title: 'User Onboarding Flow', clientId: 'c1', clientName: 'Sarah Mitchell',
    status: 'completed', priority: 'medium', progress: 100, dueDate: '2026-03-20',
    team: [
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
      { name: 'Sam Patel', initials: 'SP', color: '#EA580C' },
    ],
    description: 'Multi-step onboarding wizard with progress tracking for TechFlow Inc.',
    createdAt: '2026-02-01',
  },
  {
    id: 'p14', title: 'Security Audit & Fixes', clientId: 'c3', clientName: 'Emily Chen',
    status: 'completed', priority: 'high', progress: 100, dueDate: '2026-03-25',
    team: [
      { name: 'Jordan Hayes', initials: 'JH', color: '#DC2626' },
      { name: 'Alvin Warren', initials: 'AW', color: '#4F46E5' },
    ],
    description: 'Full security audit with vulnerability patches for Quantum Dynamics infrastructure.',
    createdAt: '2026-02-05',
  },
];

// ── Conversations (6) ────────────────────────────────────────
export const seedConversations = [
  {
    id: 'conv1', clientId: 'c1', clientName: 'Sarah Mitchell', company: 'TechFlow Inc',
    avatarColor: '#4F46E5', online: true, unread: 3,
    messages: [
      { id: 'm1', sender: 'client', text: 'Hi! Just wanted to check in on the website redesign project.', timestamp: '2026-04-10T10:15:00' },
      { id: 'm2', sender: 'user', text: 'Hey Sarah! Everything is on track. We finished the homepage mockups yesterday.', timestamp: '2026-04-10T10:18:00' },
      { id: 'm3', sender: 'client', text: 'That is amazing! Can you share them with me?', timestamp: '2026-04-10T10:20:00' },
      { id: 'm4', sender: 'user', text: 'Of course! I just uploaded them to the shared drive. You should have access now.', timestamp: '2026-04-10T10:22:00' },
      { id: 'm5', sender: 'user', text: 'Let me know if you have any feedback or changes you would like to see.', timestamp: '2026-04-10T10:22:30' },
      { id: 'm6', sender: 'client', text: 'Sounds great! I will review the mockups tonight.', timestamp: '2026-04-10T10:25:00' },
    ],
  },
  {
    id: 'conv2', clientId: 'c2', clientName: 'James Rodriguez', company: 'BrightPath Labs',
    avatarColor: '#059669', online: true, unread: 1,
    messages: [
      { id: 'm7', sender: 'client', text: 'Quick question about the API rate limits we discussed.', timestamp: '2026-04-09T14:30:00' },
      { id: 'm8', sender: 'user', text: 'Sure James, what do you need to know?', timestamp: '2026-04-09T14:32:00' },
      { id: 'm9', sender: 'client', text: 'Can we increase the limit to 10,000 requests per minute for the Pro tier?', timestamp: '2026-04-09T14:35:00' },
      { id: 'm10', sender: 'user', text: 'Absolutely. I will update the configuration and push the changes today.', timestamp: '2026-04-09T14:38:00' },
      { id: 'm11', sender: 'client', text: 'Perfect, thanks!', timestamp: '2026-04-09T14:40:00' },
    ],
  },
  {
    id: 'conv3', clientId: 'c3', clientName: 'Emily Chen', company: 'Quantum Dynamics',
    avatarColor: '#DC2626', online: false, unread: 0,
    messages: [
      { id: 'm12', sender: 'user', text: 'Hi Emily, the analytics dashboard is looking great. Wanted to share a quick update.', timestamp: '2026-04-08T09:00:00' },
      { id: 'm13', sender: 'client', text: 'I would love to see it! How is the real-time data feed working?', timestamp: '2026-04-08T09:15:00' },
      { id: 'm14', sender: 'user', text: 'Latency is under 200ms. We are streaming via WebSockets with automatic reconnection.', timestamp: '2026-04-08T09:18:00' },
      { id: 'm15', sender: 'client', text: 'That exceeds our requirements. Great work!', timestamp: '2026-04-08T09:25:00' },
    ],
  },
  {
    id: 'conv4', clientId: 'c5', clientName: 'Olivia Parker', company: 'Nova Creative',
    avatarColor: '#EA580C', online: true, unread: 2,
    messages: [
      { id: 'm16', sender: 'client', text: 'Hey! The brand identity package looks stunning.', timestamp: '2026-04-09T16:00:00' },
      { id: 'm17', sender: 'user', text: 'Glad you love it! Lena really knocked it out of the park with the color palette.', timestamp: '2026-04-09T16:05:00' },
      { id: 'm18', sender: 'client', text: 'Could we also get social media templates in the same style?', timestamp: '2026-04-09T16:10:00' },
      { id: 'm19', sender: 'user', text: 'Definitely. I will add that to the project scope and send over a revised timeline.', timestamp: '2026-04-09T16:12:00' },
      { id: 'm20', sender: 'client', text: 'You guys are the best. Talk soon!', timestamp: '2026-04-09T16:15:00' },
      { id: 'm21', sender: 'client', text: 'Oh, one more thing - can we schedule a call for Thursday?', timestamp: '2026-04-09T16:20:00' },
    ],
  },
  {
    id: 'conv5', clientId: 'c7', clientName: 'Rachel Foster', company: 'Luminary Design',
    avatarColor: '#BE185D', online: false, unread: 0,
    messages: [
      { id: 'm22', sender: 'user', text: 'Rachel, the e-commerce storefront prototype is ready for review.', timestamp: '2026-04-07T11:00:00' },
      { id: 'm23', sender: 'client', text: 'Awesome! I will check it out this afternoon.', timestamp: '2026-04-07T11:30:00' },
      { id: 'm24', sender: 'client', text: 'Just reviewed it. The product pages look incredible. Love the AI recommendations widget.', timestamp: '2026-04-07T15:45:00' },
    ],
  },
  {
    id: 'conv6', clientId: 'c6', clientName: 'Daniel Kim', company: 'Stellar Systems',
    avatarColor: '#0891B2', online: true, unread: 1,
    messages: [
      { id: 'm25', sender: 'client', text: 'Hi there! I saw your demo and I am very impressed.', timestamp: '2026-04-10T08:00:00' },
      { id: 'm26', sender: 'user', text: 'Thanks Daniel! Happy to hear that. What features stood out to you?', timestamp: '2026-04-10T08:10:00' },
      { id: 'm27', sender: 'client', text: 'The AI-powered analytics and the real-time collaboration tools. Can we schedule a deeper dive?', timestamp: '2026-04-10T08:15:00' },
    ],
  },
];

// ── AI Chats (8) ─────────────────────────────────────────────
export const seedAiChats = [
  {
    id: 'ai1', title: 'Q1 Revenue Analysis', createdAt: '2026-04-10T08:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'Generate a summary of Q1 performance' },
      { role: 'assistant', content: 'Here is your Q1 2026 performance summary:\n\n**Revenue:** $116,000 (+18% vs Q4 2025)\n**Active Clients:** 6 of 8 total\n**Projects Completed:** 4\n**Average Project Value:** $14,500\n\nTop performer: Emily Chen (Quantum Dynamics) at $31,200 in revenue. Client retention rate sits at 75%, with two accounts currently inactive. Pipeline looks strong with 4 projects in progress and 3 in review.' },
    ],
  },
  {
    id: 'ai2', title: 'Client Retention Strategy', createdAt: '2026-04-09T14:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'What strategies can I use to reactivate Marcus Thompson and Alex Nguyen?' },
      { role: 'assistant', content: 'Here are targeted reactivation strategies for both clients:\n\n**Marcus Thompson (Apex Ventures)**\n- Offer a discounted pilot project to re-engage during budget review\n- Share case studies from similar venture capital clients\n- Schedule an informal check-in call to understand current needs\n\n**Alex Nguyen (Horizon Tech)**\n- Prepare a Q3 proposal with new feature highlights\n- Offer early access to upcoming platform features\n- Send a personalized recap of previous project successes\n\nBoth clients have existing relationships, so warm outreach with value-first messaging will be most effective.' },
    ],
  },
  {
    id: 'ai3', title: 'Project Timeline Optimization', createdAt: '2026-04-08T10:30:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'How can we speed up the Website Redesign project?' },
      { role: 'assistant', content: 'The Website Redesign project is at 65% progress with an April 20 deadline. Here are optimization suggestions:\n\n1. **Parallelize remaining tasks** - Run QA testing alongside final design revisions\n2. **Increase team allocation** - Consider pulling Sam Patel in for the final sprint\n3. **Scope trimming** - Move the blog redesign to a phase 2 if needed\n4. **Daily standups** - Switch from weekly to daily check-ins for the final 10 days\n\nBased on current velocity, you should hit the deadline with 2 days buffer if you parallelize tasks.' },
    ],
  },
  {
    id: 'ai4', title: 'Invoice Follow-up Email', createdAt: '2026-04-07T16:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'Draft a friendly follow-up email for overdue invoices' },
      { role: 'assistant', content: 'Here is a friendly follow-up template:\n\n**Subject:** Quick reminder - Invoice [NUMBER] due\n\nHi [Client Name],\n\nHope you are doing well! I wanted to send a quick reminder that invoice [NUMBER] for $[AMOUNT] was due on [DATE].\n\nI understand things can get busy, so no worries at all. If there are any questions about the invoice or if you need any adjustments, just let me know.\n\nYou can view and pay the invoice here: [LINK]\n\nThanks so much!\nBest,\nAlvin' },
    ],
  },
  {
    id: 'ai5', title: 'Competitive Analysis', createdAt: '2026-04-06T09:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'What are the key differentiators we should highlight to prospects?' },
      { role: 'assistant', content: 'Based on your current client feedback and service offering, here are your top differentiators:\n\n1. **AI-Powered Insights** - Real-time analytics that competitors charge extra for\n2. **Speed of Delivery** - Average project completion 30% faster than industry standard\n3. **Full-Stack Capability** - Design, development, and infrastructure under one roof\n4. **Personalized Service** - Small team, direct access to senior talent\n5. **Transparent Pricing** - No hidden fees, milestone-based billing\n\nLead with #1 and #2 for tech-savvy prospects like Daniel Kim from Stellar Systems.' },
    ],
  },
  {
    id: 'ai6', title: 'Team Capacity Planning', createdAt: '2026-04-05T11:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'Do we have capacity to take on a new large project next month?' },
      { role: 'assistant', content: 'Let me analyze your current team allocation:\n\n**Current Load:**\n- Alvin Warren: 3 active projects (high load)\n- Maya Lin: 3 active projects (high load)\n- Jordan Hayes: 3 active projects (high load)\n- Sam Patel: 3 active projects (high load)\n- Lena Kowalski: 2 active projects (moderate load)\n\n**Capacity Forecast for May:**\n- 3 projects in review should complete by mid-April\n- This frees up approximately 40% capacity across the team\n\n**Recommendation:** You can take on a large project starting May 1st, but consider hiring a contractor for the first 2 weeks while review projects wrap up.' },
    ],
  },
  {
    id: 'ai7', title: 'Pricing Strategy Review', createdAt: '2026-04-03T13:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'Should we raise our prices for Q2?' },
      { role: 'assistant', content: 'Based on your current metrics, here is my pricing analysis:\n\n**Current State:**\n- Average project value: $14,500\n- Client satisfaction: High (based on retention and referrals)\n- Market rate for comparable services: $15,000-$22,000\n\n**Recommendation:** Yes, a 10-15% price increase is justified.\n\n**Strategy:**\n1. Grandfather existing active clients at current rates for 6 months\n2. Apply new pricing to all new projects and prospects\n3. Bundle AI features as a premium add-on ($2,000-$3,000)\n4. Introduce a retainer model for ongoing clients at a 10% discount\n\nThis should increase average revenue per client by approximately $2,500/quarter.' },
    ],
  },
  {
    id: 'ai8', title: 'Weekly Status Report', createdAt: '2026-04-01T08:00:00', model: 'gravitiq',
    messages: [
      { role: 'user', content: 'Generate this week status report for all active projects' },
      { role: 'assistant', content: '**Weekly Status Report - April 1, 2026**\n\n**In Progress:**\n- Website Redesign (TechFlow): 65% - On track for April 20 deadline\n- API Integration Suite (BrightPath): 40% - On track\n- Analytics Dashboard (Quantum Dynamics): 55% - On track\n- E-commerce Platform (Luminary): 30% - On track for May 10\n\n**In Review:**\n- Brand Identity Package (Nova Creative): 90% - Client reviewing final assets\n- Cloud Infrastructure (Quantum Dynamics): 85% - Pending security sign-off\n- Content Management System (BrightPath): 95% - Final QA in progress\n\n**Blocked:** None\n**Risks:** None identified\n\n**Highlights:** Completed Security Audit for Quantum Dynamics ahead of schedule. Two new leads in pipeline.' },
    ],
  },
];

// ── Invoices (10) ────────────────────────────────────────────
export const seedInvoices = [
  {
    id: 'inv1', invoiceNumber: 'INV-2026-001', clientId: 'c3', clientName: 'Emily Chen',
    amount: 12500, status: 'paid', issuedDate: '2026-01-15', dueDate: '2026-02-14',
    items: [
      { description: 'Security Audit - Phase 1', quantity: 1, rate: 7500, amount: 7500 },
      { description: 'Vulnerability Patching', quantity: 10, rate: 500, amount: 5000 },
    ],
  },
  {
    id: 'inv2', invoiceNumber: 'INV-2026-002', clientId: 'c1', clientName: 'Sarah Mitchell',
    amount: 8500, status: 'paid', issuedDate: '2026-02-01', dueDate: '2026-03-03',
    items: [
      { description: 'User Onboarding Flow - Design', quantity: 1, rate: 3500, amount: 3500 },
      { description: 'User Onboarding Flow - Development', quantity: 1, rate: 5000, amount: 5000 },
    ],
  },
  {
    id: 'inv3', invoiceNumber: 'INV-2026-003', clientId: 'c8', clientName: 'Alex Nguyen',
    amount: 5200, status: 'paid', issuedDate: '2026-02-15', dueDate: '2026-03-17',
    items: [
      { description: 'Payment Gateway Integration', quantity: 1, rate: 4000, amount: 4000 },
      { description: 'Testing & QA', quantity: 8, rate: 150, amount: 1200 },
    ],
  },
  {
    id: 'inv4', invoiceNumber: 'INV-2026-004', clientId: 'c5', clientName: 'Olivia Parker',
    amount: 6800, status: 'paid', issuedDate: '2026-03-01', dueDate: '2026-03-31',
    items: [
      { description: 'Landing Page Campaign - Design', quantity: 3, rate: 1500, amount: 4500 },
      { description: 'Copywriting & SEO', quantity: 1, rate: 2300, amount: 2300 },
    ],
  },
  {
    id: 'inv5', invoiceNumber: 'INV-2026-005', clientId: 'c3', clientName: 'Emily Chen',
    amount: 15000, status: 'sent', issuedDate: '2026-03-20', dueDate: '2026-04-19',
    items: [
      { description: 'Cloud Infrastructure Setup - AWS', quantity: 1, rate: 10000, amount: 10000 },
      { description: 'CI/CD Pipeline Configuration', quantity: 1, rate: 5000, amount: 5000 },
    ],
  },
  {
    id: 'inv6', invoiceNumber: 'INV-2026-006', clientId: 'c1', clientName: 'Sarah Mitchell',
    amount: 14000, status: 'sent', issuedDate: '2026-04-01', dueDate: '2026-05-01',
    items: [
      { description: 'Website Redesign - Phase 1', quantity: 1, rate: 8000, amount: 8000 },
      { description: 'Homepage Mockups', quantity: 4, rate: 1500, amount: 6000 },
    ],
  },
  {
    id: 'inv7', invoiceNumber: 'INV-2026-007', clientId: 'c2', clientName: 'James Rodriguez',
    amount: 9200, status: 'sent', issuedDate: '2026-04-05', dueDate: '2026-05-05',
    items: [
      { description: 'API Integration - REST Endpoints', quantity: 1, rate: 5200, amount: 5200 },
      { description: 'API Documentation', quantity: 1, rate: 4000, amount: 4000 },
    ],
  },
  {
    id: 'inv8', invoiceNumber: 'INV-2026-008', clientId: 'c7', clientName: 'Rachel Foster',
    amount: 7500, status: 'draft', issuedDate: '2026-04-08', dueDate: '2026-05-08',
    items: [
      { description: 'E-commerce Storefront - Prototype', quantity: 1, rate: 5000, amount: 5000 },
      { description: 'Stripe Integration', quantity: 1, rate: 2500, amount: 2500 },
    ],
  },
  {
    id: 'inv9', invoiceNumber: 'INV-2026-009', clientId: 'c4', clientName: 'Marcus Thompson',
    amount: 4200, status: 'overdue', issuedDate: '2026-02-10', dueDate: '2026-03-12',
    items: [
      { description: 'Data Migration - Consultation', quantity: 6, rate: 500, amount: 3000 },
      { description: 'Architecture Documentation', quantity: 1, rate: 1200, amount: 1200 },
    ],
  },
  {
    id: 'inv10', invoiceNumber: 'INV-2026-010', clientId: 'c5', clientName: 'Olivia Parker',
    amount: 5500, status: 'draft', issuedDate: '2026-04-10', dueDate: '2026-05-10',
    items: [
      { description: 'Brand Identity - Logo Design', quantity: 1, rate: 3000, amount: 3000 },
      { description: 'Style Guide & Assets', quantity: 1, rate: 2500, amount: 2500 },
    ],
  },
];

// ── Team Members (6) ─────────────────────────────────────────
export const seedTeam = [
  { id: 't1', name: 'Alvin Warren', email: 'alvin@gravitiq.io', role: 'owner', status: 'active', joinedAt: '2025-06-01', avatarColor: '#4F46E5' },
  { id: 't2', name: 'Maya Lin', email: 'maya@gravitiq.io', role: 'admin', status: 'active', joinedAt: '2025-07-15', avatarColor: '#059669' },
  { id: 't3', name: 'Jordan Hayes', email: 'jordan@gravitiq.io', role: 'member', status: 'active', joinedAt: '2025-08-20', avatarColor: '#DC2626' },
  { id: 't4', name: 'Sam Patel', email: 'sam@gravitiq.io', role: 'member', status: 'active', joinedAt: '2025-09-10', avatarColor: '#EA580C' },
  { id: 't5', name: 'Lena Kowalski', email: 'lena@gravitiq.io', role: 'member', status: 'active', joinedAt: '2025-10-05', avatarColor: '#7C3AED' },
  { id: 't6', name: 'Chris Nakamura', email: 'chris@gravitiq.io', role: 'viewer', status: 'invited', joinedAt: '2026-04-08', avatarColor: '#0891B2' },
];

// ── Activities (10) ──────────────────────────────────────────
export const seedActivities = [
  { id: 'act1', type: 'project', description: 'Website Redesign progress updated to 65%', timestamp: '2026-04-10T09:30:00', link: '/dashboard/projects' },
  { id: 'act2', type: 'client', description: 'New prospect added: Daniel Kim from Stellar Systems', timestamp: '2026-04-10T08:45:00', link: '/dashboard/clients' },
  { id: 'act3', type: 'invoice', description: 'Invoice INV-2026-010 drafted for Nova Creative', timestamp: '2026-04-10T08:00:00', link: '/dashboard/invoices' },
  { id: 'act4', type: 'ai', description: 'AI generated Q1 Revenue Analysis report', timestamp: '2026-04-10T07:30:00', link: '/dashboard/ai' },
  { id: 'act5', type: 'team', description: 'Chris Nakamura invited to the team as viewer', timestamp: '2026-04-08T14:00:00', link: '/dashboard/team' },
  { id: 'act6', type: 'project', description: 'Security Audit & Fixes marked as completed', timestamp: '2026-04-07T17:00:00', link: '/dashboard/projects' },
  { id: 'act7', type: 'invoice', description: 'Invoice INV-2026-007 sent to James Rodriguez', timestamp: '2026-04-05T10:00:00', link: '/dashboard/invoices' },
  { id: 'act8', type: 'client', description: 'Olivia Parker referred a new lead', timestamp: '2026-04-04T12:30:00', link: '/dashboard/clients' },
  { id: 'act9', type: 'project', description: 'E-commerce Platform kicked off for Luminary Design', timestamp: '2026-04-03T09:00:00', link: '/dashboard/projects' },
  { id: 'act10', type: 'invoice', description: 'Invoice INV-2026-004 payment received from Nova Creative', timestamp: '2026-04-01T11:00:00', link: '/dashboard/invoices' },
];

// ── Tasks (6) ────────────────────────────────────────────────
export const seedTasks = [
  { id: 'task1', title: 'Review homepage mockups with Sarah', dueDate: '2026-04-11', priority: 'high', assignee: { name: 'Alvin Warren', initials: 'AW' }, completed: false },
  { id: 'task2', title: 'Finalize API documentation for BrightPath', dueDate: '2026-04-12', priority: 'high', assignee: { name: 'Jordan Hayes', initials: 'JH' }, completed: false },
  { id: 'task3', title: 'Send revised brand guide to Olivia', dueDate: '2026-04-13', priority: 'medium', assignee: { name: 'Lena Kowalski', initials: 'LK' }, completed: false },
  { id: 'task4', title: 'Set up staging environment for e-commerce', dueDate: '2026-04-14', priority: 'medium', assignee: { name: 'Sam Patel', initials: 'SP' }, completed: false },
  { id: 'task5', title: 'Schedule demo call with Daniel Kim', dueDate: '2026-04-11', priority: 'high', assignee: { name: 'Alvin Warren', initials: 'AW' }, completed: false },
  { id: 'task6', title: 'Update team capacity spreadsheet', dueDate: '2026-04-15', priority: 'low', assignee: { name: 'Maya Lin', initials: 'ML' }, completed: true },
];

// ── Revenue Data (12 months: Jul 2025 - Jun 2026) ───────────
export const seedRevenue = [
  { month: 'Jul 2025', revenue: 18200, expenses: 12400 },
  { month: 'Aug 2025', revenue: 21500, expenses: 13100 },
  { month: 'Sep 2025', revenue: 19800, expenses: 12800 },
  { month: 'Oct 2025', revenue: 24100, expenses: 14200 },
  { month: 'Nov 2025', revenue: 26300, expenses: 14800 },
  { month: 'Dec 2025', revenue: 22700, expenses: 15100 },
  { month: 'Jan 2026', revenue: 28400, expenses: 15600 },
  { month: 'Feb 2026', revenue: 31200, expenses: 16200 },
  { month: 'Mar 2026', revenue: 34800, expenses: 16900 },
  { month: 'Apr 2026', revenue: 32100, expenses: 17300 },
  { month: 'May 2026', revenue: 0, expenses: 0 },
  { month: 'Jun 2026', revenue: 0, expenses: 0 },
];

// ── Profile ──────────────────────────────────────────────────
export const seedProfile = {
  name: 'Alvin Warren',
  email: 'alvin@gravitiq.io',
  phone: '+1 (555) 123-4567',
  company: 'Gravitiq',
  jobTitle: 'CEO',
  timezone: 'America/New_York',
};

// ── Notification Preferences ─────────────────────────────────
export const seedNotifications = {
  email: {
    projectUpdates: true,
    invoiceReminders: true,
    clientMessages: true,
    teamActivity: false,
    weeklyDigest: true,
    marketingTips: false,
  },
  push: {
    projectUpdates: true,
    invoiceReminders: true,
    clientMessages: true,
    teamActivity: true,
    weeklyDigest: false,
    marketingTips: false,
  },
};
