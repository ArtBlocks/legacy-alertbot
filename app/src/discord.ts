import { ArtBlockInfo } from "./api_data";
import axios from "axios";
import { config } from "./config";

const discordAlertForArtBlock = async (artBlock: ArtBlockInfo) => {
  const title = artBlock.name;
  const description = `[${artBlock.name}](${artBlock.external_url}) \n ${artBlock.mintedBy ? `\n Minted by: ${artBlock.mintedBy}` : ""}`;
  const image = { url: artBlock.image };

  return axios.post(config.discordWebhookUrl, {
    embeds: [
      {
        title,
        description,
        image,
      },
    ],
  });
};

export const sendToDiscord = async (
  artBlock: ArtBlockInfo,
  contractVersion: string
) => {
  try {
    const discordResp = await discordAlertForArtBlock(artBlock);
    return discordResp;
  } catch (e) {
    console.error(contractVersion, "ERROR: Discord post failed");
  }
};
