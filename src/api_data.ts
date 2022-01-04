import { artBlocksContract, v2ArtBlocksContract } from "./ethereum";
import axios from "axios";
import { sleep } from "./utils";

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
  imgBinary?: Buffer;
}

export interface Response {
  data: any;
}

const getTokenResp = async (tokenId: string): Promise<Response> => {
    try {
      return await axios.get(`https://token.artblocks.io/${tokenId}`);
    } catch (e) {
      console.warn(
        `[WARN] No Data for token: ${tokenId}`
      );
  }
};

const getImageResp = async (imageUrl: string): Promise<Response> => {
    try {
      return await axios.get(imageUrl, {
        responseType: "arraybuffer",
      });
    } catch (e) {
      console.warn(
        `[WARN] No image data at ${imageUrl}`
      );
    }
};

export const getMinterAddress = async (
  tokenId: string,
  contractVersion: "original" | "v2"
) => {
  const contractToUse =
    contractVersion === "original" ? artBlocksContract : v2ArtBlocksContract;
  const ownerAddress = await contractToUse.ownerOf(tokenId);
  return ownerAddress.toLowerCase();
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
  const imageResp = await getImageResp(abResp.image);
  if (imageResp && imageResp.data) {
    console.log("[INFO] Found Image - Proceeding")
    const imgBinary = Buffer.from(imageResp.data, "binary");
    return {
      ...abResp,
      imgBinary,
    };
  } else {
    console.warn("[WARN] Image Not Found - Proceeding")
    return abResp
  }
};
