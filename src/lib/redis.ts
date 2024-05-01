import dotenv from "dotenv";
import Redis from "ioredis";
import { seedCache } from "./seed_plans";

function initCache() {
  const cache: { [key: string]: string } = {};
  Object.entries(seedCache).forEach(([key, data]) => {
    cache[key] = JSON.stringify(data);
  });
  return cache;
}

dotenv.config();

class RedisClientClone {
  private cache: { [key: string]: string };
  instance: RedisClientClone | undefined = undefined;
  constructor() {
    this.cache = initCache();
  }
  set(key: string, value: string, expiry: string, duration: number) {
    this.cache[key] = value;
  }
  get(key: string) {
    return this.cache[key] ?? Object.values(this.cache)[0];
  }
}

class RedisClientCloneSingleton {
  private static instance: RedisClientClone | null = null;
  public static getInstance(): RedisClientClone {
    if (!this.instance) {
      this.instance = new RedisClientClone();
    }
    return this.instance;
  }
}

let redisClient: Redis | RedisClientClone;
if (process.env.NODE_ENV === "production") {
  redisClient = new Redis(process.env.REDIS_URL as string);
} else {
  redisClient = RedisClientCloneSingleton.getInstance();
}

export default redisClient;
