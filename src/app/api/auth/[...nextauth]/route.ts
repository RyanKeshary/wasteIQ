/**
 * WasteIQ — NextAuth API Route Handler
 * Exposes GET and POST for /api/auth/* endpoints.
 */
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
