const transporter = require("../../config/email");

/**
 * Sends an email.
 * @param {string} to Recipient email address.
 * @param {string} subject Email subject.
 * @param {string} text Plain text body.
 * @param {string} html HTML body.
 */
const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address (must be the same as the authenticated user)
    to, // List of receivers
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

/**
 * Sends a verification email to the user.
 * @param {string} email User's email address.
 * @param {string} token Verification token.
 */
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:${
    process.env.PORT || 3000
  }/auth/verify-email?token=${token}`;
  const subject = "Verificación de correo electrónico - Voces de la Extinción";
  const text = `Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico: ${verificationUrl}`;
  const html = `<p>Hola,</p><p>Gracias por registrarte en Voces de la Extinción.</p><p>Por favor, haz clic en el siguiente enlace para verificar tu correo electrónico:</p><p><a href="${verificationUrl}">Verificar mi correo</a></p><p>Si no te registraste, por favor ignora este correo.</p>`;

  await sendEmail(email, subject, text, html);
};

module.exports = { sendEmail, sendVerificationEmail };
