const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    name: String,
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    friendlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const User = mongoose.model("User", userSchema)

module.exports = User