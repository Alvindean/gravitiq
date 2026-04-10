// GET  /api/analytics/reports — List generated reports
// POST /api/analytics/reports — Generate a new report

const MOCK_REPORTS = [
  {
    id: 'rpt_001',
    title: 'Monthly Performance Summary — March 2026',
    type: 'monthly',
    status: 'completed',
    createdAt: '2026-04-01T08:00:00Z',
    completedAt: '2026-04-01T08:02:30Z',
    downloadUrl: '/reports/rpt_001.pdf',
    size: '2.4 MB',
  },
  {
    id: 'rpt_002',
    title: 'Client Revenue Breakdown Q1 2026',
    type: 'quarterly',
    status: 'completed',
    createdAt: '2026-04-02T10:00:00Z',
    completedAt: '2026-04-02T10:05:12Z',
    downloadUrl: '/reports/rpt_002.pdf',
    size: '4.1 MB',
  },
  {
    id: 'rpt_003',
    title: 'SEO Campaign ROI Analysis',
    type: 'campaign',
    status: 'completed',
    createdAt: '2026-04-05T14:30:00Z',
    completedAt: '2026-04-05T14:33:45Z',
    downloadUrl: '/reports/rpt_003.pdf',
    size: '1.8 MB',
  },
  {
    id: 'rpt_004',
    title: 'Team Utilization Report — March 2026',
    type: 'team',
    status: 'completed',
    createdAt: '2026-04-03T09:00:00Z',
    completedAt: '2026-04-03T09:01:20Z',
    downloadUrl: '/reports/rpt_004.pdf',
    size: '890 KB',
  },
];

export async function GET() {
  return Response.json({
    success: true,
    data: MOCK_REPORTS,
    meta: { total: MOCK_REPORTS.length },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, type, range } = body;

    if (!title) {
      return Response.json(
        { success: false, error: 'Report title is required' },
        { status: 400 }
      );
    }

    const report = {
      id: `rpt_${Date.now().toString(36)}`,
      title,
      type: type || 'custom',
      range: range || '30d',
      status: 'processing',
      createdAt: new Date().toISOString(),
      completedAt: null,
      downloadUrl: null,
      estimatedTime: '2-5 minutes',
    };

    return Response.json(
      { success: true, data: report },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
