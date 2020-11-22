const router = require("express").Router();
const pusher = require('../lib/pusher')

/**
 * @method POST
 * @sends a trigger
 * @url /pusher/
 */

router.post('/', async (req, res) => {
  let {message, channel, event} = req.body
  try {
    await pusher.trigger("my-channel", "my-event", {
      message: message
    });
    res.status(200).json({message: "triggered"})
  } catch (err) {
    console.log(err)
  }

})

module.exports = router