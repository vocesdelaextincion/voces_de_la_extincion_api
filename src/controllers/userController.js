const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const User = require("../models/user");
const { sendVerificationEmail } = require('../services/emailService');

require("dotenv").config();

const registerUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint to register a new user'
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser && existingUser.verified) {
      return res.status(400).json({ message: "User already exists and is verified." });
    }

    let newUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUser && !existingUser.verified) {
      existingUser.password = hashedPassword;
      newUser = existingUser;
      console.log('Updating password for existing unverified user.');
    } else {
      newUser = new User({
        email,
        password: hashedPassword,
      });
      console.log('Creating new user record.');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    newUser.verificationToken = verificationToken;

    await newUser.save();

    try {
      await sendVerificationEmail(newUser.email, verificationToken);
      console.log(`Verification email sent to ${newUser.email}`);
      res.status(201).json({
        message:
          "User registered successfully. Please check your email to verify your account.",
        user: { email: newUser.email },
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      await User.deleteOne({ _id: newUser._id });
      return res.status(500).json({ message: "Failed to send verification email. Please try registering again." });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

const loginUser = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exists" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      if (!user.verified) {
        return res.status(403).json({ message: "Verifica tu cuenta para acceder" });
      }
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return res.status(200).json({ message: "Login successfull", token });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res) => { 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'Endpoint to verify user email using a token'
  // #swagger.parameters['token'] = { in: 'query', description: 'Verification token received via email.', required: true, type: 'string' }
  try {
    const { token } = req.query; 

    if (!token) {
      return res.status(400).json({ message: "Verification token is missing." });
    }

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification token." });
    }

    if (user.verified) {
      return res.status(400).json({ message: "Account already verified." });
    }

    user.verified = true;
    user.verificationToken = undefined; 
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ message: "An error occurred during email verification." });
  }
};

const forgotPassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Password reset link sent", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Token and new password are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyUser,
  forgotPassword,
  resetPassword,
};
