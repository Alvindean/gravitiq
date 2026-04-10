// GET /api/settings/notifications — Return notification preferences
// PUT /api/settings/notifications — Update preferences

import { readDocument, writeDocument } from '@/app/lib/db';

export async function GET() {
  try {
    const prefs = await readDocument('notifications');
    return Response.json({ success: true, data: prefs });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load notification preferences' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const validChannels = ['email', 'push', 'inApp', 'quietHours'];
    const invalidKeys = Object.keys(body).filter((k) => !validChannels.includes(k));

    if (invalidKeys.length > 0) {
      return Response.json(
        { success: false, error: `Invalid preference channels: ${invalidKeys.join(', ')}. Valid: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    const existing = await readDocument('notifications');
    const updated = { ...existing };

    for (const channel of validChannels) {
      if (body[channel]) {
        updated[channel] = { ...updated[channel], ...body[channel] };
      }
    }

    await writeDocument('notifications', updated);

    return Response.json({ success: true, data: updated });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
