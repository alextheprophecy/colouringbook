const express = require("express");
const { getAllBooks, createCoupon, getCouponsList, getBookPDFUrl, getAllUsers, getAllFeedbacks } = require("../controllers/user/admin.controller");
const { verifyToken } = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

// Apply middlewares to all routes
router.use(verifyToken, isAdmin);

// Coupon routes
router.post('/coupons/create', createCoupon);
router.get('/coupons/list', getCouponsList);

// Books routes
router.get('/books/list', getAllBooks);
router.get('/books/:bookId/pdf', getBookPDFUrl);

router.get('/users/list', getAllUsers);

// Feedback routes
router.get('/feedbacks/list', getAllFeedbacks);

module.exports = router;