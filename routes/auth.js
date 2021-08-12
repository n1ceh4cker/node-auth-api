const router = require('express').Router()
const User = require('../models/user')
const createHttpError = require('http-errors')
const { passport, getToken, verifyToken } = require('../utils/authenticate')
const { confirmEmailOptions, forgetPasswordOptions } = require('../utils/messages')
require('dotenv').config()
/*const { sendEmail } = require('../utils/nodemailer')*/
/* if you want to send mail using nodemailer use above line & comment below line */
const { sendEmail } = require('../utils/ses')

router.post('/signup', async(req, res, next) => {
  const { email, password } = req.body
  const origin = req.headers.origin
  try{
    const user = await User.register(new User({ email }), password)
    const emailToken = getToken({ _id: user._id })
    const url = `${origin}/confirm/${emailToken}`
    console.log(url)
    sendEmail(confirmEmailOptions(url,email))
    res.status(201).json({
      success: true,
      message: 'Email sent to confirm registration'
    })
  }
  catch(err){
    console.log('Error creating user...\n' + err)
    if(err.message.includes('duplicate key error')){
      next(createHttpError(400, 'Email already registered'))	
    }
    else{
      next(createHttpError('Something went wrong. Try again.'))
    }
  }		
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.log('Error authenticating user...\n' + err.stack)
      next(createHttpError('Something went wrong. Try again.'))
    } else if (!user) {
      let message
      if (info.name === 'IncorrectPasswordError')
          message = 'Password is incorrect'
      if (info.name === 'IncorrectUsernameError')
          message = 'Email not registered'
      res.status(401).json({
          success: false,
          message
      })
    } else {      
      const token = getToken({ _id: user._id })
      res.status(200).json({
        success: true,
        message: 'Logged in successfully!',
        token
      })
    }
  })(req, res, next)
})

router.post('/confirm', async(req, res, next) => {
  const { token } = req.body
  try {
    const payload = verifyToken(token)
    const user = await User.findById(payload._id)    
    user.active = true
    await user.save()
    res.status(200).json({
      success: true,
      message: 'Verification Successful!',
    })
  }	
  catch (err) {
    console.log('Error verifying token...\n' + err)
    if(err.message.includes('jwt expired')){
      next(createHttpError(400, 'Confirmation token expired'))
    }
    else if(err.message.includes('invalid token')){
      next(createHttpError(400, 'Invalid token'))
    }
    else{
      next(createHttpError('Something went wrong. Try again.'))
    }
  }
})

router.post('/resend', async(req, res, next) => {
  const origin = req.headers.origin
  const {  email } = req.body
  try{
    const user = await User.find({ email: email })    
    if(!user.length) throw createHttpError('User does not exist')
    if(user[0].active) throw createHttpError('Email already confirmed')   
    const emailToken = getToken({ _id: user[0]._id })
    const url = `${origin}/confirm/${emailToken}`
    console.log(url)
    sendEmail(confirmEmailOptions(url, email))
    res.status(200).json({
      success: true,
      message: 'Email resent successfully!',
    })
  }		
  catch(err) {
    console.log('Error resending mail...\n' + err)
    if (err.message.includes('User does not exist')) {
      next(createHttpError(400, 'User does not exist'))    
    }else if (err.message.includes('Email already confirmed')) {
      next(createHttpError(400, 'Email already confirmed'))    
    } 
    else {
      next(createHttpError('Something went wrong. Try again.'))
    }
  }
})
router.post('/forget', async(req, res, next) => {
  const origin = req.headers.origin
  const {  email } = req.body
  try{
    const user = await User.find({ email: email })    
    if(!user.length) throw createHttpError('User does not exist')    
    const emailToken = getToken({ _id: user[0]._id })
    const url = `${origin}/reset/${emailToken}`
    console.log(url)
    sendEmail(forgetPasswordOptions(url, email))
    res.status(200).json({
      success: true,
      message: 'Reset mail sent successfully!',
    })
  }		
  catch(err) {
    console.log('Error in sending reset mail...\n' + err)
    if (err.message.includes('User does not exist')) {
      next(createHttpError(400, 'User does not exist'))    
    } else {	
      next(createHttpError('Something went wrong. Try again.'))
    }
  }
})
router.post('/reset', async(req, res, next) => {
  const {  password, token } = req.body
  try{
    const payload = verifyToken(token)
    const user = await User.findById(payload._id)
    await user.setPassword(password)    
    await user.save()
    res.status(200).json({
      success: true,
      message: 'Password reset successfully!',
    })

  }catch(err){
    console.log('Error in password reset...\n' + err)
    if(err.message.includes('jwt expired')){
      next(createHttpError(400, 'Reset token expired'))
    }
    else if(err.message.includes('invalid token')){
      next(createHttpError(400, 'Invalid reset token'))
    }
    else{
      next(createHttpError('Something went wrong. Try again.'))
    }
  }
})
module.exports = router
