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
            console.log(productsFetches);
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
            console.log(participantsFetches);
            return participantsFetches.map((participant) => {
                return {
                    _id: participant._id,
                    firstname: participant.firstname,
                    lastname: participant.lastname,
                    guthaben: participant.guthaben,
                    datumAuszahlung: participant.datumAuszahlung,
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
            const { firstname, lastname, guthaben } = args;
            const db = await loadDB();
            let newParticipant = await db.collection("Participants").insertOne({
                firstname: firstname,
                lastname: lastname,
                guthaben: guthaben,
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
    updateGuthaben: async (args) => {
        try {
            const id = args.id;
            const guthabenNeu = args.guthaben;
            const db = await loadDB();
            const result = await db.collection("Participants").update(
                {
                    _id: ObjectId(id),
                },
                {
                    $set: { guthaben: guthabenNeu },
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
            const datumAuszahlung = args.datumAuszahlung;
            const db = await loadDB();
            const result = await db.collection("Participants").update(
                {
                    _id: ObjectId(id),
                },
                {
                    $set: {
                        signature: signature,
                        datumAuszahlung: datumAuszahlung,
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
            const db = await loadDB();
            let newParticipant = await db.collection("Purchases").insertMany(
                entries,
            );
            return "Participant created";
        } catch (error) {
            throw error;
        }
    },
};

module.exports = {
    getAllParticipants: resolverFunctions.getAllParticipants,
    getAllProducts: resolverFunctions.getAllProducts,
    updateGuthaben: resolverFunctions.updateGuthaben,
    updateSignature: resolverFunctions.updateSignature,
    createParticipant: resolverFunctions.createParticipant,
    createProduct: resolverFunctions.createProduct,
    deleteParticipant: resolverFunctions.deleteParticipant,
    deleteProduct: resolverFunctions.deleteProduct,
    insertPurchases: resolverFunctions.insertPurchases,
};
