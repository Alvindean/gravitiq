// GET  /api/clients/:id — Fetch single client
// PUT  /api/clients/:id — Update client
// DELETE /api/clients/:id — Remove client

import { findById, updateOne, deleteOne } from '@/app/lib/db';

export async function GET(request, { params }) {
  const { id } = await params;

  try {
    const client = await findById('clients', id);
    if (!client) {
      return Response.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: client });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  try {
    const body = await request.json();
    const updated = await updateOne('clients', id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    if (!updated) {
      return Response.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }
    return Response.json({ success: true, data: updated });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  try {
    await deleteOne('clients', id);
    return new Response(null, { status: 204 });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to delete client' },
      { status: 500 }
    );
  }
}
