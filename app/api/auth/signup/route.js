// POST /api/auth/signup — Register a new user

import { readDocument, writeDocument } from '@/app/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    const errors = [];
    if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (errors.length > 0) {
      return Response.json(
        { success: false, error: errors.join('. ') },
        { status: 400 }
      );
    }

    // Check if profile email already matches (mock duplicate check)
    const profile = await readDocument('profile');
    if (profile.email === email) {
      return Response.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const userId = 'usr_' + Date.now().toString(36);
    const now = new Date().toISOString();

    // Update profile with new user data
    const updatedProfile = {
      ...profile,
      id: userId,
      name: name.trim(),
      email,
      plan: 'free',
      createdAt: now,
      updatedAt: now,
    };
    await writeDocument('profile', updatedProfile);

    const user = {
      id: userId,
      name: name.trim(),
      email,
      role: 'owner',
      avatar: null,
      company: updatedProfile.company || null,
      plan: 'free',
      createdAt: now,
    };

    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ sub: user.id, email: user.email, iat: Date.now() })) +
      '.mock-signature';

    return Response.json(
      { success: true, data: { user, token, expiresIn: 86400 } },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
