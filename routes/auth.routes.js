const router = require("express").Router();
const passport = require("../lib/auth");
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config()


router.post("/register", async (req, res) => {
  try {
    let {username, password} = req.body
    let usernameExist = await User.findOne({username: username})

    if (usernameExist) {
      res.status(400).json({msg: "Username has already been registered"})
    }

    // let hash = await bcrypt.hash(password, 10)

    let newUser = new User({
      username,
      password,
    })

    await newUser.save()
    res.status(200).json({msg: "user registered"})

  } catch (error) {
    console.log(error)
    res.status(400).json({msg: error})
  }
})

router.post('/login',
  async (req, res, next) => {
    passport.authenticate(
      'login',
      async (err, user, info) => {
        try {
          if (err) {
            console.log(err)
            return res.status(400).json({msg: err})
          }
          if (!user) {
            return res.status(400).json({msg: "Wrong logins"})
          }

          req.login(
            user,
            {session: false},
            async (error) => {
              if (error) return next(error);

              const body = {_id: user._id, username: user.username};
              const token = jwt.sign({user: body}, process.env.SECRET);

              return res.json({token});
            }
          );
        } catch (error) {
          return next(error);
        }
      }
    )(req, res, next);
  }
);

router.get("/tokencheck", passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
    let user = await User.findOne({username: req.user.username})
    res.status(200).json({msg: "here is your data", user})
  } catch (error) {
    console.log("backend user token error", error)
  }
})

module.exports = router