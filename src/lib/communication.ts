/**
 * WasteIQ — Unified Communication Service
 * Handles Chat, Call, and Government Escalation logic.
 */

import { prisma } from '@/lib/prisma';
import { ablyServer, CHANNELS } from '@/lib/ably';

export type EscalationLevel = 'NONE' | 'CALL' | 'GOVERNMENT';

/**
 * Escalate a complaint to the next level of communication.
 */
export async function escalateComplaint(complaintId: string, level: EscalationLevel) {
  try {
    const updateData: any = { escalationLevel: level };

    if (level === 'CALL') {
      updateData.callEnabled = true;
    } else if (level === 'GOVERNMENT') {
      updateData.governmentAssigned = true;
      updateData.callEnabled = true;
      updateData.chatEnabled = true; // Ensure chat is active for government engagement
    }

    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });

    // Generate System Message for Chat
    const messageContent = level === 'CALL' 
      ? '⚠️ Escalation: Voice support enabled. High-priority communication active.' 
      : '🏛️ Critical Escalation: Connected to Municipal Support (GOVERNMENT). Official intervention initiated.';

    const systemMsg = await prisma.message.create({
      data: {
        complaintId,
        senderId: 'SYSTEM',
        senderRole: 'ADMIN',
        content: messageContent,
        type: 'SYSTEM',
      },
    });

    // Broadcast via Ably
    await ablyServer.channels
      .get(CHANNELS.COMPLAINTS_CHAT(complaintId))
      .publish('message', systemMsg);

    // If Government escalation, trigger high-priority alert
    if (level === 'GOVERNMENT') {
      await ablyServer.channels.get('ADMIN_ALERTS').publish('emergency', {
        type: 'GOVERNMENT_INTERVENTION',
        complaintId,
        message: 'Municipal Support requested for unresolved issue.'
      });
    }

    return complaint;
  } catch (error) {
    console.error('[Escalation Service Error]', error);
    throw error;
  }
}

/**
 * Trigger a masked call between two parties.
 * In a production environment, this would integrate with Twilio/Plivo/Exotel.
 */
export async function initiateMaskedCall(complaintId: string, userId: string, role: string) {
  // 1. Check if call is enabled
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
    select: { callEnabled: true, assignedTo: true, status: true }
  });

  if (!complaint || !complaint.callEnabled || complaint.status !== 'IN_PROGRESS') {
    throw new Error('Calling is not enabled for this context.');
  }

  // 2. Rate limit check (e.g., max 3 calls per hour per complaint)
  const recentCalls = await prisma.callLog.count({
    where: {
      complaintId,
      createdAt: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    }
  });

  if (recentCalls >= 3) {
    throw new Error('Call limit reached. Please use chat or wait.');
  }

  // 3. Log the initiation
  const callLog = await prisma.callLog.create({
    data: {
      complaintId,
      initiatedBy: role as any,
      status: 'INITIATED'
    }
  });

  // 4. Trigger External Provider (Mocked for now)
  // await provider.makeCall({ from: userPhone, to: targetPhone, mask: true });

  return callLog;
}
