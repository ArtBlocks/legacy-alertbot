import { getArtblockInfo } from './artblocks_api';
import { ArtBlockContract__factory } from './contracts/factories/ArtBlockContract__factory';
import { twitterClient, uploadTwitterImage, tweetArtblock } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');
import { artBlocksContract, ethersProvider } from './ethereum';
import { alertForBlocks } from './alerts';

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

const goLogs = async () => {
    
    await alertForBlocks(11342890, 11342900)
}

goLogs().then(() => {
    process.exit();
})