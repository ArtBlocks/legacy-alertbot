import { config } from "./config";
import { TwitterApi } from "twitter-api-v2";
import axios from "axios";
import { ArtBlockInfo, ArtBlocksResponse } from "./artblocks_api";
import { sleep } from "./utils";

const IMAGE_RETRIES = 35;
const IMAGE_RETRY_DELAY_MS = 25 * 1000;
const TWITTER_TIMEOUT_MS = 14 * 1000;

export const twitterClientV2 = new TwitterApi({
  appKey: config.twitterApiKey,
  appSecret: config.twitterApiSecret,
  accessToken: config.twitterOauthToken,
  accessSecret: config.twitterOauthSecret,
});

export interface Response {
  data: any;
}

function timeout(timeoutMs: number, failureMessage: string): Promise<never> {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(failureMessage), timeoutMs);
  });
}

const uploadTwitterMediaWithTimeout = async (
  timeoutMs: number,
  based: Buffer
) => {
  // use race function to timeout because twitter library doesn't timeout
  return Promise.race([
    timeout(TWITTER_TIMEOUT_MS, "Twitter post timed out"),
    twitterClientV2.v1.uploadMedia(based, { type: "png" }),
  ]);
};

const getImageResp = async (imageUrl: string): Promise<Response> => {
  for (let i = 0; i < IMAGE_RETRIES; i++) {
    try {
      return await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
    } catch (e) {
      console.error(e);
      console.error(
        `Error while fetching image data. Try ${i + 1} of ${IMAGE_RETRIES}`
      );
      await sleep(IMAGE_RETRY_DELAY_MS);
    }
  }
};

export const uploadTwitterImage = async (
  imageUrl: string
): Promise<string | undefined> => {
  console.log("Getting image from artblocks at: ", imageUrl);
  const imageResp = await getImageResp(imageUrl);
  const imageData = imageResp.data as any;
  const based = Buffer.from(imageData, "binary");

  try {
    console.log("Uploading received image to Twitter");
    const uploadRes = await uploadTwitterMediaWithTimeout(
      TWITTER_TIMEOUT_MS,
      based
    );
    return uploadRes;
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const tweetArtblock = async (artBlock: ArtBlockInfo) => {
  if (!artBlock.image) {
    console.error("No artblock image defined", JSON.stringify(artBlock));
    return;
  }

  const imageUrl = artBlock.image;

  console.log("Uploading", imageUrl, "original", artBlock.image);
  const mediaId = await uploadTwitterImage(imageUrl);
  if (!mediaId) {
    console.error("no media id returned, not tweeting");
    return;
  }
  console.log(`Uploaded image ${imageUrl} complete. Tweeting...`);
  const tweetText = `${artBlock.name} minted${
    artBlock.mintedBy ? ` by ${artBlock.mintedBy}` : ""
  }. \n\n https://artblocks.io/token/${artBlock.tokenID}`;
  console.log(`Tweeting ${tweetText}`);

  const tweetRes = await twitterClientV2.v1.tweet(tweetText, {
    media_ids: mediaId,
  });

  return {
    tweetRes,
    tweetUrl: `https://twitter.com/artblockmints/status/${tweetRes.id_str}`,
  };
};
