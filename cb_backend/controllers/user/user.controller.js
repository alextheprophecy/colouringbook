const User = require("../../models/user.model");
const Book2 = require("../../models/book2.model");
const { getFileUrl, image_data, getImage } = require("./files.controller");
const Feedback = require("../../models/feedback.model");

const getUserBooks = (req, res) => {
    const MAX_RETURNED_BOOKS = 7
    const MAX_IMAGE_BOOKS = 5
    const user = req.user
    const page = parseInt(req.query.page) || 0
    const skip = page * MAX_RETURNED_BOOKS

    Promise.all([
        Book2.find({ userId: user.id })
            .sort({createdAt: -1})
            .skip(skip)
            .limit(MAX_RETURNED_BOOKS)
            .exec(),
        Book2.countDocuments({ userId: user.id })
    ])
    .then(async ([books, totalCount]) => {
        const books_data = await Promise.all(
            books.map(async (book, index) => {
                const firstImage = page === 0 &&  index < MAX_IMAGE_BOOKS ? 
                    await getImage(user, book, 0) : null;

                return {
                    id: book.id,
                    title: book.title,
                    date: book.createdAt,
                    pageCount: book.pageCount,
                    coverImage: firstImage,
                    creationDate: book.createdAt
                };
            })
        );
        res.status(200).json({
            books: books_data,
            totalCount,
            hasMore: skip + books_data.length < totalCount
        });
    })
    .catch(error => {
        console.error('Error fetching books:', error);
        res.status(500).send('Error fetching books');
    });
};

const verifyCredits = (user, creditCost) => {
    if(creditCost<=0) throw new Error('Error negative credit cost')

    return User.findOneAndUpdate(
        {_id: user.id, credits: {$gte: creditCost}}, {"$inc": {credits: -creditCost}}, {new: true}
    ).then((updatedUser) => {
        if(!updatedUser || updatedUser.credits < creditCost) throw new Error('Insufficient funds!')        
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

const feedback = async (req, res) => {
    const MAX_COMMENT_LENGTH = 500;
    try {
        const user = req.user;
        const { rating, comment } = req.body;

        if (!rating) {
            return res.status(400).json({ error: 'Rating is required' });
        }

        const newFeedback = new Feedback({
            userId: user.id,
            rating,
            comment: comment ? comment.slice(0, MAX_COMMENT_LENGTH) : ''
        });

        await newFeedback.save();
        res.status(200).json({ message: 'Feedback received', success: true });
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).json({ error: 'Failed to save feedback' });
    }
};

module.exports = {    
    verifyCredits,
    getUserBooks,
    createBook,
    feedback
}
