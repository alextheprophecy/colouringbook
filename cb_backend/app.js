const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv") //setting environment variables s.a. secret key
dotenv.config()

const ImageRoute = require("./routes/image.route");


const app = express();

//const CONNECTDB = require(“../config/config”);

//Database Connection
//Connect.CONNECTDB(process.env.MONGO_DB_URL);

const PORT  = process.env.PORT || 5000 ;
//middlewares
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Routes
app.use("/api/image",ImageRoute);

//listen to the port
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);

})