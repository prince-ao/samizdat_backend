import express from 'express'
import recent from './recent/recent'

const app = express();
const PORT = "8081"

app.get("/", (req, res) => {
  return res.status(200).send("Libgen API")
})

app.use('/recent', recent)

app.listen(PORT, () => {
  console.log(`listening on ${PORT}...`)
})