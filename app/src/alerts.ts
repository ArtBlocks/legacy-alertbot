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
    console.log(mintEvents[1]);
    
    const mintedTokenIds: string[] = mintEvents.map(me => me.args['_tokenId'].toString());
    for(let x=0; x<mintedTokenIds.length; x=x+1) {
        const tokenId = mintedTokenIds[x];
        const artBlock = await getArtblockInfo(tokenId);
        const tweetResp = await tweetArtblock(artBlock);
        console.log({tweetResp});
        await delay(500);
    }
}