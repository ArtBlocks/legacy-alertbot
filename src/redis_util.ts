import { promisify } from 'util';
const Redis = require("ioredis");

const redisClient = new Redis(process.env.REDIS_URL);

const getAsyncRaw = promisify(redisClient.get);
export const getRedisAsync = getAsyncRaw.bind(redisClient) as typeof getAsyncRaw;
const setAsyncRaw = promisify(redisClient.set);
export const setRedisAsync = setAsyncRaw.bind(redisClient) as typeof setAsyncRaw;
