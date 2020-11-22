const router = require("express").Router()
const e = require("express")
const Event = require("../models/event.model")
const User=  require("../models/user.model")

/**
 *@GET
 *@GetSingleEventDetails
 @/event/:username/:eventid 
 */
router.get("/:username/:eventid", async(req,res)=>{
    try{
    let user = await User.findOne({username : req.params.username})
    let event = await Event.findOne({_id: req.params.eventid})
    let eventexist = user.events.indexOf(event._id)
    if(eventexist != -1){
        return res.status(200).json({msg:"Single event details", event})
    }
    else{
        return res.status(400).json({msg: "user does not have the event"})
    }
    }
    catch(error){
        console.log(error)
        res.status(400).json({err :error})
    }

})


/**
 * @POST
 * @AddNewEvents
 */
router.post("/:username/addevent", async (req,res)=>{
    try{
        let {event_name, start_date, end_date, participants} = req.body
        let currentUser = await User.findOne({username: req.params.username})

        participants.push(currentUser.username)

        if(!event_name || !start_date || !end_date){
            return res.status(400).json({msg: "Invalid Input"})
        }


        //adding 1 day to the end date
        let end = new Date(end_date)
        let enddate = end.setDate(end.getDate(end)+1)
        const availableDates = []

        for(i = new Date(start_date); i<enddate; i.setDate(i.getDate(i)+1)){
            console.log("i", i)
            availableDates.push(new Date(i))
            console.log(availableDates)
        }

        let newEvent = new Event({
            event_name,
            start_date,
            end_date,
            participants,
            availableDates
        })


        await newEvent.save()


        //pushing the event to other invited Users
        participants.forEach(async (el)=>{
            try{
                let invitee = await User.findOne({username : el})
                invitee.events.push(newEvent)
                await invitee.save()
            }catch(err){
                return res.status(400).json({msg: "Username do not exist"})
            }
        })
        return res.status(200).json({msg: "Event added!"})
    }catch(err){
        console.log(err)
        return res.status(400).json({err: err})
    }
})

/**
 * @PUT
 * @ModifyEvent
 * 
 */
router.put("/:username/:eventid", async(req,res)=>{
    try{
        let {start_date,end_date,event_name} = req.body
        let updates = {start_date,end_date,event_name}
        await Event.findByIdAndUpdate(req.params.eventid, updates)
        res.status(200).json({msg: "Event modified!"})
        
    }catch(error){
        console.log(error)
        res.status(400).json({err : error})
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
    let user = await User.find({username:regex}).select(["username"])
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

/**
 * @DELETE
 * @DeletingSingleParticipantFromEvent
 * @/event/:username/:eventid/:participant/delete
 */
router.delete("/:username/:eventid/participant/delete", async(req,res)=>{
    try{   
        let event = await Event.findOne({_id : req.params.eventid})
        let {participant} = req.body
        event.participants.forEach(async (el,index)=>{
            if(el == participant){
                event.participants.splice(index,1)
                await event.save()
            }
        })
        let outcast = await User.findOne({username : participant})
        let index =  outcast.events.indexOf(req.params.eventid)
        outcast.events.splice(index,1)
        outcast.save()
        res.status(200).json({msg:"Outcast removed"})
    }catch(error){
        console.log(error)
        res.status(400).json({msg: error})
    } 

})


/**
 * @GET
 * @GetAvailableDates
 * @/event/:eventid/available
 */


module.exports = router
