/**
 * WasteIQ — Individual Complaint API
 * Handles status updates, assignments, and metadata changes.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { ablyServer, CHANNELS } from '@/lib/ably';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { id: params.id },
      include: {
        citizen: { include: { user: { select: { name: true, avatar: true } } } },
        bin: true,
        messages: {
          orderBy: { createdAt: 'asc' },
          take: 50,
        },
      },
    });

    if (!complaint) return apiError('Complaint not found', 404);
    return apiSuccess(complaint);
  } catch (error) {
    return apiError('Failed to fetch complaint', 500);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) return apiError('Unauthorized', 401);

    const { status, assignedTo } = await request.json();
    const complaintId = params.id;

    // Check permissions
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);
    if (!isAdmin) return apiError('Forbidden: Admin only', 403);

    const updateData: any = {};
    const systemMessages: string[] = [];

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
      updateData.status = 'IN_PROGRESS';
      updateData.chatEnabled = true;
      systemMessages.push('Driver has been assigned. Chat is now enabled.');
    }

    if (status) {
      updateData.status = status;
      if (status === 'RESOLVED' || status === 'CLOSED') {
        updateData.chatEnabled = false;
        updateData.chatExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours window
        systemMessages.push(`Complaint ${status.toLowerCase()}. Chat will be disabled shortly.`);
      }
    }

    const complaint = await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });

    // Create system messages in chat
    for (const msg of systemMessages) {
      const systemMsg = await prisma.message.create({
        data: {
          complaintId,
          senderId: 'SYSTEM',
          senderRole: 'ADMIN', // Using ADMIN role for system messages
          content: msg,
          type: 'SYSTEM',
        },
      });
      
      // Broadcast to Ably
      await ablyServer.channels
        .get(CHANNELS.COMPLAINTS_CHAT(complaintId))
        .publish('message', systemMsg);
    }

    return apiSuccess(complaint);
  } catch (error) {
    console.error('[API /complaints/[id] PATCH]', error);
    return apiError('Failed to update complaint', 500);
  }
}
