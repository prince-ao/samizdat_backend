import express from 'express'
import getRecent from './utils'

const router = express.Router()

router.get("/", async (req, res) => {
  let avar = await getRecent()
  console.log(avar)
  return res.status(200).send("Recents")
})

export default router;