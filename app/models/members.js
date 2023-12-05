const mongoose = require("mongoose");

//schema
const memberSchema = new mongoose.Schema({
    family_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Families",
    },
    fullname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ["Nam", "Nữ", "Male", "Female"],
    },
    images: {
        type: String,
    },
    parent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Members",
        },
    ],
    spouse: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Members",
        },
    ],
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Members",
        },
    ],
});

module.exports = mongoose.model("Members", memberSchema);
