// POST /api/auth/login — Authenticate user with email/password
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    // Mock credential check — accept any well-formed input except this specific combo
    if (email === 'blocked@example.com') {
      return Response.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const user = {
      id: 'usr_1a2b3c4d',
      name: 'Alvin Dean',
      email,
      role: 'owner',
      avatar: null,
      company: 'NuWav Media',
      plan: 'pro',
      createdAt: '2025-08-12T10:00:00Z',
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
