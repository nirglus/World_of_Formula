const jwt = require("jsonwebtoken");
const { config } = require("../config");
const jwtSecret = config.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required");

const generateToken = (payload) =>{
    const token = jwt.sign(payload,
        jwtSecret, { expiresIn: "4h"});
        return token;
}

const verifyToken = (token) =>{
    const payload =  jwt.verify(token, jwtSecret);
    return payload;
}

module.exports = { generateToken, verifyToken }