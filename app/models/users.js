const mongoose = require("mongoose");

//schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
})

//compile model from schema
const Users = mongoose.model("Users", userSchema);

module.exports = Users;