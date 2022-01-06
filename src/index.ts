import { schedule } from "node-cron"
import { mintQueue, queueClean } from "./mint_queue"
import { config } from "./config";

require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8000
app.use(express.json())


const contracts = () => {
  const addys = {
    mainnet: ["0x059edd72cd353df5106d2b9cc5ab83a52287ac3a", "0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270"],
    dev: ["0x87c6e93fc0b149ec59ad595e2e187a4e1d7fdc25"]
  }
  if(process.env.NODE_ENV === 'production' ) {
    return addys.mainnet
  } else {
    return addys.dev
  }
}

const allowed = (webhookHeader: string) => {
  if(webhookHeader === config.webhookSecret || process.env.NODE_ENV === "test") {
    return true
  } else {
    return false
  }
}

const contractAllowed = (contract: string) => {
  return contracts().includes(contract)
}

app.post('/', (req: any, res: any) => {
  if(allowed(req.get('webhook_secret'))) {
    const newData = req?.body?.event?.data?.new
    const oldData = req?.body?.event?.data?.old
    if(newData && !oldData.image_id && contractAllowed(newData?.contract_address)) {
      console.log("[INFO] Received Webhook for ", newData)
      const tokenId = newData?.token_id
      const ownerAddress = newData?.owner_address
      mintQueue.add({tokenId, ownerAddress})
      res.status(200).json({status:"ok"})
    }  else {
      res.status(304).json({status: 'not modified'})
    }

  } else {
    res.status(401).json({status: 'unauthorized'})
  }
})

app.listen(port, () => {
  console.log('listening on ', port)
})

schedule("0 0 * * *", queueClean);

module.exports = app