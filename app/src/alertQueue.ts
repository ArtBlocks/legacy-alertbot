const Queue = require("bull");
import { ArtBlockInfo } from "artblocks_api";
import { TweetV1 } from "twitter-api-v2";
import { discordAlertForArtBlock } from "./discord";
import { tweetArtblock } from "./twitter";

export const alertQueue = new Queue("alerts");

alertQueue.process(async function (job, done) {
  const artBlock: ArtBlockInfo = job.data;
  const contractVersion = job.data.contractVersion;
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

  try {
    await discordAlertForArtBlock(artBlock);
  } catch (e) {
    console.error(contractVersion, "ERROR: Discord post failed");
  }
  done();
});
