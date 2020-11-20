const mongoose = require("mongoose")

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }, (err) => {
    if (err) {
      console.log(err.reason)
    } else {
      console.log(`Connected @ http://localhost:${process.env.PORT}`)
    }
  })