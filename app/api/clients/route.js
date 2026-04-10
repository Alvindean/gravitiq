// GET /api/clients — List all clients
// POST /api/clients — Create a new client

const MOCK_CLIENTS = [
  {
    id: 'cli_001',
    name: 'Marcus Chen',
    company: 'TechVault Solutions',
    email: 'marcus@techvault.io',
    status: 'active',
    revenue: 48500,
    lastActivity: '2026-04-08T14:30:00Z',
    avatarColor: '#6366F1',
  },
  {
    id: 'cli_002',
    name: 'Sarah Jennings',
    company: 'Bloom & Grow Co',
    email: 'sarah@bloomgrow.com',
    status: 'active',
    revenue: 32000,
    lastActivity: '2026-04-09T09:15:00Z',
    avatarColor: '#EC4899',
  },
  {
    id: 'cli_003',
    name: 'David Okafor',
    company: 'Pinnacle Legal Group',
    email: 'david@pinnaclelegal.com',
    status: 'active',
    revenue: 74200,
    lastActivity: '2026-04-07T16:45:00Z',
    avatarColor: '#F59E0B',
  },
  {
    id: 'cli_004',
    name: 'Emily Rodriguez',
    company: 'Coastal Wellness Spa',
    email: 'emily@coastalwellness.com',
    status: 'inactive',
    revenue: 18700,
    lastActivity: '2026-03-15T11:00:00Z',
    avatarColor: '#10B981',
  },
  {
    id: 'cli_005',
    name: 'James Whitmore',
    company: 'Apex Auto Detailing',
    email: 'james@apexauto.com',
    status: 'active',
    revenue: 29300,
    lastActivity: '2026-04-10T08:20:00Z',
    avatarColor: '#3B82F6',
  },
  {
    id: 'cli_006',
    name: 'Priya Sharma',
    company: 'Zenith Marketing',
    email: 'priya@zenithmarketing.co',
    status: 'active',
    revenue: 56800,
    lastActivity: '2026-04-06T13:30:00Z',
    avatarColor: '#8B5CF6',
  },
  {
    id: 'cli_007',
    name: 'Tommy Nguyen',
    company: 'Noodle House Kitchen',
    email: 'tommy@noodlehouse.com',
    status: 'lead',
    revenue: 0,
    lastActivity: '2026-04-09T17:00:00Z',
    avatarColor: '#EF4444',
  },
  {
    id: 'cli_008',
    name: 'Rachel Foster',
    company: 'Bright Horizons Daycare',
    email: 'rachel@brighthorizons.org',
    status: 'churned',
    revenue: 12400,
    lastActivity: '2026-02-20T10:00:00Z',
    avatarColor: '#14B8A6',
  },
];

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_CLIENTS,
    meta: { total: MOCK_CLIENTS.length },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, company, email } = body;

    if (!name || !email) {
      return Response.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EF4444', '#14B8A6'];
    const newClient = {
      id: `cli_${Date.now().toString(36)}`,
      name,
      company: company || null,
      email,
      status: body.status || 'lead',
      revenue: 0,
      lastActivity: new Date().toISOString(),
      avatarColor: colors[Math.floor(Math.random() * colors.length)],
    };

    return Response.json(
      { success: true, data: newClient },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
