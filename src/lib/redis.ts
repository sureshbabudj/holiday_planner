import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

class RedisClientClone {
  private cache: { [key: string]: string };
  instance: RedisClientClone | undefined = undefined;
  constructor() {
    this.cache = {};
  }
  set(key: string, value: string, expiry: string, duration: number) {
    this.cache[key] = value;
  }
  get(key: string) {
    return this.cache[key];
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
