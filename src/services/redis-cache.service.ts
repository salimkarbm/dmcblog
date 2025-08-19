import RedisInstance from '../shared/redis-cache';

const redis = new RedisInstance();
export default class RedisService {
    constructor() {
        redis.onDisconnect();
    }

    public async set(
        value: string,
        prefix: string,
        key?: string
    ): Promise<void> {
        await redis.redisInstance.set(`${prefix}:${key}`, value);
    }

    public async get(
        prefix: string,
        key?: string
    ): Promise<string | null | undefined> {
        const get = await redis.redisInstance.get(`${prefix}:${key}`);
        return get;
    }

    public async del(prefix: string, key: string): Promise<void> {
        try {
            await redis.redisInstance.del(`${prefix}:${key}`);
        } catch (e) {
            console.log(e);
        }
    }

    public async flushall(): Promise<void> {
        try {
            await redis.redisInstance.flushall();
        } catch (e) {
            console.log(e);
        }
    }

    public async flushdb(): Promise<void> {
        try {
            await redis.redisInstance.flushdb();
        } catch (e) {
            console.log(e);
        }
    }

    public async quit(): Promise<void> {
        try {
            await redis.redisInstance.quit();
        } catch (e) {
            console.log(e);
        }
    }

    public async ping(): Promise<void> {
        try {
            await redis.redisInstance.ping();
        } catch (e) {
            console.log(e);
        }
    }

    public async info(): Promise<void> {
        try {
            await redis.redisInstance.info();
        } catch (e) {
            console.log(e);
        }
    }

    public async keys(pattern: string) {
        try {
            return await redis.redisInstance.keys(pattern);
        } catch (e) {
            console.log(e);
        }
    }

    public async ttl(key: string) {
        try {
            return await redis.redisInstance.ttl(key);
        } catch (e) {
            console.log(e);
        }
    }

    public async setWithExpiry(
        value: string,
        prefix: string,
        expiry: number,
        key?: string
    ): Promise<void> {
        try {
            await redis.redisInstance.set(
                `${prefix}:${key}`,
                value,
                'EX',
                expiry
            );
        } catch (e) {
            console.log(e);
        }
    }

    public async getWithExpiry(key: string) {
        try {
            return await redis.redisInstance.get(key);
        } catch (e) {
            console.log(e);
        }
    }

    public async delWithExpiry(key: string) {
        try {
            return await redis.redisInstance.del(key);
        } catch (e) {
            console.log(e);
        }
    }

    public async flushAllWithExpiry() {
        try {
            return await redis.redisInstance.flushall();
        } catch (e) {
            console.log(e);
        }
    }

    public async flushdbWithExpiry() {
        try {
            return await redis.redisInstance.flushdb();
        } catch (e) {
            console.log(e);
        }
    }
}
