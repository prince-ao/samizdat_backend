import express from 'express'
import getRecent from './utils'
import { scrapedData } from './utils'
import fs from 'fs'
import path from 'path'

const router = express.Router()

router.get("/", async (req, res) => {
  let buff = fs.readFileSync(path.join(__dirname, "/../../data/recent.json"))
  let stringBuff = buff.toString()
  let JsonBuff = JSON.parse(stringBuff)
  return res.status(200).json(JsonBuff)
})

export default router;