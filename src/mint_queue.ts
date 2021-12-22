const Queue = require("bull")

import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getMinterAddress,
  getOpenseaInfo,
} from "./api_data";

export const mintQueue = new Queue('mint alert queue',  process.env.REDIS_URL)

// TODO - get concurrent processors working on this queue
// mintQueue.process(process.env.QUEUE_CONCURRENCY, "./src/processor.js");
mintQueue.process(async (job: {data: {tokenId: string, contractVersion: 'original' | 'v2'}}, done: () => void) => {
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
  sendToTwitter(artBlockWithOwner, contractVersion);
  sendToDiscord(artBlockWithOwner);

  console.log("[INFO] Token Processed #", tokenId )
  done()
})