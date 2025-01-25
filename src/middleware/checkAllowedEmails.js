require("dotenv").config();

const allowedEmails = process.env.ALLOWED_EMAILS.split(",");

const checkAllowedEmails = (req, res, next) => {
  const email = req.body.email;
  if (!allowedEmails.includes(email)) {
    return res.status(401).json({ message: "Unauthorized. Invalid email" });
  }
  next();
};

module.exports = checkAllowedEmails;
