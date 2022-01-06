import { schedule } from "node-cron"
import { mintQueue, queueClean } from "./mint_queue"
import { config } from "./config";

require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 8000
app.use(express.json())


const allowed = (webhookHeader: string) => {
  if(webhookHeader === config.webhookSecret || process.env.NODE_ENV === "test") {
    return true
  } else {
    return false
  }
}

app.post('/', (req: any, res: any) => {
  if(allowed) {
    const newData = req?.body?.event?.data?.new
    const oldData = req?.body?.event?.data?.old
    if(newData && !oldData.image_id) {
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