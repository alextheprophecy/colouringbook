const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
dotenv.config()

const CONNECT_DB = (url) => {
    mongoose.connect(url).then(()=> {
        console.log("database is connected");
    }).catch((err)=>{
        console.log(err);
    })
};


module.exports = CONNECT_DB;