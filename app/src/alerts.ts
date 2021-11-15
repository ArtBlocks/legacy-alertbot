import { discordAlertForArtBlock } from "./discord";
import { getArtblockInfo } from "./artblocks_api";
import { ArtBlockContract__factory } from "./contracts/factories/ArtBlockContract__factory";
import { tweetArtblock } from "./twitter";
import axios from "axios";
import * as fs from "fs";
import delay = require("delay");
import {
  artBlocksContract,
  v2ArtBlocksContract,
  ethersProvider,
} from "./ethereum";
import { TweetV1 } from "twitter-api-v2"

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
  for (let x = 0; x < mintedTokenIds.length; x = x + 1) {
    const tokenId = mintedTokenIds[x];
    console.log("Alerting for", tokenId);
    const artBlock = await getArtblockInfo(tokenId, contractVersion);

    let tweetResp:
      | {
          tweetRes: TweetV1;
          tweetUrl: string;
        }
      | undefined = undefined;

    try {
      tweetResp = await tweetArtblock(artBlock);
      console.log("Tweet", tweetResp.tweetUrl);
    } catch (e) {
      console.error(e);
      console.log(contractVersion, "ERROR: cant tweet");
    }

    if (tweetResp) {
      try {
        await discordAlertForArtBlock(artBlock, tweetResp.tweetUrl);
        console.info(contractVersion, "sent twitter post to discord");
      } catch (e) {
        console.error(e);
        console.error(
          contractVersion,
          "ERROR: Failed sending twitter post to discord"
        );
      }
    } else {
      try {
        console.log("Tweet didn't work, so link discord direct to site");
        await discordAlertForArtBlock(
          artBlock,
          artBlock.image,
          artBlock.external_url
        );
      } catch (e) {
        console.error(
          contractVersion,
          "ERROR: Tweet didnt work, then discord post failed"
        );
      }
    }

    await delay(500);
  }
};
