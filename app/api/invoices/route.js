// GET  /api/invoices — List invoices with optional filters
// POST /api/invoices — Create a new invoice

const MOCK_INVOICES = [
  {
    id: 'inv_001',
    number: 'INV-2026-001',
    client: { id: 'cli_003', name: 'David Okafor', company: 'Pinnacle Legal Group' },
    amount: 4500,
    tax: 360,
    total: 4860,
    status: 'paid',
    issuedDate: '2026-03-01',
    dueDate: '2026-03-31',
    paidDate: '2026-03-28',
    items: [
      { description: 'Google Ads Management — March', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'Landing Page Design', quantity: 2, rate: 1000, amount: 2000 },
    ],
  },
  {
    id: 'inv_002',
    number: 'INV-2026-002',
    client: { id: 'cli_001', name: 'Marcus Chen', company: 'TechVault Solutions' },
    amount: 6200,
    tax: 496,
    total: 6696,
    status: 'paid',
    issuedDate: '2026-03-05',
    dueDate: '2026-04-04',
    paidDate: '2026-04-01',
    items: [
      { description: 'Website Redesign — Phase 2', quantity: 1, rate: 4200, amount: 4200 },
      { description: 'SEO Retainer — March', quantity: 1, rate: 2000, amount: 2000 },
    ],
  },
  {
    id: 'inv_003',
    number: 'INV-2026-003',
    client: { id: 'cli_006', name: 'Priya Sharma', company: 'Zenith Marketing' },
    amount: 3800,
    tax: 304,
    total: 4104,
    status: 'pending',
    issuedDate: '2026-04-01',
    dueDate: '2026-05-01',
    paidDate: null,
    items: [
      { description: 'Social Media Strategy Consulting', quantity: 1, rate: 2300, amount: 2300 },
      { description: 'Content Calendar Creation', quantity: 1, rate: 1500, amount: 1500 },
    ],
  },
  {
    id: 'inv_004',
    number: 'INV-2026-004',
    client: { id: 'cli_002', name: 'Sarah Jennings', company: 'Bloom & Grow Co' },
    amount: 5500,
    tax: 440,
    total: 5940,
    status: 'pending',
    issuedDate: '2026-04-05',
    dueDate: '2026-05-05',
    paidDate: null,
    items: [
      { description: 'Brand Identity Package — Phase 1', quantity: 1, rate: 3500, amount: 3500 },
      { description: 'Logo Variations & Style Guide', quantity: 1, rate: 2000, amount: 2000 },
    ],
  },
  {
    id: 'inv_005',
    number: 'INV-2026-005',
    client: { id: 'cli_005', name: 'James Whitmore', company: 'Apex Auto Detailing' },
    amount: 1800,
    tax: 144,
    total: 1944,
    status: 'draft',
    issuedDate: null,
    dueDate: null,
    paidDate: null,
    items: [
      { description: 'Local SEO Audit', quantity: 1, rate: 800, amount: 800 },
      { description: 'GBP Optimization', quantity: 1, rate: 1000, amount: 1000 },
    ],
  },
  {
    id: 'inv_006',
    number: 'INV-2026-006',
    client: { id: 'cli_004', name: 'Emily Rodriguez', company: 'Coastal Wellness Spa' },
    amount: 2200,
    tax: 176,
    total: 2376,
    status: 'overdue',
    issuedDate: '2026-02-15',
    dueDate: '2026-03-15',
    paidDate: null,
    items: [
      { description: 'Website Maintenance — Feb', quantity: 1, rate: 700, amount: 700 },
      { description: 'Email Campaign Setup', quantity: 1, rate: 1500, amount: 1500 },
    ],
  },
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const clientId = searchParams.get('clientId');

  let invoices = [...MOCK_INVOICES];

  if (status) {
    invoices = invoices.filter((inv) => inv.status === status);
  }
  if (clientId) {
    invoices = invoices.filter((inv) => inv.client.id === clientId);
  }

  const summary = {
    totalOutstanding: MOCK_INVOICES.filter((i) => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.total, 0),
    totalPaid: MOCK_INVOICES.filter((i) => i.status === 'paid').reduce((s, i) => s + i.total, 0),
    overdueCount: MOCK_INVOICES.filter((i) => i.status === 'overdue').length,
  };

  return Response.json({
    success: true,
    data: invoices,
    meta: { total: invoices.length, summary },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { clientId, items, dueDate } = body;

    if (!clientId) {
      return Response.json(
        { success: false, error: 'clientId is required' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json(
        { success: false, error: 'At least one line item is required' },
        { status: 400 }
      );
    }

    const amount = items.reduce((sum, item) => sum + (item.amount || item.rate * (item.quantity || 1)), 0);
    const tax = Math.round(amount * 0.08 * 100) / 100;

    const invoice = {
      id: `inv_${Date.now().toString(36)}`,
      number: `INV-2026-${String(MOCK_INVOICES.length + 1).padStart(3, '0')}`,
      client: { id: clientId, name: 'Unresolved Client', company: null },
      amount,
      tax,
      total: amount + tax,
      status: 'draft',
      issuedDate: null,
      dueDate: dueDate || null,
      paidDate: null,
      items,
      createdAt: new Date().toISOString(),
    };

    return Response.json(
      { success: true, data: invoice },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
