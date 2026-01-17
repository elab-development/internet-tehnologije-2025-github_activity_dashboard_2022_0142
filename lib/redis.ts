import Redis from 'ioredis';

const redisClient = () => {
  if (process.env.REDIS_URL) {
    return new Redis(process.env.REDIS_URL);
  }
  return new Redis({
    host: 'localhost',
    port: 6379,
  });
};

const globalForRedis = global as unknown as { redis: Redis };
export const redis = globalForRedis.redis || redisClient();

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis;