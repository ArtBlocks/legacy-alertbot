const Queue = require("bull")

export const mintQueue = new Queue('mint alert queue',  process.env.REDIS_URL)

mintQueue.process(process.env.QUEUE_CONCURRENCY, "./src/processor.js");