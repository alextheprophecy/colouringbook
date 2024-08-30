const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
dotenv.config()

const URI = `mongodb+srv://alexandrebourgoin23:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.f2jrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
const CONNECT_DB = (uri= URI) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(uri).then(()=> {
        console.log('Database successfully connected!')
    }).catch((err)=>{
        console.log('Could not connect to database : ' + err)
    })
};


module.exports = CONNECT_DB;