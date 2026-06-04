import { Redis } from '@upstash/redis';

// Only create a Redis instance if the keys are actually provided
// This prevents the app from crashing during development if keys are missing
export const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null;

/**
 * Helper to cache data easily
 * @param key Redis key
 * @param fetcher Function that returns data to cache
 * @param ttl Time to live in seconds (default 3600 = 1 hour)
 */
export async function getCachedData<T>(key: string, fetcher: () => Promise<T>, ttl: number = 3600): Promise<T> {
  if (!redis) {
    // If Redis is not configured, just return the fresh data directly
    return fetcher();
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return typeof cached === 'string' ? JSON.parse(cached) : cached as T;
    }

    const data = await fetcher();
    await redis.setex(key, ttl, JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Redis Cache Error:", error);
    // Fallback to fresh data if Redis fails
    return fetcher();
  }
}
