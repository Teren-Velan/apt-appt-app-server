const router = require("express").Router()
const Event = require("../models/event.model")
const User=  require("../models/user.model")

/**
 * @GET
 * @RetrievingUserProfile
 * @/dashboard
 */
router.get("/" , async(req,res)=>{
    try {
        let user = await User.findOne({username: req.user.username}).populate("friendlist", "username").select(["username","email","friendlist"])
        res.status(200).json({msg: "Successfully retrieved friendlist", user})
    } catch (error) {
        console.log(error)
        res.status(400).json({err: error})
    }
})

/**
 * @POST
 * @AddingNewEventToDashBoard
 * @/dashboard/addEvent
 */
router.post("/addEvent", async(req,res)=>{
    try{
        let {description, event_name} = req.body
        if (!event_name){
            return res.status(400).json({msg:"Please feel in event Name"})
        }
        let newEvent = new Event({
            event_name,
            description
        })

        let currentUser = await User.findOne({username: req.user.username})
        await newEvent.save()
        currentUser.events.push(newEvent)
        await currentUser.save()
        return res.status(200).json({msg: "newEvent Saved"})
    }catch(error){
        console.log(error)
        return res.status(400).json({error: error})
    }
    
})

/**
 * @GET
 * @RetrievingUserEventData
 * @/dashboard/:username
 */
router.get("/event", async(req,res)=>{
    try{
        let user = await User.findOne({username : req.user.username}).populate({
            path: "events",
        }).select(["events"])
        console.log("user populate ", user)
        return res.status(200).json({msg:"Populate event" , user})
    }
    catch(error){
    return res.status(400).json({err: error})
    }
})

/**
 * @POST
 * @AddingFriend
 * @/dashboard/addfriend
 */
router.post("/addfriend",async(req,res)=>{
    try {
        let user = await User.findOne({username : req.user.username})
        let {username} = req.body
        let friend = await User.findOne({username})
        
        if(!friend){
            return res.status(400).json({msg:"friend do not exist"})
        }
        let existed = user.friendlist.indexOf(friend._id)
        let existed2 = friend.friendlist.indexOf(user._id)
        if(existed == -1){
            user.friendlist.push(friend)
            friend.friendlist.push(user)
            await user.save()
            await friend.save()
            res.status(200).json({msg:"added friend"})
        }
        else{
            user.friendlist.splice(existed,1)
            friend.friendlist.splice(existed2,1)
            await user.save()
            await friend.save()
            res.status(200).json({msg: "Already friends"})
        }

    } catch (error) {
        console.log(error)
        return res.status(400).json({err: error})
    }
})

/**
 * @DELETE
 * @DeletingEvent
 * @/dashboard/:eventid/delete
 */
router.delete("/:eventid/delete", async(req,res)=>{
    let event = await Event.findOne({_id : req.params.eventid})
    event.participants.forEach(async (el)=>{
        try{
            let user = await User.findOne({username: el})
            user.events.forEach(async(el,index)=>{
                if(el == req.params.eventid){
                    user.events.splice(index,1)
                    await user.save()
                    return res.status(200).json({msg: "Event removed"})
                }
            })
        await Event.findByIdAndDelete(req.params.eventid)

        }catch(err){
            console.log(err)
        }
        
    })
})






module.exports = router