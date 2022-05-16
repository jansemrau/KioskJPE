const { buildSchema } = require("graphql");

module.exports = buildSchema(`

  type Participant {
    _id: ID!
    firstname: String!
    lastname: String!
    guthaben: Float!
    datumAuszahlung: String
    signature: String
  }


  input ParticipantInput {
    firstname: String!
    lastname: String!
    guthaben: Float!
    datumAuszahlung: String
    signature: String
  }

    type Product {
    _id: ID!
    name: String!
    price: Float!
  }


  input ProductInput {
    name: String!
    price: Float!
  }

  type Query {
    participants:[Participant!]
    products:[Product!]
  }

  type Mutation {
    createParticipant(participant:ParticipantInput): Participant
    createProduct(product:ProductInput): Product
  }

  schema {
    query: Query
    mutation: Mutation
  }
`);
