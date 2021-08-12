/* sending mail with nodemailer */
const nodemailer = require('nodemailer')
require('dotenv').config()
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 25,
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
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