// GET    /api/team — List team members
// POST   /api/team — Invite a new member
// DELETE /api/team — Remove a member

const MOCK_TEAM = [
  {
    id: 'usr_1a2b3c4d',
    name: 'Alvin Dean',
    email: 'alvin@nuwavmedia.com',
    role: 'owner',
    status: 'active',
    avatarColor: '#6366F1',
    joinedAt: '2025-08-12T10:00:00Z',
    lastActive: '2026-04-10T09:00:00Z',
  },
  {
    id: 'usr_2b3c4d5e',
    name: 'Jordan Kim',
    email: 'jordan@nuwavmedia.com',
    role: 'admin',
    status: 'active',
    avatarColor: '#EC4899',
    joinedAt: '2025-09-01T09:00:00Z',
    lastActive: '2026-04-10T08:30:00Z',
  },
  {
    id: 'usr_3c4d5e6f',
    name: 'Maya Torres',
    email: 'maya@nuwavmedia.com',
    role: 'member',
    status: 'active',
    avatarColor: '#10B981',
    joinedAt: '2025-10-15T09:00:00Z',
    lastActive: '2026-04-09T17:45:00Z',
  },
  {
    id: 'usr_4d5e6f7g',
    name: 'Priya Sundaram',
    email: 'priya@nuwavmedia.com',
    role: 'member',
    status: 'active',
    avatarColor: '#F59E0B',
    joinedAt: '2026-01-05T09:00:00Z',
    lastActive: '2026-04-10T07:15:00Z',
  },
  {
    id: 'usr_5e6f7g8h',
    name: 'Chris Lawson',
    email: 'chris@nuwavmedia.com',
    role: 'member',
    status: 'invited',
    avatarColor: '#3B82F6',
    joinedAt: null,
    lastActive: null,
    invitedAt: '2026-04-08T12:00:00Z',
  },
];

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_TEAM,
    meta: { total: MOCK_TEAM.length, active: MOCK_TEAM.filter((m) => m.status === 'active').length },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return Response.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'member', 'viewer'];
    if (role && !validRoles.includes(role)) {
      return Response.json(
        { success: false, error: `Invalid role. Choose from: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    // Check for duplicate
    if (MOCK_TEAM.some((m) => m.email === email)) {
      return Response.json(
        { success: false, error: 'This email is already on the team' },
        { status: 409 }
      );
    }

    const invitation = {
      id: `usr_${Date.now().toString(36)}`,
      name: null,
      email,
      role: role || 'member',
      status: 'invited',
      avatarColor: '#94A3B8',
      joinedAt: null,
      lastActive: null,
      invitedAt: new Date().toISOString(),
    };

    return Response.json(
      { success: true, data: invitation, message: `Invitation sent to ${email}` },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('memberId');

    if (!memberId) {
      return Response.json(
        { success: false, error: 'memberId query parameter is required' },
        { status: 400 }
      );
    }

    const member = MOCK_TEAM.find((m) => m.id === memberId);
    if (!member) {
      return Response.json(
        { success: false, error: 'Team member not found' },
        { status: 404 }
      );
    }

    if (member.role === 'owner') {
      return Response.json(
        { success: false, error: 'Cannot remove the account owner' },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      data: { removedId: memberId, message: `${member.name || member.email} has been removed from the team` },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
