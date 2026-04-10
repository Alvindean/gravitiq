// GET /api/settings/notifications — Return notification preferences
// PUT /api/settings/notifications — Update preferences

const MOCK_PREFERENCES = {
  email: {
    newClient: true,
    projectUpdates: true,
    invoicePaid: true,
    weeklyDigest: true,
    marketingTips: false,
    teamActivity: true,
    securityAlerts: true,
  },
  push: {
    newClient: true,
    projectUpdates: false,
    invoicePaid: true,
    messages: true,
    teamActivity: false,
    securityAlerts: true,
  },
  inApp: {
    newClient: true,
    projectUpdates: true,
    invoicePaid: true,
    messages: true,
    teamActivity: true,
    aiCompleted: true,
    securityAlerts: true,
  },
  quietHours: {
    enabled: true,
    start: '22:00',
    end: '07:00',
    timezone: 'America/Chicago',
  },
};

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_PREFERENCES,
  });
}

export async function PUT(request) {
  try {
    const body = await request.json();

    const validChannels = ['email', 'push', 'inApp', 'quietHours'];
    const invalidKeys = Object.keys(body).filter((k) => !validChannels.includes(k));

    if (invalidKeys.length > 0) {
      return Response.json(
        { success: false, error: `Invalid preference channels: ${invalidKeys.join(', ')}. Valid: ${validChannels.join(', ')}` },
        { status: 400 }
      );
    }

    const updated = { ...MOCK_PREFERENCES };
    for (const channel of validChannels) {
      if (body[channel]) {
        updated[channel] = { ...updated[channel], ...body[channel] };
      }
    }

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
