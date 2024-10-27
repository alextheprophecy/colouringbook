const express =  require("express");
const {Register,Login, RefreshToken, RegisterForm} = require("../controllers/user/login.controller");
const {getUserBooks, createBook} = require("../controllers/user/user.controller");
const {verifyToken} = require("../middleware/auth");
const router = express.Router();

const testAuth = (req, res) => {
    res.status(200).send('OK! Good Job')
}



router.get('/registerForm', RegisterForm);
router.post('/register', Register);
router.post('/login', Login);
router.get('/getBooks', verifyToken, getUserBooks);
router.get('/refreshToken', RefreshToken)
router.get('/testAuth', verifyToken, testAuth)
router.post('/createBook', verifyToken, createBook)


module.exports = router;