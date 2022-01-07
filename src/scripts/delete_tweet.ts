require("dotenv").config({ path: "./.env.prod" });
import { TwitterApi } from "twitter-api-v2";

/**
 * This is intended to be ran locally to delete any accidental tweets
 * via Twitter's api.
 * It may be ran via the delete-tweet script in package.json
 */

const twitterClientV2 = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_OAUTH_TOKEN,
  accessSecret: process.env.TWITTER_OAUTH_SECRET,
});

const main = async () => {
  const _tweetId: string = process.argv[2];
  console.log(`Deleting tweet ${_tweetId}`);
  try {
    await twitterClientV2.v1.deleteTweet(_tweetId);
    console.log(`Tweet ${_tweetId} Deleted!`);
  } catch (e) {
    console.error(e);
  }
};

main();
