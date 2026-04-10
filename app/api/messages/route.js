// GET  /api/messages — List conversations with messages
// POST /api/messages — Send a new message

const MOCK_CONVERSATIONS = [
  {
    id: 'conv_001',
    participant: { id: 'cli_001', name: 'Marcus Chen', company: 'TechVault Solutions', avatarColor: '#6366F1' },
    unread: 2,
    messages: [
      { id: 'msg_001', sender: 'them', text: 'Hey, can we hop on a call about the website revisions?', timestamp: '2026-04-09T14:22:00Z', read: true },
      { id: 'msg_002', sender: 'me', text: 'Sure thing! How does Thursday at 2pm work?', timestamp: '2026-04-09T14:30:00Z', read: true },
      { id: 'msg_003', sender: 'them', text: 'Perfect. Also, I attached the updated brand guidelines.', timestamp: '2026-04-09T15:10:00Z', read: false },
      { id: 'msg_004', sender: 'them', text: 'Let me know if the colors look right.', timestamp: '2026-04-09T15:11:00Z', read: false },
    ],
  },
  {
    id: 'conv_002',
    participant: { id: 'cli_002', name: 'Sarah Jennings', company: 'Bloom & Grow Co', avatarColor: '#EC4899' },
    unread: 0,
    messages: [
      { id: 'msg_005', sender: 'me', text: 'Hi Sarah! The brand identity concepts are ready for review.', timestamp: '2026-04-08T10:00:00Z', read: true },
      { id: 'msg_006', sender: 'them', text: 'Amazing! I love option B. Can we refine that one?', timestamp: '2026-04-08T11:45:00Z', read: true },
      { id: 'msg_007', sender: 'me', text: 'Absolutely. I will send refined mockups by EOD tomorrow.', timestamp: '2026-04-08T12:00:00Z', read: true },
    ],
  },
  {
    id: 'conv_003',
    participant: { id: 'cli_003', name: 'David Okafor', company: 'Pinnacle Legal Group', avatarColor: '#F59E0B' },
    unread: 1,
    messages: [
      { id: 'msg_008', sender: 'them', text: 'The Google Ads performance report looks great. Can we increase the budget for personal injury keywords?', timestamp: '2026-04-07T09:30:00Z', read: true },
      { id: 'msg_009', sender: 'me', text: 'I will put together a proposal with projected ROI for a 30% budget increase.', timestamp: '2026-04-07T10:15:00Z', read: true },
      { id: 'msg_010', sender: 'them', text: 'Sounds good. Also want to discuss adding landing pages for each practice area.', timestamp: '2026-04-10T08:00:00Z', read: false },
    ],
  },
  {
    id: 'conv_004',
    participant: { id: 'cli_005', name: 'James Whitmore', company: 'Apex Auto Detailing', avatarColor: '#3B82F6' },
    unread: 0,
    messages: [
      { id: 'msg_011', sender: 'me', text: 'Welcome aboard, James! Excited to kick off the local SEO project.', timestamp: '2026-04-05T09:00:00Z', read: true },
      { id: 'msg_012', sender: 'them', text: 'Thanks! Ready to get started. When is the kickoff?', timestamp: '2026-04-05T09:30:00Z', read: true },
    ],
  },
];

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_CONVERSATIONS,
    meta: { total: MOCK_CONVERSATIONS.length },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, text } = body;

    if (!text || !text.trim()) {
      return Response.json(
        { success: false, error: 'Message text is required' },
        { status: 400 }
      );
    }

    const message = {
      id: `msg_${Date.now().toString(36)}`,
      conversationId: conversationId || `conv_${Date.now().toString(36)}`,
      sender: 'me',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    return Response.json(
      { success: true, data: message },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
