import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

// Upstash requires TLS — ensure the URL uses rediss:// not redis://
const rawUrl = process.env.UPSTASH_REDIS_REST_URL || '';
const redisUrl = rawUrl.startsWith('redis://') ? rawUrl.replace('redis://', 'rediss://') : rawUrl;

const redis = new Redis(redisUrl, {
  tls: {},
  maxRetriesPerRequest: 1,
  connectTimeout: 3000,
  lazyConnect: true,
  enableOfflineQueue: false,
});

redis.on('error', (err) => {
  // Suppress noisy logs — Redis failures are handled gracefully in each route
});

// Safe wrappers that never throw — Redis is an optional cache layer
export const redisGet = async (key: string): Promise<string | null> => {
  try { return await redis.get(key); } catch { return null; }
};

export const redisSet = async (key: string, ttl: number, value: string): Promise<void> => {
  try { await redis.setex(key, ttl, value); } catch { /* no-op */ }
};

export const redisDel = async (key: string): Promise<void> => {
  try { await redis.del(key); } catch { /* no-op */ }
};

export const clearProductCaches = async (): Promise<void> => {
  try {
    const keys = await redis.keys('store:products:*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Failed to clear product caches:", error);
  }
};

export { redis };
