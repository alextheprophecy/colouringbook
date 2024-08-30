const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require("dotenv") //setting environment variables s.a. secret key
dotenv.config()

const PORT  = process.env.PORT || 5000 ;

//Database Connection
const CONNECTDB = require('./config/config')
CONNECTDB(process.env.MONGO_DB_URL);

const ImageRoute = require("./routes/image.route");
const UserRoute = require("./routes/user.route");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

//Routes
app.use("/api/image", ImageRoute);
app.use("/api/user", UserRoute);

//listen to the port
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);

})