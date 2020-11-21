const router = require("express").Router()
const Event = require("../models/event.model")
const User=  require("../models/user.model")

/**
 * @GET
 * @RetrievingUserProfile
 * @/dashboard
 */
router.get("/", async(req,res)=>{
    try {
        let user = await User.findOne(req.user._id)
        return res.status(200).json({msg:"User data" , user})
    } catch (error) {
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

module.exports = router