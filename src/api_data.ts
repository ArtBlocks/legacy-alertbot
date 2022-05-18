import axios from 'axios';
import { config } from './config';

export interface ArtBlocksResponse {
  platform: string;
  name: string;
  description: string;
  external_url: string;
  artist: string;
  royaltyInfo: RoyaltyInfo;
  traits: Trait[];
  website: string;
  'is dynamic': boolean;
  'script type': string;
  'aspect ratio (w/h)': string;
  'hashes per token': string;
  tokenID: string;
  'token hash(es)': string[];
  license: string;
  image: string;
}

export interface RoyaltyInfo {
  artistAddress: string;
  additionalPayee: string;
  additionalPayeePercentage: string;
  royaltyFeeByID: string;
}

export interface Trait {
  trait_type: string;
  value: string;
}

export interface ArtBlockInfo extends ArtBlocksResponse {
  mintedBy?: string;
  imgBinary?: Buffer;
}

export interface Response {
  data: any;
}

const getTokenResp = async (tokenId: string): Promise<Response> => {
  try {
    // Use {contract}/{tokenId} if PBAB project, / {tokenId} if AB project
    return process.env.IS_PBAB === 'true'
      ? await axios.get(
          `https://token.artblocks.io/${process.env.PBAB_CONTRACT}/${tokenId}`
        )
      : await axios.get(`https://token.artblocks.io/${tokenId}`);
  } catch (e) {
    console.warn(`[WARN] No Data for token: ${tokenId} `);
  }
};

const getImageResp = async (
  tokenId: string,
  abResp: ArtBlocksResponse
): Promise<Response> => {
  const thumbnailLocation = config?.thumbnailLocation || '';

  // If no thumbnailLocation provided, use image field from token endpoint resp
  const imageUrl =
    thumbnailLocation.length > 0
      ? `${thumbnailLocation}/${tokenId}.png`
      : abResp.image;

  try {
    return await axios.get(imageUrl, {
      responseType: 'arraybuffer',
    });
  } catch (e) {
    console.error(`[ERROR] No image data at ${imageUrl}`);
  }
};

export const getOpenseaInfo = async (account: string): Promise<string> => {
  const openSeaResp = await axios.get(
    `https://api.opensea.io/account/${account}/`
  );
  const openSeaRespData = openSeaResp.data as {
    data: {
      user?: {
        username: string;
      };
    };
  };
  if (
    openSeaRespData &&
    openSeaRespData.data &&
    openSeaRespData.data.user &&
    openSeaRespData.data.user.username
  ) {
    return openSeaRespData.data.user.username;
  }
};

export const getArtblockInfo = async (
  tokenId: string
): Promise<ArtBlockInfo> => {
  const apiResponse = await getTokenResp(tokenId);
  const abResp = apiResponse.data as ArtBlocksResponse;
  const imageResp = await getImageResp(tokenId, abResp);
  if (imageResp && imageResp.data) {
    console.log('[INFO] Found Image - Proceeding');
    const imgBinary = Buffer.from(imageResp.data, 'binary');
    return {
      ...abResp,
      imgBinary,
    };
  } else {
    console.error('[ERROR] Image Not Found - Proceeding');
    return abResp;
  }
};
