const mongoose = require("mongoose");
const slugify = require("slugify");
const gottesdienstSchema = new mongoose.Schema(
    {
        datetime: {
            type: Date,
            required: [true, "A gottesdienst must have a date and time"],
        },
        filename: {
            type: String,
        },
    },
    { collection: "Ablauefe" }
);

const Gottesdienst = mongoose.model("gottesdienst", gottesdienstSchema);

module.exports = Gottesdienst;
