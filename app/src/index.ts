import { getArtblockInfo } from './artblocks_api';
import { ArtBlockContract__factory } from './contracts/factories/ArtBlockContract__factory';
import { twitterClient, uploadTwitterImage, tweetArtblock } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');
import { artBlocksContract, ethersProvider } from './ethereum';

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
    //artBlocksContract.queryFilter()
    const allEvents = await artBlocksContract.queryFilter({address:artBlocksContract.address}, 
        11342700, 
        11342900);
    const mintEvents = allEvents.filter(e => e.event === 'Mint');
    console.log(mintEvents[1]);
    
    const mintedTokenIds: string[] = mintEvents.map(me => me.args['_tokenId'].toString());
    console.log({mintedTokenIds});
    
    // const apiUrls = mintedTokenIds.map(mi => {
    //     return `https://api.artblocks.io/token/${mi}`;
    // })
    // console.log({apiUrls});
    
    for (let x=0; x<mintedTokenIds.length, ++x;) {
        const tokenId = mintedTokenIds[x];
        const artBlock = await getArtblockInfo(tokenId);
        const tweetResp = await tweetArtblock(artBlock);
        console.log({tweetResp});
        await delay(500);
    }
    
    // https://api.artblocks.io/token/470
    
    // const apiUrlPromises = mintedTokenIds.map(mi => {
    //     return artBlocksContract.tokenURI(mi);
    // })
    // const apiUrls = await Promise.all(apiUrlPromises);
    // console.log({apiUrls});
}

goLogs().then(() => {
    process.exit();
})