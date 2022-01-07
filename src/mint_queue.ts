const Queue = require("bull")
import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getOpenseaInfo,
} from "./api_data";
import delay = require("delay");

const HOUR_MS = 1000 * 60 * 60;

export const mintQueue = new Queue('mint alert queue', {
  settings: {
    lockDuration: 1 * 60 * 1000, // 5mins
    stalledInterval: 1 * 60 * 1000, // 5mins
  },
},  process.env.REDIS_URL)

mintQueue.process(
  parseInt(process.env.QUEUE_CONCURRENCY), 
  async (job: {data: {tokenId: string, ownerAddress: string }}, done: () => void) => {
    const {tokenId, ownerAddress} = job.data
    console.log("[INFO] Processing Token #", tokenId)
    console.log("[INFO] Fetching Complete data for", tokenId);
    const artBlock = await getArtblockInfo(tokenId);
    const openseaName = await getOpenseaInfo(ownerAddress);
    let mintedBy;
    if (openseaName) {
        mintedBy = openseaName;
    } else if (ownerAddress) {
        mintedBy = ownerAddress;
    }
    const artBlockWithOwner = {...artBlock, mintedBy}
    if (process.env.NODE_ENV == "production") {
        // only post to socials if production env
        try {
          await sendToTwitter(artBlockWithOwner);
        } catch (err) {
          console.error(`[ERROR] Tweet failed`, err)
        }
        try {
          await sendToDiscord(artBlockWithOwner);
        } catch (err) {
          console.error(`[ERROR] Discord Post failed`, err)
        }
    } else {
        // wait, then log that we *would* have posted if a prod env
        await delay(5000);
        console.log(`[INFO] WOULD have posted ${tokenId} to twitter and discord if prod`);
    }
    console.log("[INFO] Token Processed #", tokenId )
    await delay(20);
    done()
  }
)

/*
 * This clears old bull queue keys,
 * jobs that have existed > 24 hours and are either
 * completed or failed.
*/
export const queueClean = async () => {
  mintQueue.clean(HOUR_MS * 24, 'completed');
  mintQueue.clean(HOUR_MS * 24, 'failed');
}

mintQueue.on('cleaned', function(jobs: number[], type: string) {
  console.log(`[INFO] Cleaned ${jobs.length} ${type} jobs`);
})

mintQueue.on('stalled', function () {
  console.warn("[WARN] Queue Stalled")
})
