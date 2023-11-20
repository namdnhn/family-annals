const mongoose = require("mongoose");

//schema
const familySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Members",
        },
    ],
});

module.exports = mongoose.model("Families", familySchema);
