const mongoose = require("mongoose")
const {Schema} = mongoose

const eventSchema = new Schema({
    event_name:{
        type: String,
        required: true,
    },
    start_date:{
        type: Date,
        required: true,
    },
    end_date:{
        type: Date,
        required: true,
    },
    participants:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event