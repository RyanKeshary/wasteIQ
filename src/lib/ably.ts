/**
 * Ably Real-Time Client
 * Server-side REST for publishing, client-side Realtime for subscribing.
 */
import Ably from 'ably';

/** Server-side REST client for publishing events */
export const ablyServer = typeof window === 'undefined' && process.env.ABLY_API_KEY
  ? new Ably.Rest({ key: process.env.ABLY_API_KEY })
  : (null as unknown as Ably.Rest);

let clientInstance: Ably.Realtime | null = null;

/** Client-side Realtime client factory for subscribing to channels */
export const getAblyClient = () => {
  if (typeof window === 'undefined') return null as unknown as Ably.Realtime;
  
  if (!clientInstance) {
    clientInstance = new Ably.Realtime({
      key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
      clientId: `wasteiq-${Math.random().toString(36).slice(2, 10)}`,
    });
  }
  return clientInstance;
};

/** Ably channel names — centralized for consistency */
export const CHANNELS = {
  BINS_UPDATES: 'bins:updates',
  ALERTS_LIVE: 'alerts:live',
  DRIVERS_LOCATION: 'drivers:location',
  ROUTES_UPDATED: 'routes:updated',
  COMPLAINTS_UPDATED: 'complaints:updated',
  COMPLAINTS_CHAT: (id: string) => `complaints:chat:${id}`,
} as const;
