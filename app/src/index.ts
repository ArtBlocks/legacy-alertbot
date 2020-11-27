import { twitterClient, uploadTwitterImage } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');

const goImageNew = async () => {
    try {
        const mediaId = await uploadTwitterImage('https://api.artblocks.io/image/358');
        
        const tweetRes = await twitterClient.tweets.statusesUpdate({
            status: 'check it, again',
            media_ids: mediaId
        });
        console.log({tweetRes});
    } catch(e) {
        console.error(e);
    }

    await delay(500);
}

goImageNew().then(() => {
    process.exit();
})