import { buildSchema } from "graphql";

const schema = buildSchema(`
  type recentData {
    id: String!
    title: String!
    author: String!
    publisher: String!
    year: String!
    language: String!
    format: String!
    size: String!
    pages: String!
    link: String!
    image: String!
  }

  type Query {
    recent: [recentData]
  }
`)

export default schema