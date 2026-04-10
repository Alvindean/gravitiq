// POST /api/ai/chat — AI chat with streaming simulation

const MOCK_RESPONSES = {
  default: `I'd be happy to help with that. Based on my analysis, here are some key recommendations:

1. **Optimize your content strategy** — Focus on long-tail keywords that align with your target audience's search intent.
2. **Improve page load speed** — Compress images and leverage browser caching to reduce load times below 3 seconds.
3. **Strengthen your backlink profile** — Pursue guest posting opportunities and local directory citations.
4. **Enhance mobile experience** — Ensure all interactive elements are easily tappable and forms are simplified for mobile users.

Would you like me to dive deeper into any of these areas?`,
  marketing: `Here's a tailored marketing strategy for your client:

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

Estimated ROI: 3.2x within the first quarter.`,
};

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, model } = body;

    if (!message || !message.trim()) {
      return Response.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    const selectedModel = model || 'gravitiq-pro';
    const lowerMsg = message.toLowerCase();
    const responseText = lowerMsg.includes('marketing') || lowerMsg.includes('strategy')
      ? MOCK_RESPONSES.marketing
      : MOCK_RESPONSES.default;

    const inputTokens = Math.ceil(message.length / 4);
    const outputTokens = Math.ceil(responseText.length / 4);

    // Stream the response in chunks
    const encoder = new TextEncoder();
    const words = responseText.split(' ');

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? '' : ' ') + words[i];
          controller.enqueue(encoder.encode(chunk));
          // Simulate a small delay via yielding (non-blocking)
          await new Promise((resolve) => setTimeout(resolve, 20));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-Model': selectedModel,
        'X-Input-Tokens': String(inputTokens),
        'X-Output-Tokens': String(outputTokens),
        'X-Total-Tokens': String(inputTokens + outputTokens),
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
