const mongoose = require("mongoose")
const {Schema} = mongoose

const blockSchema = new Schema({
    participant: {
        type: String
    },
    blockeddates: [{
        type:String
    }]
})
const eventSchema = new Schema({
    event_name:{
        type: String,
        required: true,
    },
    start_date:{
        type: String,
        required: true,
    },
    end_date:{
        type: String,
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
    dateblocks: [blockSchema]
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event