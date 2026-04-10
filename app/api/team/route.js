// GET    /api/team — List team members
// POST   /api/team — Invite a new member
// DELETE /api/team — Remove a member

import { readCollection, insertOne, deleteOne } from '@/app/lib/db';

export async function GET() {
  try {
    const team = await readCollection('team');
    return Response.json({
      success: true,
      data: team,
      meta: {
        total: team.length,
        active: team.filter((m) => m.status === 'active').length,
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load team members' },
      { status: 500 }
    );
  }
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

    const team = await readCollection('team');
    if (team.some((m) => m.email === email)) {
      return Response.json(
        { success: false, error: 'This email is already on the team' },
        { status: 409 }
      );
    }

    const invitation = {
      id: 'usr_' + Date.now().toString(36),
      name: body.name || null,
      email,
      role: role || 'member',
      status: 'invited',
      avatarColor: '#94A3B8',
      joinedAt: null,
      lastActive: null,
      invitedAt: new Date().toISOString(),
    };

    const saved = await insertOne('team', invitation);

    return Response.json(
      { success: true, data: saved, message: `Invitation sent to ${email}` },
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

    const team = await readCollection('team');
    const member = team.find((m) => m.id === memberId);

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

    await deleteOne('team', memberId);

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
