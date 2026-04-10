// GET /api/conversations — List all conversations

import { readCollection } from '@/app/lib/db';

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
