const router = require("express").Router()
const Event = require("../models/event.model")
const User=  require("../models/user.model")

/**
 * @GET
 * @RetrievingUserProfile
 * @/dashboard
 */
router.get("/:username", async(req,res)=>{
    try {
        //select to choose which information you want to pass specifically
        let user = await User.findOne({username : req.params.username}).select(["username","email","friendlist"])
        return res.status(200).json({msg:"User data" , user})
    } catch (error) {
        console.log(error)
        return res.status(400).json({err: error})
    }
})

/**
 * @GET
 * @RetrievingUserEventData
 * @/dashboard/:username
 */
router.get("/:username/event", async(req,res)=>{
    try{
    let user = await User.findOne({username : req.params.username}).populate({
        path: "events"
    })
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
 * @/dashboard/:username/adddfriend
 */
router.post("/:username/addfriend",async(req,res)=>{
    try {
        let user = await User.findOne({username : req.params.username})
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


module.exports = router