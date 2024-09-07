const User = require("../../models/user.model");
const Book = require("../../models/book.model");
const {generateColouringBook} = require("../book/colouring_book.controller");
const {getBookImages} = require("../external_apis/aws.controller");

const generateUserBook = (req, res, next) => {
    const user = req.user
    const bookData = req.body
    console.log('gonna create', JSON.stringify(user))
    console.log('book create', JSON.stringify(bookData))

    _checkCreditsSufficient(user, {greaterQuality: bookData.greaterQuality, imageCount: bookData.imageCount })
        .then((newCredits) => {
            console.log('has the credits')

            user.credits = newCredits
            generateColouringBook(bookData, user, res).then( (images) =>
                res.status(200).json({credits_updated: user.credits, images: images})
            )
        })
    .catch(err => res.status(400).send(err))
}

const generateBookDescription = (req, res) => {
    let bookData = req.query
    bookData.onlyDescriptions = true
    generateColouringBook(bookData, req.user, res).then(bookDescr =>
        res.status(200).json(bookDescr)
    )
}

const getUserBooks = (req, res, next) => {
    const user = req.user
    Book.find({ userId: user.id }).sort({createdAt: -1}).then(async (books) => {
        const books_data = await Promise.all(
            books.map(async (book) => ({
                id: book.id,
                title: book.description,
                pages: await getBookImages(user, book),
                date: book.createdAt,
                has_pdf: book.has_pdf
            }))
        )

        res.status(200).send(books_data)
    })
}

const getBookPDF = (req, res) =>  {
    const user = req.user
    const book = req.query.book
    if(book.has_pdf){
        getBookPDF()
        return res.status(200)
    }
    console.log(book)
    res.status(200).send(book.has_pdf)
}

const _checkCreditsSufficient = (user, {greaterQuality, imageCount}) => {
    const creditCost = imageCount * (greaterQuality?10:1)
    if(creditCost<=0) throw new Error('error calculating credits')


    return User.findOneAndUpdate(
        {_id: user.id, credits: {$gte: creditCost}}, {"$inc": {credits: -creditCost}}, {new: true}
    ).then((updatedUser) => {
        console.log('user', updatedUser)
        if(!updatedUser){
            throw new Error('Insufficient funds!')
        }
        return updatedUser.credits
    })
}

module.exports = {
    generateUserBook,
    getUserBooks,
    getBookPDF,
    generateBookDescription
}
