const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const passport = require('passport');

const dotenv = require("dotenv")
dotenv.config()

const PORT  = process.env.PORT || 5000 ;

//Database Connection
const CONNECT_DB = require('./config/config')
CONNECT_DB(process.env.MONGO_DB_URL);

const ImageRoute = require("./routes/image.route");
const UserRoute = require("./routes/user.route");

const app = express();

// Configure session before passport and routes
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Initialize passport after session
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

const developmentOrigins = [
    "http://localhost:3000",
    "http://172.20.10.2:3000",
];

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_CORS_ORIGIN 
        : developmentOrigins,
    credentials: true,
}
app.use(cors(corsOptions));

// Import passport config after middleware setup
require('./controllers/user/passport.controller');

//Routes
app.use("/api/image", ImageRoute);
app.use("/api/user", UserRoute);

//404 Error Handling
app.use((req, res) => {
    res.status(404).send('404: Page not Found');
});

app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
    console.log(`accepting requests from 
        ${process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_CORS_ORIGIN 
        : developmentOrigins}`);
});
