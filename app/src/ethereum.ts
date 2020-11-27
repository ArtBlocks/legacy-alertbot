import { config } from "./config";
import {ethers} from "ethers";
import { ArtBlockContract__factory } from "./contracts/factories/ArtBlockContract__factory";
export const ethersProvider = new ethers.providers.InfuraProvider(
  "homestead",
  config.infuraId
);

export const artBlocksContract = ArtBlockContract__factory.connect('0x059edd72cd353df5106d2b9cc5ab83a52287ac3a', ethersProvider);