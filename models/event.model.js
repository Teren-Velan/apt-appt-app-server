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
    host:[{
        type: String,
    }],
    participants:[{
        type: String
    }],
    status:{
        type: String,
        default: "pending"
    },
    dateblocks: [{
        type: Date,
    }]
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event