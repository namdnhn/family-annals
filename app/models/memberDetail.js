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
    gender: {
        type: String,
        required: true,
    },
    date_of_birth: {
        type: String,
        required: false,
    },
    place_of_birth: {
        type: String,
        required: false,
    },
    date_of_death: {
        type: String,
        required: false,
    },
    place_of_death: {
        type: String,
        required: false,
    },
    images: {
        type: String,
        required: false,
    },
    background_desc: {
        type: String,
        required: false,
    },
});

module.exports = mongoose.model("MemberDetails", memberDetailSchema);
