const loadDB = require("../mongodb");

module.exports = {
    products: async () => {
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
    participants: async () => {
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
};
