
import * as Queue from "bull"

export const mintQueue = new Queue('mint alert queue',  process.env.REDIS_URL)

mintQueue.process(5, "./processor.ts");