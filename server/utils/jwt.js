const jwt = require("jsonwebtoken");
const { config } = require("../config");

const jwtSecret = config.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is required");
}

const generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: "4h" });
};

const verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};

module.exports = { generateToken, verifyToken };
