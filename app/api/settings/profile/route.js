// GET /api/settings/profile — Return user profile
// PUT /api/settings/profile — Update profile fields

const MOCK_PROFILE = {
  id: 'usr_1a2b3c4d',
  name: 'Alvin Dean',
  email: 'alvin@nuwavmedia.com',
  phone: '+1 (555) 012-3456',
  company: 'NuWav Media',
  jobTitle: 'CEO & Founder',
  timezone: 'America/Chicago',
  language: 'en',
  avatar: null,
  bio: 'Building the future of local business marketing with AI-powered tools.',
  website: 'https://nuwavmedia.com',
  socialLinks: {
    linkedin: 'https://linkedin.com/in/alvindean',
    twitter: 'https://x.com/alvindean',
    instagram: null,
  },
  createdAt: '2025-08-12T10:00:00Z',
  updatedAt: '2026-04-05T14:30:00Z',
};

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_PROFILE,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json();

    // Prevent overwriting protected fields
    const protectedFields = ['id', 'createdAt'];
    for (const field of protectedFields) {
      if (field in body) {
        return Response.json(
          { success: false, error: `Cannot modify protected field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const updated = {
      ...MOCK_PROFILE,
      ...body,
      id: MOCK_PROFILE.id,
      createdAt: MOCK_PROFILE.createdAt,
      updatedAt: new Date().toISOString(),
    };

    return Response.json({
      success: true,
      data: updated,
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
