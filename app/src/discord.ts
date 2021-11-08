import { ArtBlockInfo, ArtBlocksResponse } from "./artblocks_api";
import axios from "axios";
import { config } from "./config";

export const discordAlertForArtBlock = async (
  artBlock: ArtBlockInfo,
  postUrl: string,
  noEmbedUrl?: string
) => {
  // noEmbedUrl embeds a link without a discord preview being generated
  const noEmbedString = noEmbedUrl ? `\n <${noEmbedUrl}>` : "";
  let discordText = `${artBlock.name} minted${
    artBlock.mintedBy ? ` by ${artBlock.mintedBy}` : ""
  }. ${noEmbedString} \n ${postUrl}`;

  return axios.post(config.discordWebhookUrl, {
    content: discordText,
  });
};
