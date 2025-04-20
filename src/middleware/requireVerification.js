function requireVerification(req, res, next) {
  if (!req.user || !req.user.verified) { // Check req.user exists first
    return res.status(403).json({ message: "Verifica tu cuenta para acceder" });
  }
  next();
}

module.exports = requireVerification;
