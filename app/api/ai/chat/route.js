// POST /api/ai/chat — AI chat with persistent history

import { readCollection, writeCollection } from '@/app/lib/db';

function generateMockResponse(message) {
  const lower = message.toLowerCase();

  if (lower.includes('revenue') || lower.includes('financial') || lower.includes('earnings') || lower.includes('profit')) {
    return `Here's a quick revenue analysis based on your current data:

**Revenue Overview:**
- Total revenue this quarter: **$189,500** (up 12% from last quarter)
- Average deal size: **$4,200**
- Top client by revenue: Pinnacle Legal Group ($74,200)
- Monthly recurring revenue (MRR): **$15,800**

**Key Insights:**
1. Your top 3 clients account for 65% of total revenue — consider diversifying your client base.
2. SEO services have the highest margin at 72%.
3. Project-based work is trending up 18% month-over-month.

Would you like me to generate a detailed revenue report or forecast?`;
  }

  if (lower.includes('email') || lower.includes('draft') || lower.includes('write')) {
    return `Here's a professional email draft based on your request:

---

**Subject:** Following Up — Next Steps for Your Project

Hi [Client Name],

I hope this message finds you well. I wanted to touch base regarding our recent conversation about your upcoming project.

After reviewing the details, I've put together a preliminary plan that I think aligns perfectly with your goals. Here are the key highlights:

- **Timeline:** 4-6 weeks for initial deliverables
- **Approach:** Phased rollout starting with the highest-impact items
- **Budget:** Within the range we discussed

I'd love to schedule a 30-minute call this week to walk you through the full proposal. Would Thursday at 2:00 PM work for you?

Looking forward to hearing from you.

Best regards,
Alvin Dean

---

Want me to adjust the tone, add specific details, or create variations?`;
  }

  if (lower.includes('seo') || lower.includes('search') || lower.includes('keyword') || lower.includes('ranking')) {
    return `Here's an SEO strategy recommendation:

**Quick Wins (Week 1-2):**
1. Optimize meta titles and descriptions for your top 10 landing pages
2. Fix any broken internal links and 404 errors
3. Compress images and improve Core Web Vitals scores

**Medium-term (Month 1-2):**
1. Create 8-12 blog posts targeting long-tail local keywords
2. Build out location-specific service pages
3. Submit to 30+ local business directories with consistent NAP

**Long-term (Quarter 1-2):**
1. Develop a link-building campaign targeting industry publications
2. Create video content for YouTube SEO
3. Build topical authority with pillar content clusters

**Expected Results:**
- 40-60% increase in organic traffic within 90 days
- Top 3 local pack rankings for primary service keywords
- 25% improvement in conversion rate from organic visitors

Shall I dive deeper into any of these areas?`;
  }

  if (lower.includes('marketing') || lower.includes('strategy') || lower.includes('campaign')) {
    return `Here's a tailored marketing strategy:

**Phase 1: Foundation (Weeks 1-2)**
- Audit current digital presence and competitor landscape
- Define 3-5 primary conversion goals
- Set up tracking with GA4 and conversion pixels

**Phase 2: Content & SEO (Weeks 3-6)**
- Publish 8 optimized blog posts targeting local keywords
- Build out service area pages with unique content
- Submit to 25+ local directories with consistent NAP

**Phase 3: Paid Amplification (Weeks 7-10)**
- Launch Google Ads campaigns with $50/day budget
- A/B test ad copy with 3 headline variants
- Retarget website visitors with display ads

**Phase 4: Optimize & Scale (Weeks 11-12)**
- Analyze performance data and double down on winners
- Increase budget on top-performing campaigns by 30%
- Present ROI report to client

Estimated ROI: 3.2x within the first quarter.`;
  }

  return `I'd be happy to help with that. Based on my analysis, here are some key recommendations:

1. **Optimize your content strategy** — Focus on long-tail keywords that align with your target audience's search intent.
2. **Improve page load speed** — Compress images and leverage browser caching to reduce load times below 3 seconds.
3. **Strengthen your backlink profile** — Pursue guest posting opportunities and local directory citations.
4. **Enhance mobile experience** — Ensure all interactive elements are easily tappable and forms are simplified for mobile users.

Would you like me to dive deeper into any of these areas?`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { chatId, message, model } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const chats = await readCollection('ai-chats');
    const selectedModel = model || 'gravitiq-pro';
    const now = new Date().toISOString();

    // Find or create the chat
    let chat = chatId ? chats.find((c) => c.id === chatId) : null;
    const isNew = !chat;

    if (!chat) {
      chat = {
        id: 'chat_' + Date.now(),
        title: message.trim().slice(0, 60) + (message.length > 60 ? '...' : ''),
        model: selectedModel,
        messages: [],
        createdAt: now,
        updatedAt: now,
      };
    }

    // Add user message
    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: message.trim(),
      timestamp: now,
    };
    chat.messages.push(userMessage);

    // Generate and add assistant response
    const responseText = generateMockResponse(message);
    const assistantMessage = {
      id: 'msg_' + (Date.now() + 1),
      role: 'assistant',
      content: responseText,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    };
    chat.messages.push(assistantMessage);
    chat.updatedAt = new Date().toISOString();

    // Save back
    if (isNew) {
      chats.push(chat);
    } else {
      const idx = chats.findIndex((c) => c.id === chat.id);
      if (idx !== -1) chats[idx] = chat;
    }
    await writeCollection('ai-chats', chats);

    return Response.json({
      success: true,
      data: {
        chatId: chat.id,
        message: assistantMessage,
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
