const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure the email transporter using environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER, // Your Gmail address
    clientId: process.env.EMAIL_CLIENT_ID, // OAuth 2.0 Client ID
    clientSecret: process.env.EMAIL_CLIENT_SECRET, // OAuth 2.0 Client Secret
    refreshToken: process.env.EMAIL_REFRESH_TOKEN, // OAuth 2.0 Refresh Token
  },
});

module.exports = transporter;
