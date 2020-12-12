import { V2ArtBlockContract__factory } from "./contracts/factories/V2ArtBlockContract__factory";
import { config } from "./config";
import { ethers } from "ethers";
import { ArtBlockContract__factory } from "./contracts/factories/ArtBlockContract__factory";
export const ethersProvider = new ethers.providers.InfuraProvider(
  "homestead",
  config.infuraId
);

export const artBlocksContract = ArtBlockContract__factory.connect(
  "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a",
  ethersProvider
);
export const v2ArtBlocksContract = V2ArtBlockContract__factory.connect(
  "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270",
  ethersProvider
);
