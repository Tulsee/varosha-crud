const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  mongoURI: process.env.MONGO_URI,
  PORT: process.env.PORT,
  secretOrKey: process.env.SECRET_OR_Key,
};
