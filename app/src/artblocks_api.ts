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

export const getArtblockInfo = async (tokenId: string) => {
    const res = await axios.get(`https://api.artblocks.io/token/${tokenId}`);
    console.log(`data: ${res.data} for ${tokenId} https://api.artblocks.io/token/${tokenId}`)
    return res.data as ArtBlocksResponse;
}