const mongoose = require("mongoose");
const slugify = require("slugify");
const productsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        price: {
            type: Number,
        },
    },
    { collection: "Products" }
);

const Products = mongoose.model("products", productsSchema);

module.exports = Products;
