import { getPBABContracts } from './api_parser';
require('dotenv').config();
export const AB_CONTRACTS =
  process.env.NODE_ENV === 'test'
    ? ['0x87c6e93fc0b149ec59ad595e2e187a4e1d7fdc25']
    : [
        '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a',
        '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
      ];

export function isArtblocksContract(contract: string): boolean {
  return AB_CONTRACTS.includes(contract.toLowerCase());
}

export async function isPBABContract(contract: string): Promise<boolean> {
  let pbabContracts = await getPBABContracts();
  return pbabContracts.includes(contract.toLowerCase());
}
