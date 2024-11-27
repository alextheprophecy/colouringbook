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
const AdminRoute = require("./routes/admin.route");

const app = express();


const developmentOrigins = [
    "http://localhost:3000",
    "http://172.20.10.2:3000",
];

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_CORS_ORIGIN 
        : developmentOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        // Standard headers
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        // Authentication
        'Authorization',
        // Custom headers your app needs
        'Cache-Control',
        'Pragma',
        'request-id',
        'x-requested-with'
    ],
    exposedHeaders: ['Set-Cookie'],
    preflightContinue: false,
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    }
}));

// Initialize passport after session
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
    console.log(`accepting requests from 
        ${process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_CORS_ORIGIN 
        : developmentOrigins}`);
});

// Import passport config after middleware setup
require('./controllers/user/passport.controller');

//Routes
app.use("/api/image", ImageRoute);
app.use("/api/user", UserRoute);
app.use("/api/admin", AdminRoute);
//404 Error Handling
app.use((req, res) => {
    res.status(404).send('404: Page not Found');
});


