import { ArtBlockInfo } from "./api_data";
import axios from "axios";
import { config } from "./config";

export const discordAlertForArtBlock = async (artBlock: ArtBlockInfo) => {
  const title = artBlock.name;
  const description = `[${artBlock.name}](${artBlock.external_url}) Minted by: \n ${artBlock.mintedBy}`;
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
