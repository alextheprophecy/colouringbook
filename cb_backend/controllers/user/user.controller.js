const User = require("../../models/user.model");
const Book2 = require("../../models/book2.model");
const { getFileUrl, image_data, getImage } = require("./files.controller");

const getUserBooks = (req, res) => {
    const MAX_RETURNED_BOOKS = 7
    const user = req.user

    Book2.find({ userId: user.id })
        .sort({createdAt: -1})
        .then(async (books) => {
            const books_data = await Promise.all(
                books.slice(0, MAX_RETURNED_BOOKS).map(async book => {
                    const firstImage = await getImage(user, book, 0);

                    return {
                        id: book.id,
                        title: book.title,
                        date: book.createdAt,
                        pageCount: book.pageCount,
                        coverImage: firstImage
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
    createBook
}
