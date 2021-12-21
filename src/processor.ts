import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getMinterAddress,
  getOpenseaInfo,
} from "./api_data"

module.exports = async function (job: {data: {tokenId: string, contractVersion: 'original' | 'v2'}}) {
 const {tokenId, contractVersion } = job.data
  console.log("[INFO] Processing Token # ", tokenId)
  console.log("[INFO] Fetching Complete data for ", tokenId);
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

  const twitterResp = await sendToTwitter(artBlockWithOwner, contractVersion);
  const discordResp = await sendToDiscord(artBlockWithOwner);
  console.log("[INFO] Twitter Response", JSON.stringify(twitterResp.tweetRes))
  console.log("[INFO] Discord Response", JSON.stringify(discordResp.data))

  console.log("[INFO] Processed Token # ", tokenId) 
  return Promise.resolve()
}