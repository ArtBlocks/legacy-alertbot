import { artBlocksContract } from './ethereum';
import axios from 'axios';

export interface ArtBlocksResponse {
    platform:             string;
    name:                 string;
    description:          string;
    external_url:         string;
    artist:               string;
    royaltyInfo:          RoyaltyInfo;
    traits:               Trait[];
    website:              string;
    "is dynamic":         boolean;
    "script type":        string;
    "aspect ratio (w/h)": string;
    "hashes per token":   string;
    tokenID:              string;
    "token hash(es)":     string[];
    license:              string;
    image:                string;
}

export interface RoyaltyInfo {
    artistAddress:             string;
    additionalPayee:           string;
    additionalPayeePercentage: string;
    royaltyFeeByID:            string;
}

export interface Trait {
    trait_type: string;
    value:      string;
}

export interface ArtBlockInfo extends ArtBlocksResponse {
    mintedBy?: string;
}

export const getArtblockInfo = async (tokenId: string): Promise<ArtBlockInfo> => {
    const apiResponse = await axios.get(`https://api.artblocks.io/token/${tokenId}`);
    const abResp = apiResponse.data as ArtBlocksResponse;
    
    try {
        
        const ownerAddress = await artBlocksContract.ownerOf(tokenId);
        let mintedBy = ownerAddress.toLowerCase();
        
        try {
            const openSeaResp = await axios.get(`https://api.opensea.io/account/${mintedBy}/`);
            const openSeaRespData = openSeaResp.data as {
                data: {
                    user?: {
                        username: string;
                    }
                }
            }
            if (openSeaRespData && openSeaRespData.data && openSeaRespData.data.user && openSeaRespData.data.user.username) {
                mintedBy = openSeaRespData.data.user.username;
            }
        } catch(e) {
            console.error(`error fetching opensea info`);
            return;
        }
        
        return {
            ...abResp,
            mintedBy
        }
    } catch(e) {
        console.error(e);
        return abResp;
    }
    
}