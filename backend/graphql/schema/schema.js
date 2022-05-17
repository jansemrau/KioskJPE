const { buildSchema } = require("graphql");

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
     type Purchase{
       _id: ID
       productID: ID
       userID: ID
       count: Int
     }
     input InputPurchase{
       productID: ID
       userID: ID
       count: Int
     }
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
       insertPurchases(entries: [InputPurchase]): String
     },
      schema {
        query: Query
        mutation: Mutation
   }
`);
