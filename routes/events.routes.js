const router = require("express").Router()
const Event = require("../models/event.model")
const User=  require("../models/user.model")


/**
 * @POST
 * @AddNewEvents
 */
router.post("/:username/add", async (req,res)=>{
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
        await newEvent.save()

        let currentUser = await User.findOne({username: req.params.username})
        console.log("Current USer: ", currentUser)
        console.log("Current USer event: ", currentUser.events)
        currentUser.events.push(newEvent)

        await currentUser.save()

        return res.status(200).json({msg: "Event added!"})
    }catch(err){
        console.log(err)
        return res.status(400).json({err: err})
    }
})

/**
 * @get
 * @Searchbar
 */
router.get("/", async(req,res)=>{
    let {searchField} = req.body
    let regex = new RegExp(searchField, "i")
    try {
    let user = await User.find({username:regex})
        res.status(200).json({msg: "hiii", user})
    } catch (error) {
        res.status(400).json({err: error})
    }
})

/**
 * @PUT
 * @UpdatingEventBlockedDates
 */
router.put("/dateblock/:username/:eventid", async(req,res)=>{
    try {
        //getting the blocked dates user have selected in the front end
        let {dates} = req.body

        //finding out who is the User who is blocking their dates
        let currentUser = await User.findOne({username: req.params.username})

        //finding the specific Event
        let currentEvent = await Event.findOne({_id: req.params.eventid})

        //adding dateblock if user is the first one
        if(currentEvent.dateblocks.length<1){
            await Event.findByIdAndUpdate(req.params.eventid, {$push : {dateblocks: {
                participant: currentUser.username,
                blockeddates: dates
            }}})
            return res.status(200).json({msg: "Successfully updated the event blocked dates"})
        }
        
        currentEvent.dateblocks.forEach(async (el,index)=>{
            //overwrite user's previous block dates
            if(currentUser.username == el.participant){
                currentEvent.dateblocks.splice(index,1)
                await currentEvent.save()
                await Event.findByIdAndUpdate(req.params.eventid, {$push : {dateblocks: {
                    participant: currentUser.username,
                    blockeddates: dates
                }}})
                return res.status(200).json({msg: "Successfully Modified"})
                }
            else{
                //adding user's block dates
                await Event.findByIdAndUpdate(req.params.eventid, {$push : {dateblocks: {
                    participant: currentUser.username,
                    blockeddates: dates
                }}})
                return res.status(200).json({msg: "Successfully updated the event blocked dates"})
            }
            })
            }
            

        catch (error) {
        console.log(error)
        return res.status(400).json({err: error})
    }
})


module.exports = router