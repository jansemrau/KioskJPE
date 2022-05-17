const { buildSchema } = require("graphql");

// module.exports = buildSchema(`

//   type Participant {
//     _id: ID
//     firstname: String
//     lastname: String
//     guthaben: Float
//     datumAuszahlung: String
//     signature: String
//   },
//   input ParticipantInput {
//     firstname: String!
//     lastname: String!
//     guthaben: Float!
//     datumAuszahlung: String
//     signature: String
//   },
//     type Product {
//     _id: ID!
//     name: String!
//     price: Float!
//   },
//   input ProductInput {
//     name: String!
//     price: Float!
//   },
//   type Query {
//     getAllParticipants: [Participant]
//     getAllProducts: [Product]
//   },
//   type Mutation {
//     createParticipant(participant: ParticipantInput): Participant
//     updateGuthaben(id: ID, guthaben: Float): Participant
//     deleteParticipant(id: ID): Boolean
//     createProduct(product: ProductInput): Product
//     deleteProduct(id: ID): Boolean
//   },
//   schema {
//     query: Query
//     mutation: Mutation
//   }
// `);
module.exports = buildSchema(`
      type Participant {
        _id: ID
        firstname: String
        lastname: String
        guthaben: Float
        datumAuszahlung: Float
        signature: String
      },
      type Product {
       _id: ID
       name: String
       price: Float
     },
      type Query {
        getAllParticipants: [Participant]
        getAllProducts: [Product]
      },
     type Mutation {
       updateGuthaben(id: ID, guthaben: Float): String
       createParticipant(firstname: String, lastname: String, guthaben: Float): String
       createProduct(name: String, price: Float): String
       deleteParticipant(id: ID): String,
       deleteProduct(id: ID): String
       updateSignature(id: ID, signature: String, datumAuszahlung: Float): String
     },
      schema {
        query: Query
        mutation: Mutation
   }
`);
