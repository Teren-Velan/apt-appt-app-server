const mongoose = require("mongoose")
const { model } = require("./user.model")
const User = require("./user.model")
const {Schema} = mongoose

const blockSchema = new Schema({
    participant: {
        type: String
    },
    blockeddates: [{
        type: Date
    }]
})

const messageSchema = new Schema({
    username : String,
    message: String,
},{timestamps: true})

const eventSchema = new Schema({
    event_name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        default: "",
    },
    start_date:{
        type: Date,
    },
    end_date:{
        type: Date,
    },
    host:[{
        type: String,
    }],
    participants:[{
        type: String
    }],
    status:{
        type: String,
        default: "Pending"
    },
    availableDates:[{
        type: Date
    }],
    dateblocks: [blockSchema],
    chat:[messageSchema],
    readyUsers: [{
        type: String
    }],
    confirmedDate: {
        type : Date,
        default: ""
    }
})

const Event = mongoose.model("Event", eventSchema)

module.exports = Event