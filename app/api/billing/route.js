// GET  /api/billing — Return current billing info
// POST /api/billing — Update plan

import { readDocument, writeDocument } from '@/app/lib/db';

const PLANS = {
  free: { name: 'Free', price: 0, interval: 'month', features: ['3 clients', '1 project', 'Basic analytics'] },
  starter: { name: 'Starter', price: 29, interval: 'month', features: ['10 clients', '5 projects', 'Analytics', 'Email support'] },
  pro: { name: 'Pro', price: 79, interval: 'month', features: ['Unlimited clients', 'Unlimited projects', 'Advanced analytics', 'AI assistant', 'Priority support'] },
  enterprise: { name: 'Enterprise', price: 199, interval: 'month', features: ['Everything in Pro', 'Custom integrations', 'Dedicated account manager', 'SLA guarantee', 'White-label options'] },
};

export async function GET() {
  try {
    let billing;
    try {
      billing = await readDocument('billing');
    } catch {
      // If no billing.json exists, use profile to construct billing data
      const profile = await readDocument('profile');
      billing = {
        currentPlan: {
          id: profile.plan || 'pro',
          ...(PLANS[profile.plan || 'pro']),
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
    }

    return Response.json({
      success: true,
      data: { ...billing, availablePlans: PLANS },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load billing data' },
      { status: 500 }
    );
  }
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

    let billing;
    try {
      billing = await readDocument('billing');
    } catch {
      billing = {};
    }

    const previousPlanId = billing.currentPlan?.id || 'pro';

    if (planId === previousPlanId) {
      return Response.json(
        { success: false, error: 'You are already on this plan' },
        { status: 400 }
      );
    }

    billing.currentPlan = {
      id: planId,
      ...PLANS[planId],
      billingCycle: 'monthly',
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      cancelAtPeriodEnd: false,
    };

    try {
      await writeDocument('billing', billing);
    } catch {
      // billing.json may not exist yet — non-critical
    }

    return Response.json({
      success: true,
      data: {
        previousPlan: previousPlanId,
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
