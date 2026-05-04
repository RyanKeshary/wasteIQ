/**
 * WasteIQ — Bin Scan Logging API
 * Used by drivers to log collection actions via QR or OCR.
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';

export async function POST(request: NextRequest) {
  try {
    const { qrCode, driverId, action, latitude, longitude, scanMethod } = await request.json();

    if (!qrCode || !driverId || !action) {
      return apiError('Missing required fields: qrCode, driverId, action', 400);
    }

    // Find the bin
    const bin = await prisma.bin.findUnique({
      where: { qrCode }
    });

    if (!bin) {
      return apiError(`Bin with code ${qrCode} not found`, 404);
    }

    // Create scan log
    const scanLog = await prisma.scanLog.create({
      data: {
        binId: bin.id,
        driverId,
        action,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        scanMethod: scanMethod || 'QR'
      }
    });

    // Update bin status if pickup complete
    if (action === 'PICKUP_COMPLETE') {
      await prisma.bin.update({
        where: { id: bin.id },
        data: {
          currentFill: 0,
          lastCollectedAt: new Date(),
          status: 'NORMAL'
        }
      });
    }

    return apiSuccess({
      message: 'Scan logged successfully',
      scanLog,
      bin
    });
  } catch (error) {
    console.error('[API /bins/scan POST]', error);
    return apiError('Failed to log scan', 500);
  }
}
