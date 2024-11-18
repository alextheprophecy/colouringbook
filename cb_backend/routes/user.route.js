const express =  require("express");
const {UserControllers} = require("../controllers/user/login.controller");
const {getUserBooks, verifyCredits, createBook, feedback} = require("../controllers/user/user.controller");
const {verifyToken} = require("../middleware/auth");
const { googleAuth, googleAuthCallback, handleGoogleAuthSuccess, logout } = require('../controllers/user/passport.controller');
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

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback, handleGoogleAuthSuccess);
router.post('/logout', logout);

module.exports = router;