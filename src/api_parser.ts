import { AB_CONTRACTS } from './utils';
const { createClient, gql } = require('@urql/core');
const parse = require('node-html-parser').parse;
const fetch = require('node-fetch');
const API_URL = 'https://api.thegraph.com/subgraphs/name/artblocks/art-blocks';

const client = createClient({
  url: API_URL,
  fetch: fetch,
  fetchOptions: () => ({
    headers: {
      'Content-Type': 'application/json',
    },
  }),
});

const _getPBABContracts = gql`
  query getPBABContracts($ids: [ID]!) {
    contracts(where: { id_not_in: $ids }) {
      id
    }
  }
`;

/**
 * gets all PBAB Contracts from The Graph
 */
export async function getPBABContracts() {
  try {
    const result = await client
      .query(_getPBABContracts, {
        ids: Object.values(AB_CONTRACTS),
      })
      .toPromise();
    return result.data.contracts.map(({ id }: { id: string }) => id);
  } catch (err) {
    console.error(err);
    return undefined;
  }
}
