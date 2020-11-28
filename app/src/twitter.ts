import { config } from './config';
import { TwitterClient } from 'twitter-api-client';
import axios from 'axios';
import { ArtBlocksResponse } from './artblocks_api';

// console.log({config});
export const twitterClient = new TwitterClient({
    apiKey: config.twitterApiKey,
    apiSecret: config.twitterApiSecret,
    accessToken: config.twitterOauthToken,
    accessTokenSecret: config.twitterOauthSecret,
  });
  
  export const uploadTwitterImage = async (imageUrl: string): Promise<string | undefined> => {
    const imageResp = await axios.get(imageUrl, {responseType: 'arraybuffer'});
    const imageData = imageResp.data as any;
    const based = Buffer.from(imageData, 'binary').toString('base64');
    
    try {
      const uploadRes = await twitterClient.media.mediaUpload({
          media_data: based
      });
      console.log({uploadRes});
      return uploadRes.media_id_string;
  } catch(e) {
      console.error(e);
      return undefined;
  }
}

export const tweetArtblock = async (artBlock: ArtBlocksResponse) => {
  if (!artBlock.image) {
    console.error('No artblock iage defined', JSON.stringify(artBlock));
    return;
  }
  
  console.log('uploading', artBlock.image);
  const mediaId = await uploadTwitterImage(artBlock.image);
  
  const tweetText = `${artBlock.name} minted. \n\n https://artblocks.io/token/${artBlock.tokenID}`;
  console.log(`tweeting ${tweetText}`)
  
  return twitterClient.tweets.statusesUpdate({
    status: tweetText,
    media_ids: mediaId
  })
}