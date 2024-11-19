const User = require("../../models/user.model");
const Book2 = require("../../models/book2.model");
const { getFileUrl, image_data, getImage } = require("./files.controller");
const Feedback = require("../../models/feedback.model");
const Coupon = require('../../models/coupon.model');
const axios = require('axios');
const mongoose = require("mongoose").default;

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
    console.log('user', creditCost);
    return User.findOneAndUpdate(
        {_id: user.id, credits: {$gte: creditCost}}, {"$inc": {credits: -creditCost}}, {new: true}
    ).then((updatedUser) => {
        if(!updatedUser) throw new Error('Insufficient credits!')        
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

/**
 * Verify reCAPTCHA token
 * @param {string} token - The reCAPTCHA token to verify
 * @returns {Promise<boolean>}
 */
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
}

/**
 * Redeem a coupon code
 */
const redeemCoupon = async (req, res) => {
    try {
        const { couponCode, recaptchaToken } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email;

        // Validate input
        if (!couponCode || !recaptchaToken) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Verify reCAPTCHA
        const isRecaptchaValid = await verifyRecaptcha(recaptchaToken);
        if (!isRecaptchaValid) {
            return res.status(400).json({ message: 'Invalid reCAPTCHA' });
        }

        // Find and update the coupon
        const coupon = await Coupon.findOneAndUpdate(
            {
                code: couponCode.toUpperCase(),
                isRedeemed: false,
                expiresAt: { $gt: new Date() }
            },
            {
                isRedeemed: true,
                redeemedBy: {
                    userId: userId,
                    userEmail: userEmail,
                    redeemedAt: new Date()
                }
            },
            { new: true }
        );

        if (!coupon) {
            return res.status(403).json({ message: 'Invalid, expired, or already redeemed coupon code' });
        }

        // Update user credits
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { credits: coupon.credits } },
            { new: true }
        );

        if (!user) {
            // If user update fails, revert coupon status
            await Coupon.findByIdAndUpdate(
                coupon._id,
                {
                    isRedeemed: false,
                    redeemedBy: null
                }
            );
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'Coupon redeemed successfully',
            creditsAdded: coupon.credits,
            newTotal: user.credits
        });

    } catch (error) {
        console.error('Coupon redemption error:', error);
        res.status(500).json({ message: 'Failed to redeem coupon' });
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

module.exports = {    
    verifyCredits,
    getUserBooks,
    createBook,
    feedback,
    redeemCoupon,
    createCoupon,
    getCouponsList
}
