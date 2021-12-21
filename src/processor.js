import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getMinterAddress,
  getOpenseaInfo,
} from "./api_data"

module.exports = async function (job) {
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

  await sendToTwitter(artBlockWithOwner, contractVersion);
  await sendToDiscord(artBlockWithOwner);

  console.log("[INFO] Processed Token # ", tokenId) 
  return Promise.resolve()
}