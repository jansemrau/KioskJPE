const loadDB = require("../../mongodb");
let ObjectId = require("mongodb").ObjectID;

const resolverFunctions = {
    getAllProducts: async (args) => {
        try {
            const db = await loadDB();
            let productsFetches = await db
                .collection("Products")
                .find()
                .sort({ name: 1 })
                .toArray();
            return productsFetches.map((product) => {
                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                };
            });
        } catch (error) {
            throw error;
        }
    },
    getAllParticipants: async (args) => {
        try {
            const db = await loadDB();
            const participantsFetches = await db
                .collection("Participants")
                .find()
                .sort({ firstname: 1 })
                .toArray();
            return participantsFetches.map((participant) => {
                return {
                    _id: participant._id,
                    firstname: participant.firstname,
                    lastname: participant.lastname,
                    credit: participant.credit,
                    datePayment: participant.datePayment,
                    signature: participant.signature,
                };
            });
        } catch (error) {
            throw error;
        }
    },
    createProduct: async (args) => {
        try {
            const { name, price } = args;
            const db = await loadDB();
            let newProduct = await db.collection("Products").insertOne({
                name: name,
                price: price,
            });
            return "Product created";
        } catch (error) {
            throw error;
        }
    },

    createParticipant: async (args) => {
        try {
            const { firstname, lastname, credit } = args;
            const db = await loadDB();
            let newParticipant = await db.collection("Participants").insertOne({
                firstname: firstname,
                lastname: lastname,
                credit: credit,
            });
            return "Participant created";
        } catch (error) {
            throw error;
        }
    },
    deleteParticipant: async (args) => {
        try {
            const id = args.id;
            const db = await loadDB();
            db.collection("Participants").deleteOne({ _id: ObjectId(id) });
            return "Participant deleted";
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (args) => {
        try {
            const id = args.id;
            const db = await loadDB();
            db.collection("Products").deleteOne({ _id: ObjectId(id) });
            return "Product deleted";
        } catch (error) {
            throw error;
        }
    },
    updateCredit: async (args) => {
        try {
            const id = args.id;
            const creditNew = args.credit;
            const db = await loadDB();
            const result = await db.collection("Participants").update(
                {
                    _id: ObjectId(id),
                },
                {
                    $set: { credit: creditNew },
                }
            );
            return "Guthaben geupdated";
        } catch (error) {
            throw error;
        }
    },
    updateSignature: async (args) => {
        try {
            const id = args.id;
            const signature = args.signature;
            const datePayment = args.datePayment;
            const db = await loadDB();
            const result = await db.collection("Participants").update(
                {
                    _id: ObjectId(id),
                },
                {
                    $set: {
                        signature: signature,
                        datePayment: datePayment,
                    },
                }
            );
            return "Unterschrift geupdated";
        } catch (error) {
            throw error;
        }
    },
    insertPurchases: async (args) => {
        try {
            const { entries } = args;
            entries.map((e) => {
                e.productID = ObjectId(e.productID);
                e.userID = ObjectId(e.userID);
            });
            const db = await loadDB();
            let newPurchases = await db
                .collection("Purchases")
                .insertMany(entries);
            return "Purchases created";
        } catch (error) {
            throw error;
        }
    },
    getAllPurchases: async (args) => {
        try {
            const db = await loadDB();
            let purchaseFetches = await db
                .collection("Purchases")
                .aggregate([
                    {
                        $lookup: {
                            from: "Products",
                            localField: "productID",
                            foreignField: "_id",
                            as: "product",
                        },
                    },
                    {
                        $lookup: {
                            from: "Participants",
                            localField: "userID",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    "user._id": ObjectId(args.userID),
                                },
                            ],
                        },
                    },
                ])
                .toArray();
            return purchaseFetches.map((purchase) => {
                return {
                    _id: purchase._id,
                    firstname: purchase.user[0].firstname,
                    lastname: purchase.user[0].lastname,
                    productname: purchase.product[0].name,
                    count: purchase.count,
                    date: new Date(purchase.date),
                };
            });
        } catch (error) {
            throw error;
        }
    },
};

module.exports = {
    getAllParticipants: resolverFunctions.getAllParticipants,
    getAllProducts: resolverFunctions.getAllProducts,
    updateCredit: resolverFunctions.updateCredit,
    updateSignature: resolverFunctions.updateSignature,
    createParticipant: resolverFunctions.createParticipant,
    createProduct: resolverFunctions.createProduct,
    deleteParticipant: resolverFunctions.deleteParticipant,
    deleteProduct: resolverFunctions.deleteProduct,
    insertPurchases: resolverFunctions.insertPurchases,
    getAllPurchases: resolverFunctions.getAllPurchases,
};
