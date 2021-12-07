const Queue = require("bull");
import { TweetV1 } from "twitter-api-v2";
import { discordAlertForArtBlock } from "./discord";
import { tweetArtblock } from "./twitter";

export const alertQueue = new Queue("alerts");

alertQueue.process(async function (job, done) {
  const artBlock = job.data;
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
  done();
});
