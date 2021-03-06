const router = require("express").Router()
const e = require("express")
const Event = require("../models/event.model")
const User = require("../models/user.model")

/**
 *@GET
 *@GetSingleEventDetails
 @/event/:username/:eventid
 */

router.get("/:eventid", async(req,res)=>{
    try{
    let user = await User.findOne({username : req.user.username})
    let event = await Event.findOne({_id: req.params.eventid})
    let eventexist = user.events.indexOf(event._id)
    if (eventexist != -1) {
      return res.status(200).json({msg: "Single event details", event})
    } else {
      return res.status(400).json({msg: "user does not have the event"})
    }
  } catch (error) {
    res.status(400).json({err: error})
  }

})


/**
 * @POST
 * @AddNewEvents
 * @DoNotUse
 */

router.post("/addevent", async (req,res)=>{
    try{
        let {event_name, start_date, end_date, participants} = req.body
        let currentUser = await User.findOne({username: req.user.username})

        participants.push(currentUser.username)

        if(!event_name || !start_date || !end_date){
            return res.status(400).json({msg: "Invalid Input"})
        }


        //adding 1 day to the end date
        let end = new Date(end_date)
        let enddate = end.setDate(end.getDate(end)+1)
        const availableDates = []

        for(i = new Date(start_date); i<enddate; i.setDate(i.getDate(i)+1)){
            availableDates.push(new Date(i))
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
    participants.forEach(async (el) => {
      try {
        let invitee = await User.findOne({username: el})
        invitee.events.push(newEvent)
        await invitee.save()
      } catch (err) {
        return res.status(400).json({msg: "Username do not exist"})
      }
    })
    return res.status(200).json({msg: "Event added!"})
  } catch (err) {
    return res.status(400).json({err: err})
  }
})

/**
 * @PUT
 * @ModifyEvent
 *
 */

router.put("/:eventid", async(req,res)=>{
    try{
        let {start_date,end_date,event_name} = req.body
        let updates = {start_date,end_date,event_name}
        await Event.findByIdAndUpdate(req.params.eventid, updates)
        res.status(200).json({msg: "Event modified!"})
        
    }catch(error){
        res.status(400).json({err : error})
    }
    
})

/**
 * @GET
 * @Searchbar
 * @url /event
 */
router.get("/", async (req, res) => {
  let searchField = req.query.searchField
  if (searchField === "") {
    res.status(400).json({msg: "invalid search"})
  } else {
    let regex = new RegExp(searchField, "i")
    try {
      let searchResults = await User.find({username: regex}).select(["username"])

      if (searchResults.length > 0) {
        res.status(200).json({msg: "users found", users: searchResults})
      } else {
        res.status(200).json({msg: "no matches"})
      }
    } catch (error) {
      res.status(400).json({err: error})
    }
  }
})

/**
 * @PUT
 * @UpdatingEventBlockedDates
 */
router.put("/dateblock/:eventid", async(req,res)=>{
    try {
        //getting the blocked dates user have selected in the front end
        let {dates} = req.body

        //finding out who is the User who is blocking their dates
        let currentUser = await User.findOne({username: req.user.username})

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

    currentEvent.dateblocks.forEach(async (el, index) => {
      //overwrite user's previous block dates
      if (currentUser.username == el.participant) {
        currentEvent.dateblocks.splice(index, 1)
        await currentEvent.save()
        await Event.findByIdAndUpdate(req.params.eventid, {
          $push: {
            dateblocks: {
              participant: currentUser.username,
              blockeddates: dates
            }
          }
        })
        return res.status(200).json({msg: "Successfully Modified"})
      } else {
        //adding user's block dates
        await Event.findByIdAndUpdate(req.params.eventid, {
          $push: {
            dateblocks: {
              participant: currentUser.username,
              blockeddates: dates
            }
          }
        })
        return res.status(200).json({msg: "Successfully updated the event blocked dates"})
      }
    })
  } catch (error) {
    return res.status(400).json({err: error})
  }
})

/**
 * @PUT
 * @function Add single dateblock
 * @url /event/:eventid/dateblock
 */

router.put('/:eventid/dateblock', async (req, res) => {
  try {
    let event = await Event.findOne({_id: req.params.eventid})
    let index = event.dateblocks.findIndex(dateblock => dateblock.participant === req.user.username)
    if(event.host[0] != req.user.username){
      if(event.confirmedDate != null){
        return res.status(200).json({msg: "you are not the host"})
      }
    }
    let readyUserIndex = event.readyUsers.indexOf(req.user.username)
      if (readyUserIndex > -1){
        event.readyUsers.splice(readyUserIndex,1)
      }
      event.status = "Pending"
      event.confirmedDate = ""

    if (index > -1) {
      let dateIndex = event.dateblocks[index].blockeddates.findIndex(date => date.toString() === (new Date(req.body.date)).toString())
      if (dateIndex > -1){
        event.dateblocks[index].blockeddates.splice(dateIndex, 1)
        await event.save()
        return res.status(200).json({message: "success"})
      }
      event.dateblocks[index].blockeddates.push(req.body.date)
      await event.save()
      return res.status(200).json({message: "success"})
    } else {
      let newBlockedDates = []
      newBlockedDates.push(req.body.date)
      event.dateblocks.push({
        participant: req.user.username,
        bloackeddates: newBlockedDates
      })

      await event.save()
      return res.status(200).json({message: "success"})
    }
  } catch (err) {
    res.status(400).json({message: "cant do it"})
  }
})


/**
 * @POST
 * @AddingSingleParticipantFromEvent
 * @/event/:eventid/participant/add
 */
router.post("/:eventid/participant/add",async(req,res)=>{
  try{
   let {participant} = req.body
   let event = await Event.findOne({_id: req.params.eventid})
   let user = await User.findOne({username: participant})
   if(event.host[0] != req.user.username){
    return res.status(200).json({msg: "you are not the host"})
  } 
   //Frontend to send an object participant
   let index = event.participants.indexOf(participant)
     if(index != -1){
        return res.status(200).json({msg: "Participant already added"})
     }
     else{
      let dateblocks = {
        _id : user._id,
        participant: user.username,
        blockeddates: []
      }
      event.dateblocks.push(dateblocks)
      event.participants.push(participant)
      event.status = "Pending"
      event.confirmedDate = ""
      user.events.push(event)
      await user.save()
      await event.save()
      return res.status(200).json({msg: "Participant added"})
     }
  }catch(error){
    res.status(400).json({err: error})
  }
})

/**
 * @put
 * @DeletingSingleParticipantFromEvent
 * @/event/:eventid/participant/delete
 */
router.put("/:eventid/participant/delete", async(req,res)=>{
  
    try{ 
        let event = await Event.findOne({_id : req.params.eventid})
        if(req.user.username == event.host[0]){
        let {participant} = req.body
        if(participant == req.user.username){
          return res.status(200).json({msg:"You cant remove yourself"})
        }
        console.log(participant)
        event.participants.forEach(async (el,index)=>{
            if(el == participant){
                event.participants.splice(index,1)
            }
        })
        event.dateblocks.forEach((el,index)=>{
          if(el.participant === participant){
            event.dateblocks.splice(index,1)
          }
        })
        event.readyUsers.forEach((el,index)=>{
          if(el === participant){
            event.readyUsers.splice(index,1) 
          }
        })
        let outcast = await User.findOne({username : participant})
        let index =  outcast.events.indexOf(req.params.eventid)
        outcast.events.splice(index,1)
        await event.save()
        outcast.save()
        res.status(200).json({msg:"Outcast removed"})
      }
    }catch(error){
      console.log(error)
        res.status(400).json({msg: error})
    } 

})

/**
 * @PUT
 * @ChangingStartAndEndDate
 * /event/:eventid/modifydates
 */
router.put("/:eventid/modifydates" , async(req,res)=>{
    try{
        let event = await Event.findOne({_id : req.params.eventid})
        let {start_date, end_date} = req.body
        if(start_date){
          event.start_date = start_date
        }else{
          if(event.start_date){
            start_date = event.start_date
          }
          else{
            start_date = Date(Date.now())
          }
        }
        if(end_date){
          event.end_date = end_date
        }else{
          if(event.end_date){
          end_date = event.end_date
          }
          else{
            return res.status(200).json({msg: "You need an end date at least"})
          }
        }
        let end = new Date(end_date)
        let enddate = end.setDate(end.getDate(end)+1)
        let availableDates = []

        for(i = new Date(start_date); i<enddate; i.setDate(i.getDate(i)+1)){
            availableDates.push(new Date(i))
        }
        event.availableDates = availableDates
        await event.save()
        res.status(200).json({msg: "Changed dates"})
    } catch(error){
        res.status(400).json({err : error})
    }
})

/**
 * @AddingChatToEvent
 * @PUT
 * @/event/:eventid/chat/add
 */
router.post("/:eventid/chat/add",async(req,res)=>{
  try {
    let event = await Event.findOne({_id : req.params.eventid})
    let user = req.user.username
    let {message} = req.body

    event.chat.push({username : user,
      message : message})
      await event.save()
      res.status(200).json({msg: "chat added"})
  } catch (error) {
    res.status(400).json({err: error})
  }
})

/**
 * @PUT
 * @UserReady
 * /event/:eventid/ready
 */
router.put("/:eventid/ready",async(req,res)=>{
  try{
    let event = await Event.findOne({_id : req.params.eventid})
    let index = event.readyUsers.indexOf(req.user.username)
    if(event.host[0] != req.user.username){
      if(event.confirmedDate != null){
        return res.status(200).json({msg: "you are not the host"})
      }
    }
    if(index == -1){
      event.readyUsers.push(req.user.username)
      if(event.readyUsers.length == event.participants.length){
        event.status = "Ready"
        await event.save()
        return res.status(200).json({msg: "I'm Ready!"})
      }
      await event.save()
      return res.status(200).json({msg: "I'm Ready!"})
    }
    else{
      event.readyUsers.splice(index,1)
      event.status = "Pending"
      await event.save()
      return res.status(200).json({msg: "I'm UnReady!"})
    }
  }catch(error){
    return res.status(400).json({err: error})
  }
})

/**
 * @PUT
 */
router.put("/:eventid/confirm",async(req,res)=>{
  try{
    let event = await Event.findOne({_id: req.params.eventid})
    let {date} = req.body
    if(req.user.username == event.host[0]){

    if(event.readyUsers.length != event.participants.length){
      return res.status(200).json({msg: "Not all participants are ready"})
    }
    if(event.confirmedDate == null) {
        event.confirmedDate = date
        event.status = "Confirmed"
        await event.save()
        return res.status(200).json({msg: "Event updated"})
    }
    else{

      if(event.confirmedDate == null){
        event.confirmedDate = date
        event.status = "Confirmed"
        await event.save()
        return res.status(200).json({msg: "Event updated"})
      }
      if((new Date(date)).toString() == event.confirmedDate.toString()){
        event.status = "Ready"
        event.confirmedDate = ""
        await event.save()
        return res.status(200).json({msg: "Event updated"})
      }
      event.confirmedDate = date
        event.status = "Confirmed"
        await event.save()
        return res.status(200).json({msg: "Event updated"})

    }
  }
  }catch(error){
    res.status(400).json({error: error})
    console.log(error)
  }
})


module.exports = router
