import express from 'express'
import recent from './recent/recent'
import search from './search/search'
import {graphqlHTTP} from 'express-graphql'
import root from './graphql/resolver';
import schema from './graphql/schema';
import RecentCache from './recent/utils';
import { initializeBKTree } from './search/utils';
import { next } from 'cheerio/lib/api/traversing';

const app = express();
const PORT = "8081"

app.use(
  express.json()
)

app.get("/", (req, res) => {
  return res.status(200).send("Libgen API")
})

app.use('/recent', recent)
app.use('/search', search)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(PORT, () => {
  setInterval(async () => {
    await RecentCache();
  }, 1800_000)
  initializeBKTree();
  console.log(`listening on ${PORT}...`)
})