// POST /api/auth/login — Authenticate user with email/password

import { readDocument } from '@/app/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return Response.json(
        { success: false, error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const profile = await readDocument('profile');

    // Check if email matches the profile (mock auth)
    if (email !== profile.email) {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      role: 'owner',
      avatar: profile.avatar || null,
      company: profile.company,
      plan: profile.plan || 'pro',
      createdAt: profile.createdAt,
    };

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ sub: user.id, email: user.email, iat: Date.now() })) +
      '.mock-signature';

    return Response.json({
      success: true,
      data: { user, token, expiresIn: 86400 },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
