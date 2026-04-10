/**
 * WasteIQ — Dashboard Overview API
 * GET: Returns aggregate stats for the admin dashboard.
 */
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function GET() {
  try {
    const [
      totalBins,
      overflowBins,
      criticalBins,
      totalDrivers,
      activeDrivers,
      complaintsToday,
      allBins,
    ] = await Promise.all([
      prisma.bin.count(),
      prisma.bin.count({ where: { status: 'OVERFLOW' } }),
      prisma.bin.count({ where: { status: 'CRITICAL' } }),
      prisma.driver.count(),
      prisma.driver.count({ where: { isActive: true } }),
      prisma.complaint.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.bin.findMany({ select: { currentFill: true } }),
    ]);

    const avgFillLevel =
      allBins.length > 0
        ? Math.round(
            (allBins.reduce((sum, b) => sum + b.currentFill, 0) / allBins.length) * 100
          ) / 100
        : 0;

    const collectionRate =
      totalBins > 0
        ? Math.round(((totalBins - overflowBins) / totalBins) * 10000) / 100
        : 100;

    return apiSuccess({
      totalBins,
      overflowBins,
      criticalBins,
      avgFillLevel,
      totalDrivers,
      activeDrivers,
      complaintsToday,
      collectionRate,
    });
  } catch (error) {
    console.error('[API /dashboard GET]', error);
    return apiError('Failed to fetch dashboard data', 500);
  }
}
