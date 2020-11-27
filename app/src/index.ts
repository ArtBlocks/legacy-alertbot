import { twitterClient } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');

const goImageNew = async () => {
    const imageResp = await axios.get('https://api.artblocks.io/image/358', {responseType: 'arraybuffer'});
    const imageData = imageResp.data as any;
    const based = Buffer.from(imageData, 'binary').toString('base64');
    
    try {
        const uploadRes = await twitterClient.media.mediaUpload({
            media_data: based
        });
        console.log({uploadRes});
        
        const tweetRes = await twitterClient.tweets.statusesUpdate({
            status: 'check it',
            media_ids: uploadRes.media_id_string
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