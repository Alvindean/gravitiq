// GET /api/revenue — List all revenue entries

import { readCollection } from '@/app/lib/db';

export async function GET() {
  try {
    const revenue = await readCollection('revenue');
    return Response.json({
      success: true,
      data: revenue,
      meta: { total: revenue.length },
    });
  } catch {
    return Response.json(
      { success: false, error: 'Failed to load revenue data' },
      { status: 500 }
    );
  }
}
