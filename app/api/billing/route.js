// GET  /api/billing — Return current billing info
// POST /api/billing — Update plan

const PLANS = {
  free: { name: 'Free', price: 0, interval: 'month', features: ['3 clients', '1 project', 'Basic analytics'] },
  starter: { name: 'Starter', price: 29, interval: 'month', features: ['10 clients', '5 projects', 'Analytics', 'Email support'] },
  pro: { name: 'Pro', price: 79, interval: 'month', features: ['Unlimited clients', 'Unlimited projects', 'Advanced analytics', 'AI assistant', 'Priority support'] },
  enterprise: { name: 'Enterprise', price: 199, interval: 'month', features: ['Everything in Pro', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'White-label options'] },
};

const MOCK_BILLING = {
  currentPlan: {
    id: 'pro',
    ...PLANS.pro,
    billingCycle: 'monthly',
    nextBillingDate: '2026-05-10',
    cancelAtPeriodEnd: false,
  },
  usage: {
    clients: { used: 8, limit: null },
    projects: { used: 7, limit: null },
    aiCredits: { used: 2340, limit: 5000 },
    storage: { used: 1.2, limit: 10, unit: 'GB' },
    teamMembers: { used: 4, limit: 10 },
  },
  paymentMethod: {
    type: 'card',
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2027,
  },
  billingHistory: [
    { id: 'inv_b001', date: '2026-04-10', amount: 79, status: 'paid', description: 'Pro Plan — April 2026' },
    { id: 'inv_b002', date: '2026-03-10', amount: 79, status: 'paid', description: 'Pro Plan — March 2026' },
    { id: 'inv_b003', date: '2026-02-10', amount: 79, status: 'paid', description: 'Pro Plan — February 2026' },
    { id: 'inv_b004', date: '2026-01-10', amount: 79, status: 'paid', description: 'Pro Plan — January 2026' },
    { id: 'inv_b005', date: '2025-12-10', amount: 29, status: 'paid', description: 'Starter Plan — December 2025' },
  ],
};

export async function GET() {
  return Response.json({
    success: true,
    data: { ...MOCK_BILLING, availablePlans: PLANS },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { planId } = body;

    if (!planId) {
      return Response.json(
        { success: false, error: 'planId is required' },
        { status: 400 }
      );
    }

    if (!PLANS[planId]) {
      return Response.json(
        { success: false, error: `Invalid plan. Choose from: ${Object.keys(PLANS).join(', ')}` },
        { status: 400 }
      );
    }

    if (planId === MOCK_BILLING.currentPlan.id) {
      return Response.json(
        { success: false, error: 'You are already on this plan' },
        { status: 400 }
      );
    }

    return Response.json({
      success: true,
      data: {
        previousPlan: MOCK_BILLING.currentPlan.id,
        newPlan: { id: planId, ...PLANS[planId] },
        effectiveDate: new Date().toISOString(),
        message: `Successfully switched to the ${PLANS[planId].name} plan.`,
      },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
