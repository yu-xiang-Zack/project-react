var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '285696737',
    pass: 'uwmrxqecwrahbhfc'
  }
});

module.exports = transporter

// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });
