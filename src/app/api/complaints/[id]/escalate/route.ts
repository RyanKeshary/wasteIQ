/**
 * WasteIQ — Complaint Escalation API
 * Handles progression from Chat -> Call -> Government Support.
 */

import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { escalateComplaint } from '@/lib/communication';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return apiError('Unauthorized', 401);

    const { level } = await request.json();
    const { id } = await params;
    const complaintId = id;

    if (!['CALL', 'GOVERNMENT'].includes(level)) {
      return apiError('Invalid escalation level');
    }

    // Verify ownership/participation
    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { citizen: true }
    });

    if (!complaint) return apiError('Complaint not found', 404);

    const isCitizen = complaint.citizen?.userId === session.user.id;
    const isDriver = complaint.assignedTo === session.user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);

    if (!isCitizen && !isDriver && !isAdmin) {
      return apiError('Forbidden', 403);
    }

    // Citizen can only escalate to CALL. Government escalation usually requires Admin or SOS trigger.
    if (level === 'GOVERNMENT' && !isAdmin && !complaint.emergencyTriggeredAt) {
      return apiError('Government escalation requires administrative review or emergency trigger.');
    }

    const updated = await escalateComplaint(complaintId, level);

    return apiSuccess(updated);
  } catch (error: any) {
    return apiError(error.message || 'Escalation failed', 500);
  }
}
