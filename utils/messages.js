/* while uisng nodemailer use the commented lines and comment the 2 lines below them */
exports.confirmEmailOptions = (url, email) => ({
  to: email, 
  subject: 'Confirm your email address', 
  /*
  html: `<p>Please verify your account by clicking  the following link. If you are unable to do so, copy and paste the link into your browser:</p><p>${url}</p>`,
  text: `Please verify your account by clicking the following link. If you are unable to do so, copy and paste the link into your browser: ${url}`
  */
  message: `<p>Please verify your account by clicking <a href="${url}">this link</a>. If you are unable to do so, copy and paste the following link into your browser:</p><p>${url}</p>`,
  altText: `Please verify your account by clicking the following link, or by copying and pasting it into your browser: ${url}`
})
exports.forgetPasswordOptions = (url, email) => ({
  to: email, 
  subject: 'Reset your password', 
  /*
  html: `<p>Please reset your password by clicking the following link. If you are unable to do so, copy and paste the link into your browser:</p><p>${url}</p>`,
  text: `Please reset your password by clicking the following link. If you are unable to do so, copy and paste the link into your browser: ${url}`
  */
  message: `<p>Please reset your password by clicking the following link. If you are unable to do so, copy and paste the link into your browser:</p><p>${url}</p>`,
  altText: `Please reset your password by clicking the following link. If you are unable to do so, copy and paste the link into your browser: ${url}`
})