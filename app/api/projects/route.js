// GET  /api/projects — List all projects
// POST /api/projects — Create a new project

const MOCK_PROJECTS = [
  {
    id: 'prj_001',
    title: 'Website Redesign',
    client: { id: 'cli_001', name: 'Marcus Chen', company: 'TechVault Solutions' },
    status: 'in-progress',
    priority: 'high',
    progress: 68,
    dueDate: '2026-05-15',
    team: ['Alvin D.', 'Jordan K.', 'Maya T.'],
    createdAt: '2026-01-10T09:00:00Z',
  },
  {
    id: 'prj_002',
    title: 'SEO Campaign Q2',
    client: { id: 'cli_001', name: 'Marcus Chen', company: 'TechVault Solutions' },
    status: 'completed',
    priority: 'medium',
    progress: 100,
    dueDate: '2026-03-31',
    team: ['Alvin D.', 'Priya S.'],
    createdAt: '2025-12-01T09:00:00Z',
  },
  {
    id: 'prj_003',
    title: 'Brand Identity Package',
    client: { id: 'cli_002', name: 'Sarah Jennings', company: 'Bloom & Grow Co' },
    status: 'in-progress',
    priority: 'high',
    progress: 42,
    dueDate: '2026-04-30',
    team: ['Maya T.', 'Jordan K.'],
    createdAt: '2026-02-15T09:00:00Z',
  },
  {
    id: 'prj_004',
    title: 'Google Ads Management',
    client: { id: 'cli_003', name: 'David Okafor', company: 'Pinnacle Legal Group' },
    status: 'in-progress',
    priority: 'medium',
    progress: 55,
    dueDate: '2026-06-30',
    team: ['Alvin D.'],
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'prj_005',
    title: 'Social Media Strategy',
    client: { id: 'cli_006', name: 'Priya Sharma', company: 'Zenith Marketing' },
    status: 'review',
    priority: 'low',
    progress: 90,
    dueDate: '2026-04-20',
    team: ['Priya S.', 'Maya T.'],
    createdAt: '2026-01-20T09:00:00Z',
  },
  {
    id: 'prj_006',
    title: 'Local SEO + GBP Optimization',
    client: { id: 'cli_005', name: 'James Whitmore', company: 'Apex Auto Detailing' },
    status: 'not-started',
    priority: 'high',
    progress: 0,
    dueDate: '2026-05-30',
    team: ['Alvin D.', 'Jordan K.'],
    createdAt: '2026-04-05T09:00:00Z',
  },
  {
    id: 'prj_007',
    title: 'Email Drip Campaign',
    client: { id: 'cli_002', name: 'Sarah Jennings', company: 'Bloom & Grow Co' },
    status: 'on-hold',
    priority: 'low',
    progress: 15,
    dueDate: '2026-07-01',
    team: ['Priya S.'],
    createdAt: '2026-03-20T09:00:00Z',
  },
];

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_PROJECTS,
    meta: { total: MOCK_PROJECTS.length },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, clientId, priority, dueDate } = body;

    if (!title) {
      return Response.json(
        { success: false, error: 'Project title is required' },
        { status: 400 }
      );
    }

    const newProject = {
      id: `prj_${Date.now().toString(36)}`,
      title,
      client: clientId
        ? { id: clientId, name: 'Unresolved Client', company: null }
        : null,
      status: 'not-started',
      priority: priority || 'medium',
      progress: 0,
      dueDate: dueDate || null,
      team: body.team || [],
      createdAt: new Date().toISOString(),
    };

    return Response.json(
      { success: true, data: newProject },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
