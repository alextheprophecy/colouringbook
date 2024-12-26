const express =  require("express");
const {UserControllers} = require("../controllers/user/login.controller");
const {getUserBooks, verifyCredits, createBook, feedback, redeemCoupon, createCoupon, getCouponsList} = require("../controllers/user/user.controller");
const {verifyToken} = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { googleAuth, googleAuthCallback, handleGoogleAuthSuccess, logout } = require('../controllers/user/passport.controller');
const { StripeController } = require('../controllers/external_apis/stripe.controller');
const router = express.Router();
const {RegisterForm, Register, Login, RefreshToken} = UserControllers

router.get('/registerForm', RegisterForm);
router.post('/register', Register);
router.post('/login', Login);
router.get('/refreshToken', RefreshToken)

// router.get('/testAuth', verifyToken, (req, res) => {res.status(200).send('OK! Good Job')})
router.get('/getBooks', verifyToken, getUserBooks);
router.post('/createBook', verifyToken, createBook)
router.post('/verifyCredits', verifyToken, verifyCredits)
router.post('/feedback', verifyToken, feedback)
router.post('/coupons/redeem', verifyToken, redeemCoupon)

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback, handleGoogleAuthSuccess);
router.post('/logout', logout);

// Stripe payment routes
router.post('/create-checkout-session', verifyToken, StripeController.createCheckoutSession);
router.post('/webhook', express.raw({type: 'application/json'}), StripeController.handleWebhook);

module.exports = router;