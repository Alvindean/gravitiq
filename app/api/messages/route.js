// GET  /api/messages — List conversations with messages
// POST /api/messages — Send a new message

import { readCollection, writeCollection } from '@/app/lib/db';

export async function GET() {
  try {
    const conversations = await readCollection('conversations');
    return Response.json({
      success: true,
      data: conversations,
      meta: { total: conversations.length },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load conversations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { conversationId, text, sender } = body;

    if (!text || !text.trim()) {
      return Response.json(
        { success: false, error: 'Message text is required' },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return Response.json(
        { success: false, error: 'conversationId is required' },
        { status: 400 }
      );
    }

    const conversations = await readCollection('conversations');
    const convIndex = conversations.findIndex((c) => c.id === conversationId);

    if (convIndex === -1) {
      return Response.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const message = {
      id: 'msg_' + Date.now().toString(36),
      sender: sender || 'me',
      text: text.trim(),
      timestamp: new Date().toISOString(),
      read: sender === 'me',
    };

    conversations[convIndex].messages.push(message);

    if (sender !== 'me') {
      conversations[convIndex].unread = (conversations[convIndex].unread || 0) + 1;
    }

    await writeCollection('conversations', conversations);

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
