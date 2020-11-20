let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");
let JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt;

require('dotenv').config()


passport.use("login", new LocalStrategy(
  function (username, password, done) {
    User.findOne({username: username}, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      console.log("password", user.verifyPassword(password));

      if (!user.verifyPassword(password)) {
        return done(null, false, "password not match");
      }

      return done(null, user);
    });
  }
));

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {

  User.findOne({_id: jwt_payload.user._id}, function (err, user) {
    if (err) {
      console.log(err)
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  });
}));

module.exports = passport