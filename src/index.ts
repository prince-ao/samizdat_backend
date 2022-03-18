import express from 'express'
import recent from './recent/recent'
import {graphqlHTTP} from 'express-graphql'
import root from './graphql/resolver';
import schema from './graphql/schema';
import RecentCache from './recent/utils';

const app = express();
const PORT = "8081"

app.use(express.json())

app.get("/", (req, res) => {
  return res.status(200).send("Libgen API")
})

app.use('/recent', recent)

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}))

app.listen(PORT, () => {
  setInterval(async () => {
    await RecentCache();
  }, 1800000)
  console.log(`listening on ${PORT}...`)
})