const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const User = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
  },
  email: {
    type: String
  },
})
User.plugin(passportLocalMongoose, {
  usernameField: 'email',
  findByUsername: (model, queryParameters) => {
    queryParameters.active = true
    return model.findOne(queryParameters)
  },
})
module.exports = mongoose.model('User', User)
