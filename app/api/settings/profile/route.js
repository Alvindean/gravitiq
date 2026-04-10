// GET /api/settings/profile — Return user profile
// PUT /api/settings/profile — Update profile fields

import { readDocument, writeDocument } from '@/app/lib/db';

export async function GET() {
  try {
    const profile = await readDocument('profile');
    return Response.json({ success: true, data: profile });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load profile' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // Prevent overwriting protected fields
    const protectedFields = ['id', 'createdAt'];
    for (const field of protectedFields) {
      if (field in body) {
        return Response.json(
          { success: false, error: `Cannot modify protected field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const existing = await readDocument('profile');
    const updated = {
      ...existing,
      ...body,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    await writeDocument('profile', updated);

    return Response.json({ success: true, data: updated });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
