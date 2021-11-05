import { config } from "./config";
import { TwitterClient } from "twitter-api-client";
import axios from "axios";
import { ArtBlockInfo, ArtBlocksResponse } from "./artblocks_api";
import { sleep } from "./utils";

const IMAGE_RETRIES = 15;
const IMAGE_RETRY_DELAY_MS = 18 * 1000;

// console.log({config});
export const twitterClient = new TwitterClient({
  apiKey: config.twitterApiKey,
  apiSecret: config.twitterApiSecret,
  accessToken: config.twitterOauthToken,
  accessTokenSecret: config.twitterOauthSecret,
});

export interface Response {
  data: any;
}

const getImageResp = async (imageUrl: string): Promise<Response> => {
  for (let i = 0; i < IMAGE_RETRIES; i++) {
    try {
      const imageResp = await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
      return imageResp;
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
  const imageResp = await getImageResp(imageUrl);
  const imageData = imageResp.data as any;
  const based = Buffer.from(imageData, "binary").toString("base64");

  try {
    const uploadRes = await twitterClient.media.mediaUpload({
      media_data: based,
    });
    return uploadRes.media_id_string;
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

  const tweetText = `${artBlock.name} minted${
    artBlock.mintedBy ? ` by ${artBlock.mintedBy}` : ""
  }. \n\n https://artblocks.io/token/${artBlock.tokenID}`;
  console.log(`Tweeting ${tweetText}`);

  const tweetRes = await twitterClient.tweets.statusesUpdate({
    status: tweetText,
    media_ids: mediaId,
  });

  return {
    tweetRes,
    tweetUrl: `https://twitter.com/artblockmints/status/${tweetRes.id_str}`,
  };
};
