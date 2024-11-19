const Book2 = require('../../models/book2.model');
const User = require('../../models/user.model');
const Coupon = require('../../models/coupon.model');
const { getBookPDF } = require('../book/colouring_book.controller');
const Feedback = require('../../models/feedback.model');

const getAllBooks = async (req, res) => {
    try {
        // First get all books
        const books = await Book2.find()
            .select('userId title pageCount finished createdAt')
            .sort({ createdAt: -1 });

        // Get all unique user IDs
        const userIds = [...new Set(books.map(book => book.userId))];
        
        // Fetch all users in one query
        const users = await User.find({ _id: { $in: userIds } })
            .select('_id email');

        // Create a map of user IDs to emails
        const userEmailMap = users.reduce((acc, user) => {
            acc[user._id] = user.email;
            return acc;
        }, {});

        // Add user email to each book
        const booksWithUserEmail = books.map(book => ({
            ...book.toObject(),
            userEmail: userEmailMap[book.userId] || 'Unknown User'
        }));

        res.status(200).json({
            success: true,
            books: booksWithUserEmail
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: error.message
        });
    }
};

/**
 * Create a new coupon code
 */
const createCoupon = async (req, res) => {
    try {
        const { adminFormData } = req.body;
        
        // Use custom code or generate one
        const code = adminFormData.code || Array(12)
            .fill(0)
            .map(() => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)])
            .join('');

        const coupon = new Coupon({
            code,
            credits: adminFormData.credits,
            expiresAt: new Date(Date.now() + adminFormData.expiresIn * 24 * 60 * 60 * 1000),
        });

        await coupon.save();

        res.json({
            message: 'Coupon created successfully',
            coupon: {
                code: coupon.code,
                credits: coupon.credits,
                expiresAt: coupon.expiresAt
            }
        });

    } catch (error) {
        console.error('Coupon creation error:', error);
        res.status(500).json({ 
            message: error.code === 11000 
                ? 'This coupon code already exists' 
                : 'Failed to create coupon'
        });
    }
};

const getCouponsList = async (req, res) => {
    try {
        const coupons = await Coupon.find({})
            .sort({ createdAt: -1 })
            .select('code credits expiresAt isRedeemed redeemedBy createdAt');

        res.json({
            coupons: coupons.map(coupon => ({
                code: coupon.code,
                credits: coupon.credits,
                expiresAt: coupon.expiresAt,
                isRedeemed: coupon.isRedeemed,
                redeemedBy: coupon.redeemedBy?.userEmail || null,
                redeemedAt: coupon.redeemedBy?.redeemedAt || null
            }))
        });
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Failed to fetch coupons' });
    }
};

const getBookPDFUrl = async (req, res) => {
    try {
        const book = await Book2.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Add book to request object as expected by getBookPDF
        req.book = book;
        
        // Call the existing getBookPDF function
        const user = await User.findById(book.userId);
        req.user = user;
        await getBookPDF(req, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching book PDF',
            error: error.message
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        // Get all users with basic info
        const users = await User.find()
            .select('email credits createdAt')
            .sort({ createdAt: -1 });

        // Get book counts for all users in one query
        const bookCounts = await Book2.aggregate([
            {
                $group: {
                    _id: '$userId',
                    totalBooks: { $sum: 1 },
                    finishedBooks: {
                        $sum: { $cond: ['$finished', 1, 0] }
                    }
                }
            }
        ]);

        // Create a map of user IDs to book counts
        const bookCountMap = bookCounts.reduce((acc, curr) => {
            acc[curr._id] = {
                total: curr.totalBooks,
                finished: curr.finishedBooks
            };
            return acc;
        }, {});

        // Combine user data with book counts
        const enrichedUsers = users.map(user => ({
            ...user.toObject(),
            books: bookCountMap[user._id] || { total: 0, finished: 0 }
        }));

        res.status(200).json({
            success: true,
            users: enrichedUsers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

const getAllFeedbacks = async (req, res) => {
    try {
        // Get all feedbacks with user information
        const feedbacks = await Feedback.find()
            .populate('userId', 'email')
            .sort({ createdAt: -1 });

        // Transform the data to include user email
        const transformedFeedbacks = feedbacks.map(feedback => ({
            _id: feedback._id,
            rating: feedback.rating,
            comment: feedback.comment,
            route: feedback.route,
            userEmail: feedback.userId ? feedback.userId.email : 'Anonymous',
            createdAt: feedback.createdAt
        }));

        res.status(200).json({
            success: true,
            feedbacks: transformedFeedbacks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching feedbacks',
            error: error.message
        });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;
        
        const deletedFeedback = await Feedback.findByIdAndDelete(feedbackId);
        
        if (!deletedFeedback) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feedback deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting feedback',
            error: error.message
        });
    }
};

module.exports = {
    getAllBooks,
    createCoupon,
    getCouponsList,
    getBookPDFUrl,
    getAllUsers,
    getAllFeedbacks,
    deleteFeedback,
};
