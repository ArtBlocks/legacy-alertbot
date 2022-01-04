import { schedule } from "node-cron"
import { mintQueue, queueClean } from "./mint_queue"

require('dotenv').config()
const express = require('express')
const app = express()
const port = 8000
app.use(express.json())

app.post('/', (req: any, res: any) => {
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
  return
})

app.listen(port, () => {
  console.log('listening on ', port)
})

schedule("0 0 * * *", queueClean);

module.exports = app