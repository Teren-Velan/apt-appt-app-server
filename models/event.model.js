const mongoose = require("mongoose")
const { model } = require("./user.model")
const User = require("./user.model")
const {Schema} = mongoose

const blockSchema = new Schema({
    participant: {
        type: String
    },
    blockeddates: [{
        type:String
    }]
})

const commentSchema = new Schema({
    commenter : String,
    comment: String,
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
    dateblocks: [blockSchema],
    comments:[commentSchema],
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event