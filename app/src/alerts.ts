import { getArtblockInfo } from './artblocks_api';
import { ArtBlockContract__factory } from './contracts/factories/ArtBlockContract__factory';
import { twitterClient, uploadTwitterImage, tweetArtblock } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');
import { artBlocksContract, ethersProvider } from './ethereum';

export const alertForBlocks = async (startingBlock: number, endingBlock: number) => {
    const allEvents = await artBlocksContract.queryFilter({address:artBlocksContract.address}, 
        startingBlock, 
        endingBlock);
    const mintEvents = allEvents.filter(e => e.event === 'Mint');
    
    const mintedTokenIds: string[] = mintEvents.map(me => me.args['_tokenId'].toString());
    console.log('Found mintedTokenIds', JSON.stringify(mintedTokenIds));
    for(let x=0; x<mintedTokenIds.length; x=x+1) {
        const tokenId = mintedTokenIds[x];
        console.log('Alerting for', tokenId);
        const artBlock = await getArtblockInfo(tokenId);
        const tweetResp = await tweetArtblock(artBlock);
        console.log('Tweet', `https://twitter.com/artblockmints/status/${tweetResp.id_str}`);
        await delay(500);
    }
}