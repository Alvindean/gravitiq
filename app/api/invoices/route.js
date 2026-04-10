// GET  /api/invoices — List invoices with optional filters
// POST /api/invoices — Create a new invoice

import { readCollection, insertOne } from '@/app/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const allInvoices = await readCollection('invoices');
    let invoices = [...allInvoices];

    if (status) {
      invoices = invoices.filter((inv) => inv.status === status);
    }
    if (clientId) {
      invoices = invoices.filter((inv) => inv.client?.id === clientId);
    }

    const summary = {
      totalOutstanding: allInvoices
        .filter((i) => i.status === 'pending' || i.status === 'overdue')
        .reduce((s, i) => s + (i.total || 0), 0),
      totalPaid: allInvoices
        .filter((i) => i.status === 'paid')
        .reduce((s, i) => s + (i.total || 0), 0),
      overdueCount: allInvoices.filter((i) => i.status === 'overdue').length,
    };

    return Response.json({
      success: true,
      data: invoices,
      meta: { total: invoices.length, summary },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load invoices' },
      { status: 500 }
    );
  }
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

    const allInvoices = await readCollection('invoices');
    const amount = items.reduce((sum, item) => sum + (item.amount || item.rate * (item.quantity || 1)), 0);
    const tax = Math.round(amount * 0.08 * 100) / 100;

    const invoice = {
      id: 'inv_' + Date.now().toString(36),
      number: `INV-2026-${String(allInvoices.length + 1).padStart(3, '0')}`,
      client: { id: clientId, name: body.clientName || 'Unresolved Client', company: body.clientCompany || null },
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

    const saved = await insertOne('invoices', invoice);

    return Response.json(
      { success: true, data: saved },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
