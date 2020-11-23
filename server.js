//importing
const express = require('express')
const server = express()
require('dotenv').config()
require('./lib/connection')
const cors = require('cors')
const passport = require('./lib/auth');



//middlewares
server.use(express.json())
server.use(cors())

//routes
server.use("/auth", require("./routes/auth.routes"))
server.use("/event",passport.authenticate('jwt', { session: false }) ,require("./routes/event.routes"))
server.use("/pusher", require("./routes/pusher.routes"))
server.use("/dashboard",passport.authenticate('jwt', { session: false }), require("./routes/dashboard.routes"))


//listening

server.listen(process.env.PORT, ()=>{
    console.log(`Running server on port ${process.env.PORT}`)
})