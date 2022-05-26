import { ArtBlockInfo } from './api_data';
import axios from 'axios';
import { config } from './config';
import { isArtblocksContract } from './utils';

const discordAlertForArtBlock = async (artBlock: ArtBlockInfo) => {
  const title = artBlock.name;
  const description = `[${artBlock.name}](${artBlock.external_url}) \n ${
    artBlock.mintedBy ? `\n Minted by: ${artBlock.mintedBy}` : ''
  }`;
  const image = { url: artBlock.image };

  const payload = {
    embeds: [
      {
        title,
        description,
        image,
      },
    ],
  };
  console.log(
    `[INFO] Attempting to send Discord Message: ${JSON.stringify(payload)}`
  );

  let discordWebhook = config.discordWebhookUrl;
  if (
    !(process.env.IS_PBAB === 'true') &&
    !isArtblocksContract(artBlock.contract)
  ) {
    discordWebhook = config.pbabDiscordWebhookUrl;
  }
  return axios.post(discordWebhook, payload);
};

export const sendToDiscord = async (artBlock: ArtBlockInfo) => {
  try {
    const discordResp = await discordAlertForArtBlock(artBlock);
    console.log(`[INFO] Discord Message sent.`);
    return discordResp;
  } catch (e) {
    console.error(
      `[ERROR] Discord post failed for ${JSON.stringify(artBlock.tokenID)}`,
      JSON.stringify(e)
    );
  }
};
