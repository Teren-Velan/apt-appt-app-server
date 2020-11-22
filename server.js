//importing
const express = require('express')
const server = express()
require('dotenv').config()
require('./lib/connection')
const cors = require('cors')




//middlewares
server.use(express.json())
server.use(cors())

//routes
server.use("/auth", require("./routes/auth.routes"))
<<<<<<< HEAD
server.use("/event",require("./routes/event.routes"))
=======
server.use("/event",require("./routes/events.routes"))
server.use("/pusher", require("./routes/pusher.routes"))
>>>>>>> 3ec2a71c89ddb3f8c761f491f2192d44dc972f37
server.use("/dashboard", require("./routes/dashboard.routes"))


//listening

server.listen(process.env.PORT, ()=>{
    console.log(`Running server on port ${process.env.PORT}`)
})