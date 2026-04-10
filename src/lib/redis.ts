/**
 * Upstash Redis Client
 * Serverless Redis for caching, pub/sub, and rate limiting.
 */
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
