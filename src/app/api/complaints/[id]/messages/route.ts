/**
 * WasteIQ — Complaint Chat API
 * Handles real-time messaging between Citizen, Driver, and Admin.
 * Bound to individual complaints.
 */

import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { apiSuccess, apiError } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { ablyServer, CHANNELS } from '@/lib/ably';
import { escalateComplaint } from '@/lib/communication';
import { chatRateLimit, getIdentifier } from '@/lib/rate-limit';

const MAX_MESSAGE_LENGTH = 500;
const BANNED_KEYWORDS = ['spam', 'abuse', 'hack', 'fuck', 'shit']; // Basic placeholder for abusive content filtering

/**
 * GET: Retrieve all messages for a specific complaint.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    console.log('[DEBUG] API Session:', session?.user?.id, session?.user?.role);
    if (!session) return apiError('Unauthorized', 401);

    const complaintId = params.id;

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { citizen: true },
    });

    if (!complaint) return apiError('Complaint not found', 404);

    // Authorization: Citizen owner, assigned Driver, or Admin
    const isCitizen = complaint.citizen?.userId === session.user.id;
    
    let isDriver = false;
    if (session.user.role === 'DRIVER') {
      const driver = await prisma.driver.findUnique({ where: { userId: session.user.id } });
      isDriver = !!driver && complaint.assignedTo === driver.id;
    }
    
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);

    if (!isCitizen && !isDriver && !isAdmin) {
      return apiError('Forbidden', 403);
    }

    const messages = await prisma.message.findMany({
      where: { complaintId },
      orderBy: { createdAt: 'asc' },
      take: 100, // Safety limit
    });

    return apiSuccess(messages);
  } catch (error) {
    console.error('[API /complaints/[id]/messages GET]', error);
    return apiError('Failed to fetch messages', 500);
  }
}

/**
 * POST: Send a new message or quick reply.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    console.log('[DEBUG] API Session POST:', session?.user?.id, session?.user?.role);
    if (!session) return apiError('Unauthorized', 401);

    // 1. Rate Limiting
    const identifier = `${session.user.id}:${params.id}`;
    const { success } = await chatRateLimit.limit(identifier);
    if (!success) return apiError('Too many messages. Slow down!', 429);

    const complaintId = params.id;
    const { content, type = 'TEXT', payload } = await request.json();

    // 2. Content Validation
    if (!content && type !== 'QUICK_REPLY') {
      return apiError('Message content is required');
    }

    if (content?.length > MAX_MESSAGE_LENGTH) {
      return apiError(`Message exceeds ${MAX_MESSAGE_LENGTH} character limit`);
    }

    const isAbusive = BANNED_KEYWORDS.some(word => content?.toLowerCase().includes(word));
    if (isAbusive) {
      return apiError('Message contains inappropriate content', 400);
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { citizen: true },
    });

    if (!complaint) return apiError('Complaint not found', 404);

    // 3. Lifecycle & Expiry check
    if (!complaint.chatEnabled && !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return apiError('Chat is disabled for this complaint context', 403);
    }

    if (complaint.chatExpiresAt && new Date() > complaint.chatExpiresAt) {
      return apiError('This chat session has expired', 403);
    }

    // 4. Authorization
    const isCitizen = complaint.citizen?.userId === session.user.id;
    
    let isDriver = false;
    if (session.user.role === 'DRIVER') {
      const driver = await prisma.driver.findUnique({ where: { userId: session.user.id } });
      isDriver = !!driver && complaint.assignedTo === driver.id;
    }

    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(session.user.role);

    if (!isCitizen && !isDriver && !isAdmin) {
      return apiError('Forbidden', 403);
    }

    // 5. Create message
    const message = await prisma.message.create({
      data: {
        complaintId,
        senderId: session.user.id,
        senderRole: session.user.role as any,
        content: content || (type === 'QUICK_REPLY' ? payload?.action : ''),
        type,
        payload: payload || null,
      },
    });

    // 6. Real-time broadcast via Ably
    await ablyServer.channels
      .get(CHANNELS.COMPLAINTS_CHAT(complaintId))
      .publish('message', message);

    // 7. Handle side-effects
    if (type === 'QUICK_REPLY') {
      await handleQuickReply(complaintId, payload, session.user.role);
    }

    return apiSuccess(message, 201);
  } catch (error) {
    console.error('[API /complaints/[id]/messages POST]', error);
    return apiError('Failed to send message', 500);
  }
}

/**
 * Helper to handle side-effects of quick replies (e.g., status updates)
 */
async function handleQuickReply(complaintId: string, payload: any, role: string) {
  const action = payload?.action;
  
  if (role === 'DRIVER') {
    if (action === 'REACHED') {
      // Logic for reaching location (could update a live map)
      console.log(`[CHAT] Driver reached complaint ${complaintId}`);
    } else if (action === 'COMPLETED') {
      // Finalize the complaint status
      await prisma.complaint.update({
        where: { id: complaintId },
        data: { 
          status: 'RESOLVED',
          resolvedAt: new Date(),
          chatEnabled: false,
          chatExpiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
        }
      });
    }
  }
}
