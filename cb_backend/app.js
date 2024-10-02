const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

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
app.use(cookieParser());

// Allow CORS for a specific origin with credentials //TODO: change!!!!!
const corsOptions = {
    origin: process.env.FRONTEND_CORS_ORIGIN, // Set the frontend origin here
    credentials: true, // Allow credentials (cookies, authorization headers)
}
app.use(cors(corsOptions));

//Routes
app.use("/api/image", ImageRoute);
app.use("/api/user", UserRoute);

//404 Error Handling
app.use((req, res) => {
    res.status(404).send('404: Page not Found');
});

//listen to the port
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
    console.log(`accepting requests from ${process.env.FRONTEND_CORS_ORIGIN}`);

})