const dotenv = require("dotenv");
dotenv.config();
module.exports = {
   url: process.env.DBCONFIG
   //url: 'mongodb://localhost:27017/ddep'
   //url: 'mongodb://192.168.254.233:27017/ddep'
}
