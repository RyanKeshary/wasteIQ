/**
 * WasteIQ — Complaints API
 * GET: List complaints (filterable by status, citizenId).
 * POST: Submit a new complaint (citizen or guest).
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const citizenId = searchParams.get('citizenId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (citizenId) where.citizenId = citizenId;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          citizen: { include: { user: { select: { name: true, email: true } } } },
          bin: { select: { qrCode: true, address: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.complaint.count({ where }),
    ]);

    return apiSuccess({ complaints, total, page, pageSize: limit });
  } catch (error) {
    console.error('[API /complaints GET]', error);
    return apiError('Failed to fetch complaints', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, latitude, longitude, citizenId, binId, imageUrl } = body;

    if (!title || !description) {
      return apiError('Missing required fields: title, description');
    }

    const complaint = await prisma.complaint.create({
      data: {
        title,
        description,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        citizenId: citizenId || null,
        binId: binId || null,
        imageUrl: imageUrl || null,
        priority: 2,
      },
    });

    return apiSuccess(complaint, 201);
  } catch (error) {
    console.error('[API /complaints POST]', error);
    return apiError('Failed to create complaint', 500);
  }
}
