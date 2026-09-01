import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Export a single Redis connection for BullMQ to reuse
export const connection = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});
