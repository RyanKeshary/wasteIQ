/**
 * WasteIQ — Telemetry Ingestion API
 * POST: Receives IoT sensor data, updates bin fill level, recalculates priority.
 * Triggers alerts for overflow/critical states.
 */
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { calculatePriority, determineBinStatus } from '@/lib/priority-engine';

export async function POST(request: NextRequest) {
  try {
    // Simple IoT auth via master key
    const authHeader = request.headers.get('x-iot-key');
    if (authHeader !== process.env.IOT_MASTER_KEY) {
      return apiError('Unauthorized — invalid IoT key', 401);
    }

    const body = await request.json();
    const { binId, fillLevel, weight, temperature, humidity, batteryLevel } = body;

    if (!binId || fillLevel === undefined) {
      return apiError('Missing required fields: binId, fillLevel');
    }

    // 1. Log telemetry
    const telemetry = await prisma.binTelemetry.create({
      data: {
        binId,
        fillLevel: parseFloat(fillLevel),
        weight: weight ? parseFloat(weight) : null,
        temperature: temperature ? parseFloat(temperature) : null,
        humidity: humidity ? parseFloat(humidity) : null,
        batteryLevel: batteryLevel ? parseFloat(batteryLevel) : null,
      },
    });

    // 2. Fetch bin with zone for priority calculation
    const bin = await prisma.bin.findUnique({
      where: { id: binId },
      include: { zone: true },
    });

    if (!bin) {
      return apiError('Bin not found', 404);
    }

    // 3. Calculate new priority score
    const priorityScore = calculatePriority({
      fillLevel: parseFloat(fillLevel),
      sensorHealth: batteryLevel ? parseFloat(batteryLevel) > 10 : true,
      lastCollectedAt: bin.lastCollectedAt,
      zoneWeight: bin.zone.locationWeight,
    });

    // 4. Determine new status
    const status = determineBinStatus(parseFloat(fillLevel));

    // 5. Update bin
    await prisma.bin.update({
      where: { id: binId },
      data: {
        currentFill: parseFloat(fillLevel),
        priorityScore,
        status,
        sensorHealth: batteryLevel ? parseFloat(batteryLevel) > 10 : bin.sensorHealth,
      },
    });

    // 6. Generate alert if critical
    if (status === 'OVERFLOW' || status === 'CRITICAL') {
      await prisma.alert.create({
        data: {
          type: status === 'OVERFLOW' ? 'OVERFLOW' : 'CRITICAL_FILL',
          message: `Bin ${bin.qrCode} in ${bin.zone.name} — fill level ${fillLevel}%`,
          binId: bin.id,
          zoneId: bin.zoneId,
          severity: status === 'OVERFLOW' ? 1 : 2,
        },
      });
    }

    return apiSuccess({ telemetry, priorityScore, status }, 201);
  } catch (error) {
    console.error('[API /telemetry POST]', error);
    return apiError('Failed to process telemetry', 500);
  }
}
