/**
 * Smart Priority Engine
 * AI-powered bin urgency scoring — updated on every telemetry event + 5min cron.
 *
 * Formula: (fillScore×70 + timeScore×20 + healthPenalty) × zoneWeight
 * Capped at 100.
 */
import { prisma } from './prisma';
import type { ZoneType } from '@/types';

const ZONE_WEIGHTS: Record<ZoneType, number> = {
  HOSPITAL: 2.0,
  MARKET: 1.8,
  COMMERCIAL: 1.5,
  COASTAL: 1.4,
  SCHOOL: 1.3,
  RESIDENTIAL: 1.0,
  INDUSTRIAL: 0.9,
};

/**
 * Recalculates priority score for a single bin.
 * Returns the new score (0–100).
 */
export async function recalculatePriority(
  binId: string,
  fillLevel: number,
): Promise<number> {
  const bin = await prisma.bin.findUnique({
    where: { id: binId },
    include: { zone: true },
  });

  if (!bin) {
    throw new Error(`Bin not found: ${binId}`);
  }

  // Hours since last collection (default to 48 if never collected)
  const hoursSinceCollection = bin.lastCollectedAt
    ? (Date.now() - new Date(bin.lastCollectedAt).getTime()) / 3600000
    : 48;

  // Fill score: non-linear curve (exponential urgency as fill increases)
  const fillScore = Math.pow(fillLevel / 100, 1.5) * 70;

  // Time score: linear up to 24 hours, capped at 20
  const timeScore = Math.min(hoursSinceCollection / 24, 1) * 20;

  // Zone weight multiplier
  const zoneWeight = ZONE_WEIGHTS[bin.zone.type as ZoneType] ?? 1.0;

  // Health penalty: offline sensors get +10 urgency
  const healthPenalty = bin.sensorHealth ? 0 : 10;

  // Raw score with zone multiplier
  const rawScore = (fillScore + timeScore + healthPenalty) * zoneWeight;

  // Cap at 100
  const score = Math.min(Math.round(rawScore), 100);

  // Determine status from fill level
  let status: 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OVERFLOW' = 'NORMAL';
  if (fillLevel >= 95) status = 'OVERFLOW';
  else if (fillLevel >= 80) status = 'CRITICAL';
  else if (fillLevel >= 60) status = 'WARNING';

  // Update bin in database
  await prisma.bin.update({
    where: { id: binId },
    data: {
      currentFill: fillLevel,
      priorityScore: score,
      status: bin.sensorHealth ? status : 'OFFLINE',
    },
  });

  return score;
}

/**
 * Recalculates priority for ALL bins.
 * Called by the 5-minute cron job.
 */
export async function recalculateAllPriorities(): Promise<number> {
  const bins = await prisma.bin.findMany({
    select: { id: true, currentFill: true },
  });

  let updated = 0;
  for (const bin of bins) {
    await recalculatePriority(bin.id, bin.currentFill);
    updated++;
  }

  return updated;
}

// ── Pure utility functions (no DB access) ──────────────────

interface PriorityInput {
  fillLevel: number;
  sensorHealth: boolean;
  lastCollectedAt: Date | null;
  zoneWeight: number;
}

/**
 * Pure priority calculation — no database calls.
 * Use when bin + zone data is already fetched.
 */
export function calculatePriority(input: PriorityInput): number {
  const { fillLevel, sensorHealth, lastCollectedAt, zoneWeight } = input;

  const hoursSinceCollection = lastCollectedAt
    ? (Date.now() - new Date(lastCollectedAt).getTime()) / 3600000
    : 48;

  const fillScore = Math.pow(fillLevel / 100, 1.5) * 70;
  const timeScore = Math.min(hoursSinceCollection / 24, 1) * 20;
  const healthPenalty = sensorHealth ? 0 : 10;
  const rawScore = (fillScore + timeScore + healthPenalty) * zoneWeight;

  return Math.min(Math.round(rawScore), 100);
}

/**
 * Determines bin status from fill level percentage.
 */
export function determineBinStatus(fillLevel: number): 'NORMAL' | 'WARNING' | 'CRITICAL' | 'OVERFLOW' {
  if (fillLevel >= 95) return 'OVERFLOW';
  if (fillLevel >= 80) return 'CRITICAL';
  if (fillLevel >= 60) return 'WARNING';
  return 'NORMAL';
}

