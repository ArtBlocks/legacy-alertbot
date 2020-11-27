import { config } from './config';
import { TwitterClient } from 'twitter-api-client';

// console.log({config});
export const twitterClient = new TwitterClient({
    apiKey: config.twitterApiKey,
    apiSecret: config.twitterApiSecret,
    accessToken: config.twitterOauthToken,
    accessTokenSecret: config.twitterOauthSecret,
  });
  
  