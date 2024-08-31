const User = require("../../models/user.model");
const {generateColouringBook} = require("../book/colouring_book.controller");

const generateUserBook = (req, res, next) => {
    const user = req.user
    console.log(user)
    const bookData = req.body

    checkCreditsSufficient(user, {greaterQuality: bookData.greaterQuality, imageCount: bookData.imageCount })
        .then((newCredits) => {
            user.credits = newCredits
            generateColouringBook(bookData, user, res)
            // res.status(200).json('valid')
        })
    .catch(err => res.status(400).send(err))
}



const checkCreditsSufficient = (user, {greaterQuality, imageCount}) => {
    const creditCost = imageCount * (greaterQuality?10:1)
    if(creditCost<=0) res.status(400).send('error calculating credits')

    return getUser(user.id).then(user => {
        if(!user) throw new Error('User not Found')
        const newSum = user.credits - creditCost
        if(newSum<0) throw new Error('Not enough credits')

        return User.updateOne({ id: user._id }, {credits: newSum}).exec().then(() => newSum)
    })
}

const getUser = (user) => User.findOne({ id: user.id })

module.exports =  generateUserBook
