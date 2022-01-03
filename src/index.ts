import { mintQueue } from "./mint_queue"

require('dotenv').config()
const express = require('express')
const app = express()
const port = 8000
app.use(express.json())

app.post('/', (req: any, res: any) => {
  const newData = req?.body?.event?.data?.new
  if(newData) {
    console.log("[INFO] Received Webhook for ", newData)
    const tokenId = newData?.token_id,
     contractVersion = newData?.contract_address;
     mintQueue.add({tokenId, contractVersion})
     res.status(200).json({status:"ok"})
     return 
  } 
})

app.listen(port, () => {
  console.log('listening on ', port)
})

module.exports = app