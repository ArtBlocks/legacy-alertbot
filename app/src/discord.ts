import { ArtBlocksResponse } from './artblocks_api';
import axios from 'axios';
import {config} from './config';

export const discordAlertForArtBlock = async (artBlock: ArtBlocksResponse, twitterUrl: string) => {
    const discordText = `${artBlock.name} minted. \n\n https://artblocks.io/token/${artBlock.tokenID} \n ${twitterUrl}`;
    
    return axios.post(config.discordWebhookUrl, {
        content: discordText,
        embeds: [
            {image: {url:artBlock.image}}
        ]
    });
}