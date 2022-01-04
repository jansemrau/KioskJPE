const mongoose = require("mongoose");
const slugify = require("slugify");
const participantsSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: [true, "A Participant must have a firstname"],
        },
        lastname: {
            type: String,
            required: [true, "A Participant must have a lastname"],
        },
        guthaben: {
            type: Number,
            required: [true, "A Participant must have a guthaben"],
        },
        signature: {
            type: String,
        },
    },
    { collection: "Participants" }
);

const Participants = mongoose.model("participants", participantsSchema);

module.exports = Participants;
