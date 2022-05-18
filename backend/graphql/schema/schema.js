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
     type AllPurchases{
       _id: ID
        firstname: String
        lastname: String
        productname: String
        count: Int
        date: Float
     }
     input InputPurchase{
       productID: ID
       userID: ID
       count: Int
       date: Float
     }
      type Query {
        getAllParticipants: [Participant]
        getAllProducts: [Product]
        getAllPurchases(userID: String): [AllPurchases]
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
