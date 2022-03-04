import getRecent from "../recent/utils"

const resolver = {
  Mutation: {

  },
  Query: {
    recent: () => {
      return getRecent();
    }
  }
}

const root = {
  recent: resolver.Query.recent
}

export default root