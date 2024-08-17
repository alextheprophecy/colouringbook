const express = require('express');
const cors = require('cors');
const app = express();
const ImageRoute = require("./routes/image.route");


//const CONNECTDB = require(“../config/config”);

const PORT  = process.env.PORT || 5000 ;
//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

//Database Connection
//Connect.CONNECTDB(process.env.MONGO_DB_URL);

//Routes
app.use("/api/image",ImageRoute);

//listen to the port
app.listen(PORT, ()=> {
    console.log(`listening to port ${PORT}`);
})