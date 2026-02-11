const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
mongoose.connect(MONGO_URL).then(()=>{
    console.log('connected to mongoDB');
}).catch((err)=>{
    console.log(err);
});

module.exports = mongoose;