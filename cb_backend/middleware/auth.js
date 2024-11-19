const jwt = require("jsonwebtoken")
const Book2 = require('../models/book2.model')
const verifyBlocked = require('./checkBlocked')

require("dotenv").config()

const verifyToken = (req,res,next) => {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const access_token = authHeader.split(" ")[1];
        jwt.verify(access_token, process.env.JWT_ACCESS_SECRET, (err, user) => {
            if (err){ //access token expired
                console.log("expired token ", err)
                res.status(401).json("Expired Token!")
            }else{
                req.user = user
                verifyBlocked(req, res, next);
            }
        })
    } else {
        return res.status(403).json("You are not authenticated!")
    }
}

const verifyBook = async (req, res, next) => {
    const bookId = req.query.bookId || req.body.bookId;
    
    if (bookId && req.user) {
        try {
            const book = await Book2.findOne({ 
                userId: req.user.id, 
                _id: bookId 
            });
            
            if (!book) {
                return res.status(404).json({ error: 'Book not found' });
            }else{
                req.book = book;
                next();   
            }         
        } catch (error) {
            return res.status(500).json({ error: 'Error verifying book' });
        }
    }else{
        return res.status(500).json({ error: 'Book id or no user' });    
    }
}

module.exports = {verifyToken, verifyBook}
