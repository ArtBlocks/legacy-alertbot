import { discordAlertForArtBlock } from "./discord";
import { getArtblockInfo } from "./artblocks_api";
import { ArtBlockContract__factory } from "./contracts/factories/ArtBlockContract__factory";
import { twitterClient, uploadTwitterImage, tweetArtblock } from "./twitter";
import axios from "axios";
import * as fs from "fs";
import delay = require("delay");
import {
  artBlocksContract,
  v2ArtBlocksContract,
  ethersProvider,
} from "./ethereum";
import { StatusesUpdate } from "twitter-api-client";

export const alertForBlocks = async (
  startingBlock: number,
  endingBlock: number,
  contractVersion: "original" | "v2"
) => {
  const contractToUse =
    contractVersion === "original" ? artBlocksContract : v2ArtBlocksContract;

  const allEvents = await contractToUse.queryFilter(
    { address: artBlocksContract.address },
    startingBlock,
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
    const artBlock = await getArtblockInfo(tokenId);

    let tweetResp:
      | {
          tweetRes: StatusesUpdate;
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
        console.info(contractVersion, "sent to discord");
      } catch (e) {
        console.error(e);
        console.error(contractVersion, "ERROR: Couldnt send to discord");
      }
    } else {
      console.error(
        contractVersion,
        "ERROR: Not sending out discord b/c tweet didnt work"
      );
    }

    await delay(500);
  }
};
