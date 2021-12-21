import { mintQueue } from "./mint_queue";
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
  mintedTokenIds.forEach(async (tokenId) => {
    mintQueue.add({tokenId, contractVersion})
  });
};
