require('dotenv').config()
import {
  getAppropriateEndingBlock,
  getLastBlockAlerted,
  setLastBlockAlerted,
  initialize,
} from "./storage";
import { alertForBlocks } from "./alerts";
import { schedule } from "node-cron";
import { queueClean } from "./mint_queue";

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

const initializeTick = async () => {
  await initialize();
  if (process.env.NODE_ENV != "production") {
    // run immediately when testing locally for faster workflow
    tick(); 
  }
  schedule("*/2 * * * *", tick);
};

initializeTick();

// clean stale queue keys once per day
schedule("0 0 * * *", queueClean);
