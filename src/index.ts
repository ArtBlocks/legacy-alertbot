import { schedule } from 'node-cron';
import { mintQueue, queueClean } from './mint_queue';
import { config } from './config';

require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
app.use(express.json());

const skippedProjects = new Set([289]);

const allowed = (webhookHeader: string) => {
  if (
    webhookHeader === config.webhookSecret ||
    process.env.NODE_ENV === 'test'
  ) {
    return true;
  } else {
    return false;
  }
};

const AB_CONTRACTS =
  process.env.NODE_ENV === 'test'
    ? ['0x87c6e93fc0b149ec59ad595e2e187a4e1d7fdc25']
    : [
        '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a',
        '0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270',
      ];

const contractAllowed = (contract: string) => {
  return process.env.IS_PBAB === 'true'
    ? process.env.PBAB_CONTRACT.toLowerCase().includes(contract.toLowerCase())
    : AB_CONTRACTS.includes(contract.toLowerCase());
};

app.post('/', (req: any, res: any) => {
  // Return early if webhook request is unauthorized.
  if (!allowed(req.get('webhook_secret'))) {
    // https://httpwg.org/specs/rfc7235.html#status.401
    res.status(401).json({ status: 'unauthorized' });
    return;
  }

  const newData = req?.body?.event?.data?.new;
  const oldData = req?.body?.event?.data?.old;
  console.log('[INFO] Received Webhook for ', newData);

  // Return early if token has not been modified.
  if (newData == null || oldData.image_id) {
    // https://httpwg.org/specs/rfc7232.html#status.304
    res.status(304).json({ status: 'not modified' });
    return;
  }

  // Return early if contract is not a known/allowed contract.
  if (!contractAllowed(newData?.contract_address)) {
    // https://httpwg.org/specs/rfc7231.html#status.501
    res.status(501).json({ status: 'not implemented' });
    return;
  }

  // Return early if token ID is a mint #0.
  const tokenId = newData?.token_id;
  if (tokenId % 1e6 === 0) {
    // https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2
    res.status(418).json({ status: "I'm a teapot" });
    return;
  }

  // Return early if project is a skipped project.
  const projectId = Math.floor(tokenId / 1e6);
  if (skippedProjects.has(projectId)) {
    // https://datatracker.ietf.org/doc/html/rfc2324#section-2.3.2
    res.status(418).json({ status: "I'm a teapot" });
    return;
  }

  const ownerAddress = newData?.owner_address;
  mintQueue.add({ tokenId, ownerAddress });
  // https://datatracker.ietf.org/doc/html/rfc7231#section-6.3.3
  res.status(202).json({ status: 'accepted' });
});

app.listen(port, () => {
  console.log('listening on ', port);
});

schedule('0 0 * * *', queueClean);

module.exports = app;
