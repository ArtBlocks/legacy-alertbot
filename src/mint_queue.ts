const Queue = require("bull")
import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getMinterAddress,
  getOpenseaInfo,
} from "./api_data";
import delay = require("delay");

export const mintQueue = new Queue('mint alert queue',  process.env.REDIS_URL)

mintQueue.process(
  parseInt(process.env.QUEUE_CONCURRENCY), 
  async (job: {data: {tokenId: string, contractVersion: 'original' | 'v2'}}, done: () => void) => {
    const {tokenId, contractVersion } = job.data
    console.log("[INFO] Processing Token #", tokenId)
    console.log("[INFO] Fetching Complete data for", tokenId);
    const artBlock = await getArtblockInfo(tokenId);
    const minterAddress = await getMinterAddress(tokenId, contractVersion);
    const openseaName = await getOpenseaInfo(minterAddress);
    let mintedBy;
    if (openseaName) {
        mintedBy = openseaName;
    } else if (minterAddress) {
        mintedBy = minterAddress;
    }
    const artBlockWithOwner = {...artBlock, mintedBy}
    if (process.env.NODE_ENV == "production") {
        // only post to socials if production env
        sendToTwitter(artBlockWithOwner, contractVersion);
        sendToDiscord(artBlockWithOwner);
    } else {
        // wait, then log that we *would* have posted if a prod env
        await delay(5000);
        console.log(`[INFO] WOULD have posted ${tokenId} to twitter and discord if prod`);
    }
    console.log("[INFO] Token Processed #", tokenId )
    done()
  }
)