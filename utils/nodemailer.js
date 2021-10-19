/* sending mail with nodemailer */
const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.SENDER_EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN
  },
  tls: {
    rejectUnauthorized: false
  }
})
exports.sendEmail = (mailOptions) => {
  transporter.sendMail({
    ...mailOptions,
    from: `"node-auth-api" <${process.env.SENDER_EMAIL}>` 
  },
  (err, info) => {
    if(err) console.log('Error in sending mail...\n' + err)
    else console.log('Mail Send Successfuly...\n' + info.messageId)
  })
}