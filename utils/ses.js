/* sending mail using AWS SES with node-ses */
const ses = require('node-ses')
require('dotenv').config()

const client =  ses.createClient({
  key : process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  amazon: 'https://email.ap-south-1.amazonaws.com'
})
exports.sendEmail =  (mailOptions) => {
  client.sendEmail({
    ...mailOptions,
    from: `"node-auth-api" <${process.env.SENDER_EMAIL}>`
  },
  (err, data, res) => {
    if(err) console.log('Error in sending mail...\n' + err.Message)
    else console.log('Mail Send Successfuly...\n' + data)
  })
}