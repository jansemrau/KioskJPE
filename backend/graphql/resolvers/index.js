const loadDB = require("../../mongodb");

module.exports = {
    getAllProducts: async () => {
        try {
            const db = await loadDB();
            let productsFetches = await db.collection("Products").find({});
            console.log(productsFetches);
            return productsFetches.map((product) => {
                return {
                    ...product._doc,
                    _id: product.id,
                };
            });
        } catch (error) {
            throw error;
        }
    },
    getAllParticipants: async () => {
        try {
            const db = await loadDB();
            const participantsFetches = await db
                .collection("Participants")
                .find({});
            console.log(participantsFetches);
            return participantsFetches.map((participant) => {
                return {
                    ...participant._doc,
                    _id: participant.id,
                };
            });
        } catch (error) {
            throw error;
        }
    },
    createProduct: async (args) => {
        try {
            const { name, price } = args.product;
            const db = await loadDB();
            let newProduct = await db.collection("Products").insertOne({
                name: name,
                price: price,
            });
            return { ...newProduct._doc, _id: newProduct.id };
        } catch (error) {
            throw error;
        }
    },

    createParticipant: async (args) => {
        try {
            const { firstname, lastname, guthaben } = args.participant;
            const db = await loadDB();
            let newParticipant = await db.collection("Participants").insertOne({
                firstname: firstname,
                lastname: lastname,
                guthaben: guthaben,
            });
            return { ...newParticipant._doc, _id: newParticipant.id };
        } catch (error) {
            throw error;
        }
    },
    deleteParticipant: async (args) => {
        try {
            const id = args.id;
            const db = await loadDB();
            return db
                .collection("Participants")
                .deleteOne({ _id: ObjectId(id) });
        } catch (error) {
            throw error;
        }
    },
    deleteProduct: async (args) => {
        try {
            const id = args.id;
            const db = await loadDB();
            return db.collection("Products").deleteOne({ _id: ObjectId(id) });
        } catch (error) {
            throw error;
        }
    },
    updateGuthaben: async (args) => {
        try {
            const id = args.id;
            const guthabenNeu = args.guthaben;
            const db = await loadDB();
            return db
                .collection("Products")
                .update({ _id: ObjectId(id), guthaben: guthabenNeu });
        } catch (error) {
            throw error;
        }
    },
};
