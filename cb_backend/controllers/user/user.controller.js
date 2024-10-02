const User = require("../../models/user.model");
const Book = require("../../models/book.model");
const {generateColouringBook, genBookPDF} = require("../book/colouring_book.controller");
const {getBookImages} = require("../user/files.controller");
const {getPDF} = require("./files.controller");

const generateUserBook = (req, res) => {
    const user = req.user
    const bookData = req.body
    console.log("generating book for user: ", user.id)

    _checkCreditsSufficient(user, {greaterQuality: bookData.greaterQuality, imageCount: bookData.imageCount })
        .then((newCredits) => {
            console.log('has the credits')

            user.credits = newCredits
            generateColouringBook(bookData, user).then(pages =>
                res.status(200).json({credits_updated: user.credits, pages: pages})
            )
        })
    .catch(err => res.status(400).send(err))
}

const generateBookDescription = (req, res) => {
    let bookData = req.body
    bookData.onlyDescriptions = true
    generateColouringBook(bookData, req.user).then(bookDescr =>
        res.status(200).json(bookDescr)
    )
}

const getUserBooks = (req, res) => {
    const MAX_RETURNED_BOOKS = 7

    const user = req.user
    Book.find({ userId: user.id }).sort({createdAt: -1}).then(async (books) => {
        const books_data = await Promise.all(
            books.map((book, i) =>
                (i<MAX_RETURNED_BOOKS)?
                getBookImages(user, book).then(images => ({
                    id: book.id,
                    title: book.description,
                    date: book.createdAt,
                    has_pdf: book.has_pdf,
                    page_summaries: book.page_summaries,
                    pages: images
                })) :
                Promise.resolve(({
                    id: book.id,
                    title: book.description,
                    date: book.createdAt,
                    has_pdf: book.has_pdf
                }))
            )
        )

        console.log(books_data)
        res.status(200).send(books_data)
    })
}

const getBookPDF = (req, res) =>  {
    const user = req.user
    const book = req.query.book

    return Book.findOne({userId: user.id, _id: book.id}).then(b => {
        if(b.has_pdf) return getPDF(user, b).then(url => res.status(200).send(url))
        Promise.all([genBookPDF(user, b), Book.findOneAndUpdate({_id: b.id}, {has_pdf: true})])
            .then(_ =>
                getPDF(user, b).then(url => res.status(200).send(url))
            )
    })

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
