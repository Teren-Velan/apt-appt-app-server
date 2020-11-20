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


router.put("/dateblock/:userid/:eventid", async(req,res)=>{
    try {
        //getting the blocked dates user have selected in the front end
        let {dates} = req.body

        //finding out who is the User who is blocking their dates
        let currentUser = await User.findOne(req.params.userid)

        //finding the specific Event
        let currentEvent = await Event.findOne(req.params.eventid)

        //finding if the user already blocked the same entry
        currentEvent.dateblocks.forEach(async(el)=>{
            if (el.participant == currentUser.username){
                if(el.blockeddates != dates){
                    el.blockeddates = dates
                await currentEvent.save()
                return res.status(200).json({msg: "Successfully updated the event blocked dates"})
                }
                else{
                    return res.status(400).json({msg:"Already existed"})
                }
            }
            else{
                let newBlockedData = {
                    participant: currentUser.username,
                    blockeddates: dates
                }
                currentEvent.dateblocks.push(newBlockedData)
            await currentEvent.save()
            return res.status(200).json({msg: "Successfully updated the event blocked dates"})
            }
        })
    } catch (error) {
        return res.status(400).json({err: err})
    }
})

module.exports = router