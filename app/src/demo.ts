import { discordAlertForArtBlock } from './discord';
import { getArtblockInfo } from './artblocks_api';


const go = async () => {
    const tokenId = '1331';
    const artBlock = await getArtblockInfo(tokenId);
    console.log({artBlock});
}

go().then(() => {
    process.exit();
})