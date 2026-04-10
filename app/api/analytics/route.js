// GET /api/analytics — Return analytics data for a given time range

function generateTimeSeries(days, baseValue, variance) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const value = Math.round(baseValue + (Math.random() - 0.4) * variance);
    data.push({ date: date.toISOString().split('T')[0], value: Math.max(0, value) });
  }
  return data;
}

function getAnalytics(range) {
  const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
  const days = daysMap[range] || 30;

  const revenue = generateTimeSeries(days, 1200, 800);
  const clients = generateTimeSeries(days, 3, 4);

  const totalRevenue = revenue.reduce((sum, d) => sum + d.value, 0);
  const totalNewClients = clients.reduce((sum, d) => sum + d.value, 0);

  return {
    revenue,
    clients,
    kpis: {
      totalRevenue,
      totalNewClients,
      avgProjectValue: Math.round(totalRevenue / Math.max(totalNewClients, 1)),
      conversionRate: +(Math.random() * 5 + 12).toFixed(1),
      churnRate: +(Math.random() * 2 + 1.5).toFixed(1),
      mrr: Math.round(totalRevenue / (days / 30)),
      activeProjects: Math.floor(Math.random() * 5 + 8),
      avgResponseTime: `${Math.floor(Math.random() * 3 + 1)}h ${Math.floor(Math.random() * 59)}m`,
    },
    topClients: [
      { id: 'cli_003', name: 'David Okafor', company: 'Pinnacle Legal Group', revenue: 74200 },
      { id: 'cli_006', name: 'Priya Sharma', company: 'Zenith Marketing', revenue: 56800 },
      { id: 'cli_001', name: 'Marcus Chen', company: 'TechVault Solutions', revenue: 48500 },
      { id: 'cli_002', name: 'Sarah Jennings', company: 'Bloom & Grow Co', revenue: 32000 },
      { id: 'cli_005', name: 'James Whitmore', company: 'Apex Auto Detailing', revenue: 29300 },
    ],
    topSources: [
      { source: 'Google Ads', leads: 42, revenue: 38400 },
      { source: 'Organic Search', leads: 35, revenue: 29100 },
      { source: 'Referrals', leads: 28, revenue: 44200 },
      { source: 'Social Media', leads: 19, revenue: 12300 },
      { source: 'Direct', leads: 11, revenue: 8700 },
    ],
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const range = searchParams.get('range') || '30d';

  const validRanges = ['7d', '30d', '90d', '1y'];
  if (!validRanges.includes(range)) {
    return Response.json(
      { success: false, error: `Invalid range. Use one of: ${validRanges.join(', ')}` },
      { status: 400 }
    );
  }

  return Response.json({
    success: true,
    data: getAnalytics(range),
    meta: { range },
  });
}
