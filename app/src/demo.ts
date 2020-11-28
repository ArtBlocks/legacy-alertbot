import { discordAlertForArtBlock } from './discord';
import { getArtblockInfo } from './artblocks_api';


const go = async () => {
    const tokenId = '1331';
    const artBlock = await getArtblockInfo(tokenId);
    const discordResp = await discordAlertForArtBlock(artBlock, 'https://twitter.com/artblockmints/status/1332815054593548289');
    console.log({discordResp});
}

go().then(() => {
    process.exit();
})