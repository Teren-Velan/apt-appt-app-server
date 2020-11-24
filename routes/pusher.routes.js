const router = require("express").Router();
const pusher = require('../lib/pusher')

/**
 * @method POST
 * @sends a trigger
 * @url /pusher/message-sent
 */

router.post('/trigger', async (req, res) => {
  let {channel} = req.body
  console.log(channel)
  try {
    await pusher.trigger(channel, "trigger", {
      message: "a message was sent"
    });
    res.status(200).json({message: "triggered"})
  } catch (err) {
    res.status(400).json({message: "not successful"})
    console.log(err)
  }
})

router.post('/typing', async (req, res) => {
  let {channel, user} = req.body
  console.log(req.body)
  try {
    await pusher.trigger(channel, "typing", {
      user: user
    })
  } catch (err) {
    res.status(400).json({message: "not successful"})
    console.log(err)
  }

})

module.exports = router