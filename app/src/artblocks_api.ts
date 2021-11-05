import { artBlocksContract, v2ArtBlocksContract } from "./ethereum";
import axios from "axios";
import { sleep } from "./utils";

const TOKEN_RETRIES = 15;
const TOKEN_RETRY_DELAY_MS = 12 * 1000;

export interface ArtBlocksResponse {
  platform: string;
  name: string;
  description: string;
  external_url: string;
  artist: string;
  royaltyInfo: RoyaltyInfo;
  traits: Trait[];
  website: string;
  "is dynamic": boolean;
  "script type": string;
  "aspect ratio (w/h)": string;
  "hashes per token": string;
  tokenID: string;
  "token hash(es)": string[];
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
}

export interface Response {
  data: any;
}

const getTokenResp = async (tokenId: string): Promise<Response> => {
  for (let i = 0; i < TOKEN_RETRIES; i++) {
    try {
      const apiResponse = await axios.get(
        `https://token.artblocks.io/${tokenId}`
      );
      return apiResponse;
    } catch (e) {
      console.error(e);
      console.error(
        `Error while fetching image data. Try ${i + 1} of ${TOKEN_RETRIES}`
      );
      await sleep(TOKEN_RETRY_DELAY_MS);
    }
  }
};

export const getArtblockInfo = async (
  tokenId: string,
  contractVersion: "original" | "v2"
): Promise<ArtBlockInfo> => {
  const apiResponse = await getTokenResp(tokenId);
  const abResp = apiResponse.data as ArtBlocksResponse;

  try {
    const contractToUse =
      contractVersion === "original" ? artBlocksContract : v2ArtBlocksContract;
    const ownerAddress = await contractToUse.ownerOf(tokenId);
    let mintedBy = ownerAddress.toLowerCase();

    try {
      const openSeaResp = await axios.get(
        `https://api.opensea.io/account/${mintedBy}/`
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
        mintedBy = openSeaRespData.data.user.username;
      }
    } catch (e) {
      console.error(`error fetching opensea info`);
      return;
    }

    return {
      ...abResp,
      mintedBy,
    };
  } catch (e) {
    console.error(e);
    return abResp;
  }
};
