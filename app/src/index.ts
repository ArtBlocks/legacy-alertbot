import { getAppropriateEndingBlock, getLastBlockAlerted, setLastBlockAlerted } from './storage';
import { getArtblockInfo } from './artblocks_api';
import { ArtBlockContract__factory } from './contracts/factories/ArtBlockContract__factory';
import { twitterClient, uploadTwitterImage, tweetArtblock } from './twitter';
import axios from 'axios';
import * as fs from 'fs';
import delay = require('delay');
import { artBlocksContract, ethersProvider } from './ethereum';
import { alertForBlocks } from './alerts';
import { schedule } from 'node-cron';

const goLogs = async () => {
    await alertForBlocks(11342890, 11342900)
}

let isRunning = false;
const tick = async () => {
    if (isRunning) {
        console.log(`Not ticking because running`);
        return;
    }
    
    console.log(`${new Date().toLocaleString()} Ticking...`);
    
    const lastBlockAlerted = await getLastBlockAlerted();
    if (!lastBlockAlerted) {
        throw new Error(`No last block set`);
    }
    const endingBlock = await getAppropriateEndingBlock();
    console.info(`Querying for `, { lastBlockAlerted, endingBlock});
    
    isRunning = true;
    try {
        await alertForBlocks(lastBlockAlerted, endingBlock);
        await setLastBlockAlerted(endingBlock);
        console.log('Tick successfully completed');
    } catch(e) {
        console.log('error');
        console.error(e);
        console.log('Tick errored out.');
    } finally {
        isRunning = false;
    }
    
    
}

tick();
schedule('*/2 * * * *', tick);
