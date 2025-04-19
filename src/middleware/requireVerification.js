function requireVerification(req, res, next) {
  // if (!req.user.verified) {
  //   return res.status(403).json({ message: "Verifica tu cuenta para acceder" });
  // }
  next();
}

module.exports = requireVerification;
