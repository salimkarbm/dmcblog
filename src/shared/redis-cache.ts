import Redis from 'ioredis';
import appConfig from '../config';

export default class RedisCache {
    public redisInstance: Redis;

    constructor() {
        this.redisInstance = new Redis({
            host: appConfig.REDIS.host,
            port: appConfig.REDIS.port,
            db: 0
        });

        this.setupExitHandler();
        this.setupCloseHandler();
    }

    private setupExitHandler() {
        process.on('exit', () => {
            this.redisInstance.quit();
        });
    }

    private setupCloseHandler() {
        process.on('SIGINT', () => {
            this.redisInstance.quit();
        });
    }

    public getInstance() {
        return this.redisInstance;
    }

    public onClose() {
        this.redisInstance.on('close', () => {
            console.log('Connection to Redis closed');
        });
    }

    public onReady() {
        this.redisInstance.on('ready', () => {
            console.log('Redis Connected and Ready');
            return true;
        });
    }

    public onError() {
        this.redisInstance.on('error', (err) => {
            console.log('Error connecting to Redis');
            throw err;
        });
    }

    public onEnd() {
        this.redisInstance.on('end', () => {
            console.log('Connection to Redis ended');
        });
    }

    public onDisconnect() {
        this.redisInstance.on('disconnect', () => {
            console.log('Disconnected from Redis');
            return true;
        });
    }

    public onReconnecting() {
        this.redisInstance.on('reconnecting', () => {
            console.log('Reconnecting to Redis');
        });
    }

    public onReconnect() {
        this.redisInstance.on('reconnect', () => {
            console.log('Reconnected to Redis');
        });
    }

    public onConnect() {
        this.redisInstance.on('connect', () => {
            console.log(' Connected to Redis');
        });
    }
}
