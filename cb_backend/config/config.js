const mongoose = require("mongoose").default;
const dotenv = require("dotenv");
dotenv.config()

// Define both URIs
const PROD_URI = `mongodb+srv://alexandrebourgoin23:${encodeURIComponent(process.env.MONGO_PASSWORD)}@cluster0.f2jrp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const DEV_URI = 'mongodb://127.0.0.1:27017/cb_test_db';

// Select URI based on environment
const URI = process.env.NODE_ENV === 'production' ? PROD_URI : DEV_URI;

const CONNECT_DB = (uri = URI) => {
    mongoose.Promise = global.Promise;
    mongoose.connect(uri).then(()=> {
        console.log('Database successfully connected!')
    }).catch((err)=>{
        console.log('Could not connect to database : ' + err)
    })
};

module.exports = CONNECT_DB;