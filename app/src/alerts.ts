import delay = require("delay");
import { sendToDiscord } from "./discord";
import { sendToTwitter } from "./twitter";
import {
  getArtblockInfo,
  getMinterAddress,
  getOpenseaInfo,
} from "./api_data";
import { artBlocksContract, v2ArtBlocksContract } from "./ethereum";

export const alertForBlocks = async (
  startingBlock: number,
  endingBlock: number,
  contractVersion: "original" | "v2"
) => {
  // edge case: starting block same as end block -> no advance, no action
  if (startingBlock == endingBlock) return;

  const contractToUse =
    contractVersion === "original" ? artBlocksContract : v2ArtBlocksContract;

  const allEvents = await contractToUse.queryFilter(
    { address: artBlocksContract.address },
    startingBlock + 1, // add 1 to avoid oboe (already has been scanned)
    endingBlock
  );
  const mintEvents = allEvents.filter((e) => e.event === "Mint");

  const mintedTokenIds: string[] = mintEvents.map((me) =>
    me.args["_tokenId"].toString()
  );
  console.log(
    contractVersion,
    "Found mintedTokenIds",
    JSON.stringify(mintedTokenIds)
  );
  enqueueTokensForAlert(mintedTokenIds, contractVersion);
};

export const enqueueTokensForAlert = (
  mintedTokenIds: string[],
  contractVersion: "original" | "v2"
) => {
  mintedTokenIds.forEach(async (tokenId) => {
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
    await delay(500)
    const artBlockWithOwner = {...artBlock, mintedBy}
    sendToTwitter(artBlockWithOwner, contractVersion);
    sendToDiscord(artBlockWithOwner);
  });
};
