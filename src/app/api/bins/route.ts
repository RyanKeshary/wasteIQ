/**
 * WasteIQ — Bins API
 * GET: List all bins with zone relations, filterable by status/zone.
 * POST: Register a new bin (Admin only).
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const zoneId = searchParams.get('zoneId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const sortBy = searchParams.get('sortBy') || 'priorityScore';
    const order = searchParams.get('order') || 'desc';

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (zoneId) where.zoneId = zoneId;

    const [bins, total] = await Promise.all([
      prisma.bin.findMany({
        where,
        include: { zone: true },
        orderBy: { [sortBy]: order },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.bin.count({ where }),
    ]);

    return apiSuccess({
      bins,
      total,
      page,
      pageSize: limit,
    });
  } catch (error) {
    console.error('[API /bins GET]', error);
    return apiError('Failed to fetch bins', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { qrCode, latitude, longitude, address, zoneId, type, capacity } = body;

    if (!qrCode || !latitude || !longitude || !address || !zoneId) {
      return apiError('Missing required fields: qrCode, latitude, longitude, address, zoneId');
    }

    const bin = await prisma.bin.create({
      data: {
        qrCode,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address,
        zoneId,
        type: type || 'MIXED',
        capacity: capacity ? parseFloat(capacity) : 100,
      },
      include: { zone: true },
    });

    return apiSuccess(bin, 201);
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return apiError('A bin with this QR code already exists', 409);
    }
    console.error('[API /bins POST]', error);
    return apiError('Failed to create bin', 500);
  }
}
