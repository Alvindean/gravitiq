// GET  /api/activities — List all activities
// POST /api/activities — Create a new activity

import { readCollection, insertOne } from '@/app/lib/db';

export async function GET() {
  try {
    const activities = await readCollection('activities');
    const sorted = activities.sort(
      (a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)
    );
    return Response.json({
      success: true,
      data: sorted,
      meta: { total: sorted.length },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load activities' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const activity = {
      ...body,
      id: 'act' + Date.now(),
      timestamp: new Date().toISOString(),
    };

    const saved = await insertOne('activities', activity);

    return Response.json(
      { success: true, data: saved },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
