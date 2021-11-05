import { ethersProvider } from './ethereum';
import {getRedisAsync, setRedisAsync} from './redis_util';

const KEY_NAME = 'last_block';
const INITIALIZED_KEY_NAME = "initialized";

const getInitialized = async (): Promise<boolean> => {
  const foundVal = await getRedisAsync(INITIALIZED_KEY_NAME);
  return !!foundVal;
};

const setInitialized = async () => {
  await setRedisAsync(INITIALIZED_KEY_NAME, "initialized");
};

const getMostRecentBlockWithOffset = async (): Promise<number> => {
  const mostRecentBlock = await ethersProvider.getBlock("latest");
  return (
    mostRecentBlock.number - parseInt(process.env.BLOCK_CONFIRMATIONS_OFFSET)
  );
};

export const initialize = async () => {
  // short-circuit if already initialized
  if (await getInitialized()) {
    console.log("Already initialized");
    return;
  }
  // initialize last_block with env var if exists, else recent block
  const initialLastBlockAlerted = process.env
    .OVERRIDE_LAST_BLOCK_ALERTED_ON_INITIALIZE
    ? parseInt(process.env.OVERRIDE_LAST_BLOCK_ALERTED_ON_INITIALIZE)
    : (await getMostRecentBlockWithOffset()) - 1;
  console.log(`Initializing last block alerted to: ${initialLastBlockAlerted}`);
  setLastBlockAlerted(initialLastBlockAlerted);
  // set initialized so we don't re-initialize on future updates
  setInitialized();
};

export const getLastBlockAlerted = async (): Promise<number | undefined> => {
  const foundVal = await getRedisAsync(KEY_NAME);
  if (!foundVal) {
    return undefined;
  }
  return parseInt(foundVal);
};

export const setLastBlockAlerted = async (blockNumber: number) => {
  await setRedisAsync(KEY_NAME, blockNumber.toString());
};

export const getAppropriateEndingBlock = async (): Promise<number> => {
  const mostRecentBlockNumber = await getMostRecentBlockWithOffset();
  const lastBlockAlerted = await getLastBlockAlerted();
  if (!lastBlockAlerted) {
    throw new Error(`No last block alerted`);
  }

  const numBlocksAhead = mostRecentBlockNumber - lastBlockAlerted;

  if (numBlocksAhead > 300) {
    // at most fetch 300 blocks ahed
    const res = lastBlockAlerted + 300;
    console.warn(`Only advancing 300 blocks`, {
      res,
      numBlocksAhead,
      lastBlockAlerted,
      mostRecentBlockNumber,
    });
    return res;
  } else {
    console.info(`Advancing to ${mostRecentBlockNumber}`);
    return mostRecentBlockNumber;
  }
};