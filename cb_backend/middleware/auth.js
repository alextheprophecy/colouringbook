const jwt = require("jsonwebtoken")
require("dotenv").config()
const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const access_token = authHeader.split(" ")[1];
        jwt.verify(access_token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err){ //access token expired
                res.status(401).json("Expired Token!")
               /* console.log('ERROR 1: ', err)
                jwt.verify(authHeader.refresh_token, process.env.JWT_REFRESH_SECRET, (err, user) => {
                    if(err) res.status(403).json("Refresh token expired. Login again!")
                    else res.status(401).json("Refresh token!")
                })*/
            }else{
                req.user = user
                next();
            }
        })
    } else {
        return res.status(403).json("You are not authenticated!")
    }
}

module.exports = {verifyToken}