import { artBlocksContract } from "./ethereum";
import delay = require("delay");

const go = async () => {
  // const tokenId = '1331';
  // const artBlock = await getArtblockInfo(tokenId);
  // console.log({artBlock});

  const contract = artBlocksContract;

  const info: [number, string][] = [];

  let tokenId = 1000;
  const endCount = 3314;
  while (tokenId <= endCount) {
    // console.log(tokenId);

    let curTokenHash = "error";
    try {
      const contractRes = await contract.showTokenHashes(tokenId.toString());
      curTokenHash = contractRes[0];
    } catch (e) {
      console.error(e);
    }

    info.push([tokenId, curTokenHash]);

    await delay(50);
    tokenId += 1;
  }

  //console.log(JSON.stringify(info));

  info.forEach((a, b) => {
    console.log(`${a},${b}`);
  });
};

go().then(() => {
  process.exit();
});
