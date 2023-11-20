const mongoose = require("mongoose");

//schema
const memberDetailSchema = new mongoose.Schema({
    member_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Members",
    },
    fullname: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: Date,
        required: true,
    },
    place_of_birth: {
        type: String,
        required: true,
    },
    date_of_death: {
        type: Date,
        required: false,
    },
    place_of_death: {
        type: String,
        required: false,
    },
    current_address: {
        type: String,
        required: true,
    },
    images: [
        {
            type: String,
            required: false,
        },
    ],
    background_desc: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("MemberDetails", memberDetailSchema);
