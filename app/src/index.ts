import {
  getAppropriateEndingBlock,
  getLastBlockAlerted,
  setLastBlockAlerted,
  initialize,
} from "./storage";
import { getArtblockInfo } from "./artblocks_api";
import { ArtBlockContract__factory } from "./contracts/factories/ArtBlockContract__factory";
import { twitterClient, uploadTwitterImage, tweetArtblock } from "./twitter";
import axios from "axios";
import * as fs from "fs";
import delay = require("delay");
import { artBlocksContract, ethersProvider } from "./ethereum";
import { alertForBlocks } from "./alerts";
import { schedule } from "node-cron";

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
  console.info(`Querying for `, { lastBlockAlerted, endingBlock });

  isRunning = true;
  try {
    await alertForBlocks(lastBlockAlerted, endingBlock, "original");
    await alertForBlocks(lastBlockAlerted, endingBlock, "v2");
    console.log("Tick successfully completed.");
  } catch (e) {
    console.log("error");
    console.error(e);
    console.log("Tick errored out.");
  } finally {
    await setLastBlockAlerted(endingBlock);
    isRunning = false;
  }
};

const initialTick = async () => {
  await initialize();
  tick();
};

initialTick();
schedule("*/2 * * * *", tick);
