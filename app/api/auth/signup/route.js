// POST /api/auth/signup — Register a new user
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

    // Mock: pretend this email is already taken
    if (email === 'taken@example.com') {
      return Response.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    const userId = `usr_${Date.now().toString(36)}`;
    const user = {
      id: userId,
      name: name.trim(),
      email,
      role: 'owner',
      avatar: null,
      company: null,
      plan: 'free',
      createdAt: new Date().toISOString(),
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
