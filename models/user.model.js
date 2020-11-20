const mongoose = require("mongoose")
const {Schema} = mongoose
const bcrypt = require("bcrypt")

const userSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    name: String,
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    friendlist:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

})


userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) return next();

  let hash = bcrypt.hashSync(user.password, 10);

  user.password = hash;
  next();
});

userSchema.methods.verifyPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model("User", userSchema)

module.exports = User