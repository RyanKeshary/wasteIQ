/**
 * WasteIQ — Alerts API
 * GET: List alerts (filterable by type, resolved status).
 * PATCH: Resolve an alert.
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: Record<string, unknown> = {};
    if (type) where.type = type;
    if (resolved !== null) where.isResolved = resolved === 'true';

    const alerts = await prisma.alert.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return apiSuccess(alerts);
  } catch (error) {
    console.error('[API /alerts GET]', error);
    return apiError('Failed to fetch alerts', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { alertId } = body;

    if (!alertId) {
      return apiError('Missing alertId');
    }

    const alert = await prisma.alert.update({
      where: { id: alertId },
      data: {
        isResolved: true,
        resolvedAt: new Date(),
      },
    });

    return apiSuccess(alert);
  } catch (error) {
    console.error('[API /alerts PATCH]', error);
    return apiError('Failed to resolve alert', 500);
  }
}
