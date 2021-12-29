import { promisify } from 'util';
const Redis = require('ioredis');
var url   = require('url');

const redis_uri = url.parse(process.env.REDIS_URL);
var redisClient = new Redis({
  port: Number(redis_uri.port) + 1,
  host: redis_uri.hostname,
  password: redis_uri.auth.split(':')[1],
  db: 0,
  tls: {
    rejectUnauthorized: false,
    requestCert: true,
    agent: false
  }

const getAsyncRaw = promisify(redisClient.get);
export const getRedisAsync = getAsyncRaw.bind(redisClient) as typeof getAsyncRaw;
const setAsyncRaw = promisify(redisClient.set);
export const setRedisAsync = setAsyncRaw.bind(redisClient) as typeof setAsyncRaw;
