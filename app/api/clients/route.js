// GET /api/clients — List all clients
// POST /api/clients — Create a new client

import { readCollection, insertOne } from '@/app/lib/db';

export async function GET() {
  try {
    const clients = await readCollection('clients');
    const sorted = clients.sort(
      (a, b) => new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0)
    );
    return Response.json({
      success: true,
      data: sorted,
      meta: { total: sorted.length },
    });
  } catch (err) {
    return Response.json(
      { success: false, error: 'Failed to load clients' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email } = body;

    if (!name || !company || !email) {
      return Response.json(
        { success: false, error: 'Name, company, and email are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6'];
    const newClient = {
      id: 'c' + Date.now(),
      name,
      company,
      email,
      status: body.status || 'lead',
      revenue: 0,
      lastActivity: new Date().toISOString(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date().toISOString(),
    };

    const saved = await insertOne('clients', newClient);

    // Also insert an activity record
    try {
      await insertOne('activities', {
        id: 'act' + Date.now(),
        type: 'client_added',
        description: `New client added: ${name} (${company})`,
        entityType: 'client',
        entityId: saved.id,
        timestamp: new Date().toISOString(),
      });
    } catch {
      // Non-critical — don't fail the client creation
    }

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
