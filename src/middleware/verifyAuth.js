const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];

  if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized. Missing token" });
  }

  const token = bearerHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
