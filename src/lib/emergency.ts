/**
 * WasteIQ — Emergency SOS Validation Layer
 * ──────────────────────────────────────
 * Analyzes complaints marked as 'Emergency' to verify their urgency
 * using multi-signal analysis (OCR, Zone Weight, Fill Levels, Density).
 */

import { prisma } from './prisma';
import { AlertType, EmergencyLevel } from '@/types';
import { ablyServer, CHANNELS } from './ably';

const EMERGENCY_KEYWORDS = ['hazard', 'toxic', 'chemical', 'sewage', 'medical', 'hospital', 'school', 'emergency', 'accident', 'fire'];

/**
 * Validates if a complaint is a genuine emergency.
 * Updates the complaint with verification status and emergency score.
 */
export async function validateEmergencyComplaint(complaintId: string) {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: {
      bin: { include: { zone: true } },
    },
  });

  if (!complaint || !complaint.isEmergency) return;

  let score = 0;
  let level: EmergencyLevel = 'LOW';

  // 1. Keyword Analysis (from description and OCR)
  const content = (complaint.description + ' ' + (complaint.ocrText || '')).toLowerCase();
  const matchedKeywords = EMERGENCY_KEYWORDS.filter(k => content.includes(k));
  score += matchedKeywords.length * 15;

  // 2. Zone Weight Analysis
  if (complaint.bin?.zone) {
    const zoneWeight = complaint.bin.zone.locationWeight || 1;
    score += (zoneWeight - 1) * 20;
    
    if (complaint.bin.zone.type === 'HOSPITAL') score += 30;
    if (complaint.bin.zone.type === 'SCHOOL') score += 20;
  }

  // 3. Nearby Bin Fill Levels
  if (complaint.binId) {
    const bin = await prisma.bin.findUnique({ where: { id: complaint.binId } });
    if (bin && bin.currentFill > 80) score += 25;
  }

  // 4. Complaint Density in the same area (last 1 hour)
  const nearbyComplaintsCount = await prisma.complaint.count({
    where: {
      createdAt: { gte: new Date(Date.now() - 3600000) },
      latitude: { gte: (complaint.latitude || 0) - 0.001, lte: (complaint.latitude || 0) + 0.001 },
      longitude: { gte: (complaint.longitude || 0) - 0.001, lte: (complaint.longitude || 0) + 0.001 },
      id: { not: complaint.id }
    }
  });
  score += nearbyComplaintsCount * 10;

  // Determine Level
  if (score >= 80) level = 'CRITICAL';
  else if (score >= 60) level = 'HIGH';
  else if (score >= 40) level = 'MEDIUM';

  const verified = score >= 40;

  // Update Complaint
  const updatedComplaint = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      verifiedEmergency: verified,
      emergencyScore: score,
      emergencyLevel: level,
      emergencyTriggeredAt: verified ? new Date() : null,
      priority: verified ? 1 : complaint.priority, // Set to highest priority if verified
    },
  });

  // If verified, trigger system-wide response
  if (verified) {
    await triggerEmergencyResponse(updatedComplaint.id);
  }

  return updatedComplaint;
}

/**
 * Triggers system-wide emergency response:
 * 1. Creates an EMERGENCY_SOS alert
 * 2. Injects into nearest driver's route
 * 3. Broadcasts via Ably
 */
async function triggerEmergencyResponse(complaintId: string) {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    include: { bin: true }
  });

  if (!complaint) return;

  // 1. Create Alert
  await prisma.alert.create({
    data: {
      type: 'EMERGENCY_SOS' as AlertType,
      message: `🚨 EMERGENCY SOS: ${complaint.title} at ${complaint.bin?.address || 'Reported Location'}`,
      severity: 5,
      binId: complaint.binId,
    }
  });

  // 2. Broadcast Alert
  await ablyServer.channels.get(CHANNELS.ALERTS_LIVE).publish('sos', {
    type: 'EMERGENCY_SOS',
    complaintId,
    title: complaint.title,
    latitude: complaint.latitude,
    longitude: complaint.longitude,
    level: complaint.emergencyLevel
  });

  // 3. Inject into Route (Find nearest active driver)
  // This logic would ideally call a specialized routing service, 
  // but we'll implement a basic version here as per Step 6.
  await injectEmergencyIntoRoute(complaintId);
}

async function injectEmergencyIntoRoute(complaintId: string) {
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  });

  if (!complaint || !complaint.latitude || !complaint.longitude) return;

  // Find nearest active driver with an ACTIVE route
  const drivers = await prisma.driver.findMany({
    where: { isActive: true, routes: { some: { status: 'ACTIVE' } } },
    include: { routes: { where: { status: 'ACTIVE' }, take: 1 } }
  });

  if (drivers.length === 0) return;

  // Simple nearest neighbor calculation
  let nearestDriver = drivers[0];
  let minDistance = Infinity;

  drivers.forEach(driver => {
    if (driver.currentLat && driver.currentLng) {
      const dist = Math.sqrt(
        Math.pow(driver.currentLat - complaint.latitude!, 2) + 
        Math.pow(driver.currentLng - complaint.longitude!, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearestDriver = driver;
      }
    }
  });

  const activeRoute = nearestDriver.routes[0];
  if (!activeRoute) return;

  // Inject into route stops at the next available sequence
  const stops = await prisma.routeStop.findMany({
    where: { routeId: activeRoute.id },
    orderBy: { sequence: 'asc' }
  });

  // Find first PENDING stop to insert before it
  const nextStopIndex = stops.findIndex(s => s.status === 'PENDING');
  const insertAt = nextStopIndex === -1 ? stops.length : nextStopIndex;

  // Shift existing stops
  await prisma.routeStop.updateMany({
    where: { routeId: activeRoute.id, sequence: { gte: insertAt } },
    data: { sequence: { increment: 1 } }
  });

  // Create new emergency stop
  // Note: Since Emergency SOS might not be a physical bin, 
  // we might need a dummy Bin or handle stops without Bins.
  // For now, if there's a binId, use it. Otherwise, we'd need a virtual bin.
  // Assuming complaint might be linked to a binId as per schema.
  
  if (complaint.binId) {
    await prisma.routeStop.create({
      data: {
        routeId: activeRoute.id,
        binId: complaint.binId,
        sequence: insertAt,
        status: 'PENDING'
      }
    });

    // Mark route as emergency
    await prisma.route.update({
      where: { id: activeRoute.id },
      data: { isEmergency: true }
    });

    // Notify Driver via Ably
    await ablyServer.channels.get(`driver:${nearestDriver.id}:updates`).publish('emergency_injection', {
      type: 'ROUTE_EMERGENCY_INJECTION',
      routeId: activeRoute.id,
      message: '🚨 EMERGENCY PICKUP INJECTED INTO YOUR ROUTE',
      complaintId: complaint.id
    });
  }
}
