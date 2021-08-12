const passport = require('passport')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jwtStrategy = require('passport-jwt').Strategy
const extractJwt = require('passport-jwt').ExtractJwt
require('dotenv').config()

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const opts = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
}

passport.use(
  new jwtStrategy(opts, (jwtPayload, done) => {
    User.findById(jwtPayload._id, (err, user) => {
      if (err) return done(err, false)
      else if (user) return done(null, user)
      else return done(null, false)
    })
  })
)
exports.passport = passport
exports.getToken = (user) => jwt.sign(user, process.env.JWT_SECRET, { expiresIn:  360})
exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET)
exports.verifyUser = passport.authenticate('jwt', { session: false })
