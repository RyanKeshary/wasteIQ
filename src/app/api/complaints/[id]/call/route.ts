/**
 * WasteIQ — Masked Calling API
 * Triggers secure, masked calls between citizens and drivers.
 */

import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { auth } from '@/lib/auth';
import { initiateMaskedCall } from '@/lib/communication';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) return apiError('Unauthorized', 401);

    const { id } = await params;
    const complaintId = id;
    
    const callLog = await initiateMaskedCall(
      complaintId, 
      session.user.id, 
      session.user.role
    );

    return apiSuccess({
      message: 'Call initiated. You will receive a call on your registered number shortly.',
      callId: callLog.id
    });
  } catch (error: any) {
    console.error('[API Call POST]', error);
    return apiError(error.message || 'Failed to initiate call', 400);
  }
}
