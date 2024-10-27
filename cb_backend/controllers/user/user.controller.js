const User = require("../../models/user.model");
const Book2 = require("../../models/book2.model");
const {generateColouringBook, genBookPDF} = require("../book/colouring_book.controller");
const {getBookImages} = require("../user/files.controller");
const {getPDF} = require("./files.controller");

const getUserBooks = (req, res) => {
    const MAX_RETURNED_BOOKS = 7
    const user = req.user

    Book2.find({ userId: user.id })
        .sort({createdAt: -1})
        .then(async (books) => {
            const books_data = await Promise.all(
                books.slice(0, MAX_RETURNED_BOOKS).map(async book => {
                    const [firstImage, pdfUrl] = await Promise.all([
                        getFileUrl(image_data(user.email, book.id, 0)),
                        book.has_pdf ? getPDF(user, book) : null
                    ]);

                    return {
                        id: book.id,
                        title: book.title,
                        date: book.createdAt,
                        coverImage: firstImage,
                        pdfUrl: pdfUrl
                    };
                })
            );
            res.status(200).send(books_data);
        })
        .catch(error => {
            console.error('Error fetching books:', error);
            res.status(500).send('Error fetching books');
        });
};

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

const verifyCredits = (user, creditCost) => {
    if(creditCost<=0) throw new Error('error negative credit cost')

    return User.findOneAndUpdate(
        {_id: user.id, credits: {$gte: creditCost}}, {"$inc": {credits: -creditCost}}, {new: true}
    ).then((updatedUser) => {
        if(!updatedUser || updatedUser.credits < creditCost)
            throw new Error('Insufficient funds!')        
        return updatedUser.credits
    })
}

const createBook = async (req, res) => {
    const user = req.user;
    const { title } = req.body;
    const book = new Book2({userId: user.id, title});
    await book.save();
    res.status(200).json({ book });
}


module.exports = {    
    verifyCredits,
    getUserBooks,
    getBookPDF,
    createBook
}
