//importing
const express = require('express')
const server = express()
require('dotenv').config()
require('./lib/connection')
const cors = require('cors')


//middlewares
server.use(express.json())
server.use(cors())



//listening

server.listen(process.env.PORT, ()=>{
    console.log(`Running server on port ${process.env.PORT}`)
})