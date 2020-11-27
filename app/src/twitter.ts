import { config } from './config';
import { TwitterClient } from 'twitter-api-client';
import axios from 'axios';

// console.log({config});
export const twitterClient = new TwitterClient({
    apiKey: config.twitterApiKey,
    apiSecret: config.twitterApiSecret,
    accessToken: config.twitterOauthToken,
    accessTokenSecret: config.twitterOauthSecret,
  });
  
  export const uploadTwitterImage = async (imageUrl: string): Promise<string | undefined> => {
    const imageResp = await axios.get('https://api.artblocks.io/image/358', {responseType: 'arraybuffer'});
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