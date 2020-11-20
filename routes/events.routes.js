const router = require("express").Router()
const Event = require("../models/event.model")

router.post("/add", async (req,res)=>{
    try{
        let {event_name, start_date, end_date, participants} = req.body
        if(!event_name || !start_date || !end_date){
            return res.status(400).json({msg: "Invalid Input"})
        }
        let newEvent = await Event({
            event_name,
            start_date,
            end_date,
            participants
        })
        newEvent.save()
        return res.status(200).json({msg: "Event added!"})
    }catch(err){
        console.log(err)
        return res.status(400).json({err: err})
    }
})


module.exports = router