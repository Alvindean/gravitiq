// GET  /api/clients/:id — Fetch single client
// PUT  /api/clients/:id — Update client
// DELETE /api/clients/:id — Remove client

function getMockClient(id) {
  return {
    id,
    name: 'Marcus Chen',
    company: 'TechVault Solutions',
    email: 'marcus@techvault.io',
    phone: '+1 (415) 555-0182',
    status: 'active',
    revenue: 48500,
    lastActivity: '2026-04-08T14:30:00Z',
    avatarColor: '#6366F1',
    address: '742 Innovation Blvd, San Francisco, CA 94107',
    notes: 'Interested in expanding digital marketing services. Follow up after Q2 review.',
    tags: ['high-value', 'tech', 'san-francisco'],
    createdAt: '2025-06-15T09:00:00Z',
    projects: [
      { id: 'prj_001', title: 'Website Redesign', status: 'in-progress' },
      { id: 'prj_002', title: 'SEO Campaign', status: 'completed' },
    ],
  };
}

export async function GET(request, { params }) {
  const { id } = await params;

  if (!id) {
    return Response.json(
      { success: false, error: 'Client ID is required' },
      { status: 400 }
    );
  }

  // Mock: treat "not_found" as a missing client
  if (id === 'not_found') {
    return Response.json(
      { success: false, error: 'Client not found' },
      { status: 404 }
    );
  }

  return Response.json({ success: true, data: getMockClient(id) });
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (id === 'not_found') {
    return Response.json(
      { success: false, error: 'Client not found' },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const existing = getMockClient(id);
    const updated = { ...existing, ...body, id, updatedAt: new Date().toISOString() };

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

  if (id === 'not_found') {
    return Response.json(
      { success: false, error: 'Client not found' },
      { status: 404 }
    );
  }

  return new Response(null, { status: 204 });
}
