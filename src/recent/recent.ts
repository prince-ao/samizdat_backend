import express from 'express'
import getRecent from './utils'
import { scrapedData } from './utils'

const router = express.Router()

router.get("/", async (req, res) => {
  let avar: [scrapedData] = await getRecent()
  return res.status(200).send(avar)
})

export default router;