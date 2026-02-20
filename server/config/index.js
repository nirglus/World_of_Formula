const dotenv = require("dotenv");

dotenv.config();

const {MONGO_URL, JWT_SECRET} = process.env;

const config = {
    MONGO_URL, 
    JWT_SECRET
}

module.exports = { config }