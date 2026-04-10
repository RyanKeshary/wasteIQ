/**
 * Rate Limiting via Upstash Ratelimit
 * Applied to mutation endpoints, telemetry ingestion, and complaint creation.
 */
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from './redis';

/** Default rate limit: 100 requests per 60 seconds per IP */
export const defaultRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'wasteiq:rl:default',
});

/** Telemetry ingestion: 100 requests per minute per device */
export const telemetryRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'wasteiq:rl:telemetry',
});

/** Complaint creation: 5 requests per hour per IP */
export const complaintRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '3600 s'),
  analytics: true,
  prefix: 'wasteiq:rl:complaint',
});

/**
 * Get identifier from request for rate limiting.
 * Uses X-Forwarded-For header or falls back to a default.
 */
export function getIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() ?? '127.0.0.1';
  return ip;
}
