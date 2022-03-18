import fs from 'fs'
import path from 'path'

const resolver = {
  Mutation: {

  },
  Query: {
    recent: () => {
      let buff = fs.readFileSync(path.join(__dirname, "/../../data/recent.json"))
      let stringBuff = buff.toString()
      let JsonBuff = JSON.parse(stringBuff)
      return JsonBuff;
    }
  }
}

const root = {
  recent: resolver.Query.recent
}

export default root