import express from 'express'
import { search, getRec } from './utils'

const router = express.Router()

router.post('/', async (req, res) => {
  const word = req.body.word
  if(word){
    const searchRes = await search(word)
    const levDis = getRec(word)
    res.status(200).send({array: searchRes, suggestion: levDis?.item })
  }else{
    res.status(400).send()
  }
})

export default router