var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'qq',
  auth: {
    user: '285696737',
    pass: 'uwmrxqecwrahbhfc'
  }
});

module.exports = transporter
